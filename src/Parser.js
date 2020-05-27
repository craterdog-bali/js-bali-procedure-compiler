/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM).  All Rights Reserved.     *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.        *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative. (See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/**
 * This module provides a class that parses a document containing instructions
 * for the Bali Nebula™ virtual processor and produce the corresponding list of
 * instructions.
 */
const antlr = require('antlr4');
const ErrorStrategy = require('antlr4/error/ErrorStrategy');
const bali = require('bali-component-framework').api(1);
const grammar = require('./grammar');
const types = require('./Types');
const EOL = '\n';  // POSIX end of line character


// PUBLIC FUNCTIONS

/**
 * This class implements a parser that parses strings containing instructions for the
 * Bali Nebula™ virtual processor and generates the corresponding parse tree structures.
 *
 * @constructor
 * @param {Boolean} debug Whether of not the parser should be run in debug mode, the
 * default is false. Debug mode is only useful for debugging the language grammar and
 * need not be used otherwise.
 * @returns {Parser} The new string parser.
 */
function Parser(debug) {
    this.debug = debug || false;
    return this;
}
Parser.prototype.constructor = Parser;
exports.Parser = Parser;
exports.parser = new Parser();


/**
 * This function takes a string containing instructions for the Bali Nebula™ virtual processor
 * and parses it into a list of instructions.
 *
 * @param {String} assembly The assembly code defining the instructions.
 * @returns {List} The resulting list of instructions.
 */
Parser.prototype.parseInstructions = function(assembly) {
    const parser = initializeParser(assembly, this.debug);
    const antlrTree = parser.document();
    const list = convertParseTree(antlrTree);
    return list;
};


// PRIVATE FUNCTIONS

function initializeParser(document, debug) {
    debug = debug || false;
    const chars = new antlr.InputStream(document);
    const lexer = new grammar.DocumentLexer(chars);
    const listener = new CustomErrorListener(debug);
    lexer.removeErrorListeners();
    lexer.addErrorListener(listener);
    const tokens = new antlr.CommonTokenStream(lexer);
    const parser = new grammar.DocumentParser(tokens);
    parser.buildParseTrees = true;
    parser.removeErrorListeners();
    parser.addErrorListener(listener);
    parser._errHandler = new CustomErrorStrategy(debug);
    return parser;
}


function convertParseTree(antlrTree) {
    const visitor = new ParsingVisitor();
    antlrTree.accept(visitor);
    const instructions = visitor.result;
    return instructions;
}


// PRIVATE CLASSES

function ParsingVisitor() {
    grammar.DocumentVisitor.call(this);
    return this;
}
ParsingVisitor.prototype = Object.create(grammar.DocumentVisitor.prototype);
ParsingVisitor.prototype.constructor = ParsingVisitor;


// document: EOL* instructions EOL* EOF
ParsingVisitor.prototype.visitDocument = function(ctx) {
    ctx.instructions().accept(this);
};


// instructions: step (EOL step)*
ParsingVisitor.prototype.visitInstructions = function(ctx) {
    const instructions = bali.list();
    const steps = ctx.step();
    steps.forEach(function(step) {
        step.accept(this);
        instructions.addItem(this.result);
    }, this);
    this.result = instructions;
};


// step: label? instruction
ParsingVisitor.prototype.visitStep = function(ctx) {
    ctx.instruction().accept(this);
    const instruction = this.result;
    const label = ctx.label();
    if (label) {
        label.accept(this);
        instruction.setValue('$label', this.result);
    }
    this.result = instruction;
};


// label: EOL? LABEL ':' EOL
ParsingVisitor.prototype.visitLabel = function(ctx) {
    this.result = bali.text(ctx.LABEL().getText());
};


// comment: COMMENT
ParsingVisitor.prototype.visitComment = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.NOTE);
    const comment = ctx.children[0].getText();
    instruction.setValue('$comment', comment);
    this.result = instruction;
};


// skipInstruction: 'SKIP INSTRUCTION'
ParsingVisitor.prototype.visitSkipInstruction = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.SKIP);
    this.result = instruction;
};


// jumpInstruction:
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'NONE' |
//     'JUMP' 'TO' LABEL 'ON' 'TRUE' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE'
ParsingVisitor.prototype.visitJumpInstruction = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.JUMP);
    var modifier = types.ON_ANY;
    if (ctx.children.length > 3) {
        modifier = types.jumpModifierValue(ctx.children[3].getText() + ' ' + ctx.children[4].getText());
    }
    instruction.setValue('$modifier', modifier);
    instruction.setValue('$operand', bali.text(ctx.LABEL().getText()));
    this.result = instruction;
};


// pushInstruction:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'LITERAL' LITERAL |
//     'PUSH' 'CONSTANT' SYMBOL |
//     'PUSH' 'ARGUMENT' SYMBOL
ParsingVisitor.prototype.visitPushInstruction = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.PUSH);
    const modifier = types.pushModifierValue(ctx.children[1].getText());
    instruction.setValue('$modifier', modifier);
    const operand = ctx.children[2].getText();
    var value;
    switch (modifier) {
        case types.HANDLER:
            value = bali.text(operand);  // treat the label as text
            break;
        case types.LITERAL:
            value = bali.component(operand.slice(1, -1));  // remove the back tick delimeters
            break;
        case types.CONSTANT:
        case types.ARGUMENT:
            value = bali.component(operand);
            break;
    }
    instruction.setValue('$operand', value);
    this.result = instruction;
};


// pullInstruction:
//     'PULL' 'HANDLER' |
//     'PULL' 'COMPONENT' |
//     'PULL' 'RESULT' |
//     'PULL' 'EXCEPTION'
ParsingVisitor.prototype.visitPullInstruction = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.PULL);
    instruction.setValue('$modifier', types.pullModifierValue(ctx.children[1].getText()));
    this.result = instruction;
};


// loadInstruction:
//     'LOAD' 'VARIABLE' SYMBOL |
//     'LOAD' 'MESSAGE' SYMBOL |
//     'LOAD' 'DRAFT' SYMBOL |
//     'LOAD' 'DOCUMENT' SYMBOL
ParsingVisitor.prototype.visitLoadInstruction = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.LOAD);
    instruction.setValue('$modifier', types.loadModifierValue(ctx.children[1].getText()));
    const symbol = ctx.children[2].getText();
    instruction.setValue('$operand', bali.component(symbol));
    this.result = instruction;
};


// saveInstruction:
//     'SAVE' 'VARIABLE' SYMBOL |
//     'SAVE' 'MESSAGE' SYMBOL |
//     'SAVE' 'DRAFT' SYMBOL |
//     'SAVE' 'DOCUMENT' SYMBOL
ParsingVisitor.prototype.visitSaveInstruction = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.SAVE);
    instruction.setValue('$modifier', types.saveModifierValue(ctx.children[1].getText()));
    const symbol = ctx.children[2].getText();
    instruction.setValue('$operand', bali.component(symbol));
    this.result = instruction;
};


// dropInstruction:
//     'DROP' 'VARIABLE' SYMBOL |
//     'DROP' 'MESSAGE' SYMBOL |
//     'DROP' 'DRAFT' SYMBOL |
//     'DROP' 'DOCUMENT' SYMBOL
ParsingVisitor.prototype.visitDropInstruction = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.DROP);
    instruction.setValue('$modifier', types.dropModifierValue(ctx.children[1].getText()));
    const symbol = ctx.children[2].getText();
    instruction.setValue('$operand', bali.component(symbol));
    this.result = instruction;
};


// callInstruction:
//     'CALL' SYMBOL |
//     'CALL' SYMBOL 'WITH' '1' 'ARGUMENT' |
//     'CALL' SYMBOL 'WITH' NUMBER 'ARGUMENTS'
ParsingVisitor.prototype.visitCallInstruction = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.CALL);
    var modifier = 0;
    if (ctx.children.length === 5) modifier = Number(ctx.children[3].getText());
    instruction.setValue('$modifier', modifier);
    instruction.setValue('$operand', bali.component(ctx.SYMBOL().getText()));
    this.result = instruction;
};


// sendInstruction:
//     'SEND' SYMBOL 'TO' 'COMPONENT' |
//     'SEND' SYMBOL 'TO' 'COMPONENT' 'WITH' 'ARGUMENTS' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' |
//     'SEND' SYMBOL 'TO' 'DOCUMENT' 'WITH' 'ARGUMENTS'
ParsingVisitor.prototype.visitSendInstruction = function(ctx) {
    const instruction = bali.catalog();
    instruction.setValue('$operation', types.SEND);
    var string = '';
    for (var i = 2; i < ctx.children.length; i++) {
        string += ctx.children[i].getText() + ' ';
    }
    string = string.slice(0, -1);  // strip off last space
    const modifier = types.sendModifierValue(string);
    instruction.setValue('$modifier', modifier);
    instruction.setValue('$operand', bali.component(ctx.SYMBOL().getText()));
    this.result = instruction;
};


// CUSTOM ERROR HANDLING

// override the recover method in the lexer to fail fast
grammar.DocumentLexer.prototype.recover = function(e) {
    throw e;
};


function CustomErrorStrategy(debug) {
    this.debug = debug || false;
    ErrorStrategy.DefaultErrorStrategy.call(this);
    return this;
}
CustomErrorStrategy.prototype = Object.create(ErrorStrategy.DefaultErrorStrategy.prototype);
CustomErrorStrategy.prototype.constructor = CustomErrorStrategy;


CustomErrorStrategy.prototype.reportError = function(recognizer, e) {
    recognizer.notifyErrorListeners(e.message, recognizer.getCurrentToken(), e);
};


CustomErrorStrategy.prototype.recover = function(recognizer, e) {
    var context = recognizer._ctx;
    while (context !== null) {
        context.exception = e;
        context = context.parentCtx;
    }
    const exception = bali.exception({
        $module: '/bali/compiler/Parser',
        $procedure: '$parseAssembly',
        $exception: '$syntaxError',
        $message: '"' + e.message + '"'
    });
    if (this.debug) console.error(exception.toString());
    throw exception;
};


CustomErrorStrategy.prototype.recoverInline = function(recognizer) {
    const exception = new antlr.error.InputMismatchException(recognizer);
    this.reportError(recognizer, exception);
    this.recover(recognizer, exception);
};


CustomErrorStrategy.prototype.sync = function(recognizer) {
    // ignore for efficiency
};


function CustomErrorListener(debug) {
    antlr.error.ErrorListener.call(this);
    this.debug = debug || false;
    this.exactOnly = false;  // 'true' results in uninteresting ambiguities so leave 'false'
    return this;
}
CustomErrorListener.prototype = Object.create(antlr.error.ErrorListener.prototype);
CustomErrorListener.prototype.constructor = CustomErrorListener;


CustomErrorListener.prototype.syntaxError = function(recognizer, offendingToken, lineNumber, columnNumber, message, e) {
    // create the error message
    const token = offendingToken ? recognizer.getTokenErrorDisplay(offendingToken) : '';
    const input = token ? offendingToken.getInputStream() : recognizer._input;
    const lines = input.toString().split(EOL);
    const character = lines[lineNumber - 1][columnNumber];
    if (!token) {
        message = "An unexpected character was encountered: '" + character + "'";
    } else {
        message = 'An invalid token was encountered: ' + token;
    }
    message = addContext(recognizer, message);

    // stop the processing
    const exception = bali.exception({
        $module: '/bali/compiler/Parser',
        $procedure: '$parseAssembly',
        $exception: '$syntaxError',
        $message: message
    });

    // log the error message if in debug mode
    if (this.debug) console.error(exception.toString());
    throw exception;
};


CustomErrorListener.prototype.reportAmbiguity = function(recognizer, dfa, startIndex, stopIndex, exact, alternatives, configs) {
    if (this.debug) {
        const rule = getRule(recognizer, dfa);
        alternatives = [];
        configs.items.forEach(function(item) {
            alternatives.push(item.alt);
        });
        alternatives = "{" + alternatives.join(", ") + "}";
        var message = 'The parser encountered ambiguous input for rule: ' + rule + ', alternatives: ' + alternatives;
        message = addContext(recognizer, message);
        console.error(message);
    }
};


CustomErrorListener.prototype.reportContextSensitivity = function(recognizer, dfa, startIndex, stopIndex, prediction, configs) {
    if (this.debug) {
        const rule = getRule(recognizer, dfa);
        var message = 'The parser encountered a context sensitive rule: ' + rule;
        message = addContext(recognizer, message);
        console.error(message);
    }
};


// PRIVATE FUNCTIONS

function getRule(recognizer, dfa) {
    const description = dfa.decision.toString();
    const ruleIndex = dfa.atnStartState.ruleIndex;

    const ruleNames = recognizer.ruleNames;
    if (ruleIndex < 0 || ruleIndex >= ruleNames.length) {
        return description;
    }
    const ruleName = ruleNames[ruleIndex] || '<unknown>';
    return description + " (" + ruleName + ")";
}


function addContext(recognizer, message) {
    // truncate the main message as needed
    message = EOL + '    ' + message.slice(0, 160) + EOL;

    // add the lines before and after the invalid line and highlight the invalid token
    const offendingToken = recognizer._precedenceStack ? recognizer.getCurrentToken() : undefined;
    const token = offendingToken ? recognizer.getTokenErrorDisplay(offendingToken) : '';
    const input = token ? offendingToken.getInputStream() : recognizer._input;
    const lines = input.toString().split(EOL);
    const lineNumber = token ? offendingToken.line : recognizer._tokenStartLine;
    const columnNumber = token ? offendingToken.column : recognizer._tokenStartColumn;
    if (lineNumber > 1) {
        message += '    [' + (lineNumber - 1) + ']: ' + lines[lineNumber - 2] + EOL;
    }
    message += '    [' + lineNumber + ']: ' + lines[lineNumber - 1] + EOL;
    var line = '    [' + lineNumber + ']: ';
    for (var i = 0; i < columnNumber; i++) {
        line += ' ';
    }
    var start = token ? offendingToken.start : columnNumber;
    const stop = token ? offendingToken.stop : columnNumber;
    while (start++ <= stop) {
        line += '^';
    }
    message += line + EOL;
    if (lineNumber < lines.length) {
        message += '    [' + (lineNumber + 1) + ']: ' + lines[lineNumber] + EOL;
    }
    return message;
}
