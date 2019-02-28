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
 * This module defines a class that formats a list of instructions into a
 * into the canonical source code string representing the instructions.
 */
const bali = require('bali-component-framework');
const types = require('./Types');


// PUBLIC FUNCTIONS

/**
 * This class implements a formatter that formats an instruction list into its
 * corresponding source code in a canonical way.
 * 
 * @constructor
 * @param {Number} indentation The number of levels of indentation that should be inserted
 * to each formatted line. The default is zero.
 * @returns {Formatter} The new component formatter.
 */
function Formatter(indentation) {

    // the indentation is a private attribute so methods that use it are defined in the constructor
    indentation = indentation || 0;
    if (typeof indentation !== 'number') {
        throw bali.exception({
            $module: '$Formatter',
            $procedure: '$Formatter',
            $exception: '$invalidParameter',
            $parameter: indentation,
            $message: '"The indentation parameter should be the number of levels to indent."'
        });
    }

    this.formatInstructions = function(instructions) {
        const visitor = new FormattingVisitor(indentation);
        instructions.acceptVisitor(visitor);
        return visitor.source;
    };

    return this;
}
Formatter.prototype.constructor = Formatter;
exports.Formatter = Formatter;
exports.formatter = new Formatter();


// PRIVATE CLASSES

const EOL = '\n';  // POSIX end of line character


function FormattingVisitor(indentation) {
    this.indentation = indentation;
    this.source = '';
    for (var i = 0; i < this.indentation; i++) {
        this.source += '    ';
    }
    return this;
}
FormattingVisitor.prototype.constructor = FormattingVisitor;


FormattingVisitor.prototype.appendNewline = function() {
    this.source += EOL;
    for (var i = 0; i < this.indentation; i++) {
        this.source += '    ';
    }
};


// document: EOL* instructions EOL* EOF
// instructions: step (EOL step)*
FormattingVisitor.prototype.visitList = function(procedure) {
    const iterator = procedure.getIterator();
    var step = iterator.getNext();
    step.acceptVisitor(this);
    while (iterator.hasNext()) {
        this.appendNewline();
        step = iterator.getNext();
        step.acceptVisitor(this);
    }
};


// step: label? instruction
// label: EOL? LABEL ':' EOL
FormattingVisitor.prototype.visitCatalog = function(step) {
    const label = step.getValue('$label');
    if (label) {
        // labels are preceded by a blank line unless they are part of the first step
        if (this.source.length > 4 * this.indentation) this.appendNewline();
        this.source += label.getValue() + ':';
        this.appendNewline();
    }
    const operation = step.getValue('$operation').toNumber();
    switch (operation) {
        case types.JUMP:
            this.visitJumpInstruction(step);
            break;
        case types.PUSH:
            this.visitPushInstruction(step);
            break;
        case types.POP:
            this.visitPopInstruction(step);
            break;
        case types.LOAD:
            this.visitLoadInstruction(step);
            break;
        case types.STORE:
            this.visitStoreInstruction(step);
            break;
        case types.INVOKE:
            this.visitInvokeInstruction(step);
            break;
        case types.EXECUTE:
            this.visitExecuteInstruction(step);
            break;
        case types.HANDLE:
            this.visitHandleInstruction(step);
            break;
        default:
            throw bali.exception({
                $module: '$Formatter',
                $procedure: '$visitCatalog',
                $exception: '$invalidOperation',
                $expected: bali.range(0, 7),
                $actual: operation,
                $step: step,
                $message: 'An invalid operation was found in a procedure step.'
            });
    }
};


// jumpInstruction:
//     'JUMP' 'TO' LABEL |
//     'JUMP' 'TO' LABEL 'ON' 'NONE' |
//     'JUMP' 'TO' LABEL 'ON' 'TRUE' |
//     'JUMP' 'TO' LABEL 'ON' 'FALSE'
FormattingVisitor.prototype.visitJumpInstruction = function(instruction) {
    var modifier = instruction.getValue('$modifier');
    if (!modifier) {
        this.source += 'SKIP INSTRUCTION';
    } else {
        this.source += 'JUMP TO ';
        const operand = instruction.getValue('$operand').getValue();
        this.source += operand;
        modifier = modifier.toNumber();
        if (modifier !== types.ON_ANY) {
            this.source += ' ';
            this.source += types.jumpModifierString(modifier);
        }
    }
};


// pushInstruction:
//     'PUSH' 'HANDLER' LABEL |
//     'PUSH' 'LITERAL' LITERAL |
//     'PUSH' 'CONSTANT' SYMBOL |
//     'PUSH' 'PARAMETER' SYMBOL |
FormattingVisitor.prototype.visitPushInstruction = function(instruction) {
    this.source += 'PUSH ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.pushModifierString(modifier);
    this.source += ' ';
    var operand = instruction.getValue('$operand');
    switch (modifier) {
        case types.HANDLER:
            operand = operand.getValue();
            break;
        case types.LITERAL:
            const formatter = new bali.Formatter(this.indentation);
            operand = '`' + formatter.formatComponent(operand) + '`';
            break;
        case types.CONSTANT:
        case types.PARAMETER:
            // leave it as a symbol
            break;
    }
    this.source += operand;
};


// popInstruction:
//     'POP' 'HANDLER' |
//     'POP' 'COMPONENT'
FormattingVisitor.prototype.visitPopInstruction = function(instruction) {
    this.source += 'POP ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.popModifierString(modifier);
};


// loadInstruction:
//     'LOAD' 'VARIABLE' variable |
//     'LOAD' 'MESSAGE' variable |
//     'LOAD' 'DRAFT' variable |
//     'LOAD' 'DOCUMENT' variable
FormattingVisitor.prototype.visitLoadInstruction = function(instruction) {
    this.source += 'LOAD ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.loadModifierString(modifier);
    this.source += ' ';
    const operand = instruction.getValue('$operand').toString();
    this.source += operand;
};


// storeInstruction:
//     'STORE' 'VARIABLE' variable |
//     'STORE' 'MESSAGE' variable |
//     'STORE' 'DRAFT' variable |
//     'STORE' 'DOCUMENT' variable
FormattingVisitor.prototype.visitStoreInstruction = function(instruction) {
    this.source += 'STORE ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.storeModifierString(modifier);
    this.source += ' ';
    const operand = instruction.getValue('$operand').toString();
    this.source += operand;
};


// invokeInstruction:
//     'INVOKE' SYMBOL |
//     'INVOKE' SYMBOL 'WITH' 'PARAMETER' |
//     'INVOKE' SYMBOL 'WITH' NUMBER 'PARAMETERS'
FormattingVisitor.prototype.visitInvokeInstruction = function(instruction) {
    this.source += 'INVOKE ';
    this.source += instruction.getValue('$operand');
    const modifier = instruction.getValue('$modifier').toNumber();
    if (modifier > 0) {
        this.source += ' WITH ';
        if (modifier > 1) {
            this.source += modifier;
            this.source += ' PARAMETERS';
        } else {
            this.source += 'PARAMETER';
        }
    }
};


// executeInstruction:
//     'EXECUTE' SYMBOL |
//     'EXECUTE' SYMBOL 'WITH' 'PARAMETERS' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' |
//     'EXECUTE' SYMBOL 'ON' 'TARGET' 'WITH' 'PARAMETERS'
FormattingVisitor.prototype.visitExecuteInstruction = function(instruction) {
    this.source += 'EXECUTE ';
    this.source += instruction.getValue('$operand');
    const modifier = instruction.getValue('$modifier').toNumber();
    if (modifier !== types.WITH_NOTHING) {
        this.source += ' ';
        this.source += types.executeModifierString(modifier);
    }
};


// handleInstruction:
//     'HANDLE' 'EXCEPTION' |
//     'HANDLE' 'RESULT'
FormattingVisitor.prototype.visitHandleInstruction = function(instruction) {
    this.source += 'HANDLE ';
    const modifier = instruction.getValue('$modifier').toNumber();
    this.source += types.handleModifierString(modifier);
};
