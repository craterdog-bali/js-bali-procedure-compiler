/************************************************************************
 * Copyright (c) Crater Dog Technologies(TM). All Rights Reserved.    *
 ************************************************************************
 * DO NOT ALTER OR REMOVE COPYRIGHT NOTICES OR THIS FILE HEADER.       *
 *                                                                      *
 * This code is free software; you can redistribute it and/or modify it *
 * under the terms of The MIT License (MIT), as published by the Open   *
 * Source Initiative.(See http://opensource.org/licenses/MIT)          *
 ************************************************************************/
'use strict';

/**
 * This library encapsulates the intrinsic functions supported by the Bali Nebula™
 * Virtual Processor. The functions use the following naming convention:
 * <pre>
 *  1. Functions that return a component or part of a component are named using noun or
 *     adjective phrases.
 *  2. Functions that modify something are named using verb phrases.
 *  3. Functions that ask a question return a boolean value.
 * </pre>
 */
const hasher = require('crypto');
const Compiler = require('./Compiler').Compiler;

// This private constant sets the POSIX end of line character
const EOL = '\n';

// PUBLIC INTERFACE

/**
 * This function returns the public interace for the virtual machine intrinsic functions.
 *
 * @param {Boolean|Number} debug An optional number in the range 0..3 that controls
 * the level of debugging that occurs:
 * <pre>
 *   0 (or false): debugging turned off
 *   1 (or true): log exceptions to console.error
 *   2: perform argument validation and log exceptions to console.error
 *   3: perform argument validation and log exceptions to console.error and debug info to console.log
 * </pre>
 * @returns {Object} An object that implements the intrinsic functions interface.
 */
exports.api = function(debug) {
    if (debug === null || debug === undefined) debug = 0;  // default is off
    const bali = require('bali-component-framework').api(debug);
    const compiler = new Compiler(debug);
    const validator = bali.validator(debug);
    const generator = bali.generator(debug);

    // PUBLIC FUNCTIONS

    /**
     * This function returns the virtual machine index for the specified intrinsic function name.
     *
     * @param {Number} index The index of the intrinsic function.
     * @returns {String} The name of the corresponding intrinsic function.
     */
    const name = function(index) {
        const result = names[index];
        if (!result) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: '$name',
                $exception: '$invalidIndex',
                $name: name,
                $text: 'Attempted to retrieve the name of an invalid intrinsic function.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        return result;
    };

    /**
     * This function returns the virtual machine index for the specified intrinsic function name.
     *
     * @param {String} name The name of the intrinsic function.
     * @returns {Number} The index of the corresponding intrinsic function.
     */
    const index = function(name) {
        const result = names.indexOf(name);
        if (result < 1) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: '$index',
                $exception: '$invalidName',
                $name: name,
                $text: 'Attempted to retrieve the index of an invalid intrinsic function.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        return result;
    };

    /**
     * This function invokes the intrinsic function associated with the specified index using
     * the specified arguments.
     *
     * @param {Number} index The index of the intrinsic function to invoke.
     * @param {Component} argument1 The first argument.
     * @param {Component} argument2 The second argument.
     * @param {Component} argument3 The second argument.
     * @returns {Object} The result of the intrinsic function invocation.
     */
    const invoke = function(index, argument1, argument2, argument3) {
        if (index < 1 || index >= names.length) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: '$invoke',
                $exception: '$invalidIndex',
                $index: index,
                $text: 'Attempted to invoke an intrinsic function using an invalid index.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        return functions[index](argument1, argument2, argument3);
    };


    // PRIVATE FUNCTIONS

    const validateTypeArgument = function(procedure, type, argument) {
        if (argument && argument.isComponent && (argument.isType(type) || argument.supportsInterface(type))) return;
        const exception = bali.exception({
            $module: '/bali/compiler/Intrinsics',
            $procedure: procedure,
            $exception: '$argumentType',
            $expected: type,
            $actual: bali.type(argument),
            $text: 'An argument passed into an intrinsic function does not have the required type.'
        });
        if (debug > 0) console.error(exception.toString());
        throw exception;
    };

    const validateOptionalTypeArgument = function(procedure, type, argument) {
        if (argument === null || argument === undefined || bali.pattern.NONE.isEqualTo(argument)) return undefined;
        validateTypeArgument(procedure, type, argument);
        return argument;
    };

    const validateSameType = function(procedure, first, second) {
        const firstType = first.getType();
        const secondType = second.getType();
        if (firstType !== secondType) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentType',
                $first: firstType,
                $second: secondType,
                $text: 'The arguments passed into the intrinsic function are not the same type.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };

    const validateIndex = function(procedure, size, index) {
        if (size === 0) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentValue',
                $text: 'An empty sequence cannot be accessed with an index.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        if (Math.round(index) !== index) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentType',
                $index: index,
                $text: 'The index passed into the intrinsic function is not an integer.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
        index = Math.abs(index);  // handle reverse indexing
        if (index === 0 || index > size) {
            const exception = bali.exception({
                $module: '/bali/compiler/Intrinsics',
                $procedure: procedure,
                $exception: '$argumentValue',
                $expected: bali.range(1, size),
                $actual: index,
                $text: 'An invalid index was passed into an intrinsic function.'
            });
            if (debug > 0) console.error(exception.toString());
            throw exception;
        }
    };

    const citeDocument = function(document) {
        // extract the required attributes
        const tag = document.getParameter('$tag');
        const version = document.getParameter('$version');

        // generate a digest of the document
        const bytes = Buffer.from(document.toString(), 'utf8');
        const hash = hasher.createHash('sha512');
        hash.update(bytes);
        const digest = bali.binary(hash.digest());

        // create the citation
        const citation = bali.catalog({
            $protocol: 'v2',
            $tag: tag,
            $version: version,
            $digest: digest
        }, {
            $type: '/bali/notary/Citation/v1'
        });

        return citation;
    };


    /*
     * The list of intrinsic functions supported by the virtual machine.
     */
    const intrinsics = {

        $invalid: function() {
            throw new Error('PROCESSOR: No intrinsic function should have an index of zero.');
        },

        $addItem: function(collection, item) {
            validateTypeArgument('$addItem', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$addItem', '/bali/abstractions/Component', item);
            collection.addItem(item);
            return collection;
        },

        $addItems: function(collection, items) {
            validateTypeArgument('$addItems', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$addItems', '/bali/abstractions/Collection', items);
            collection.addItems(items);
            return collection;
        },

        $ancestry: function(component) {
            validateTypeArgument('$ancestry', '/bali/interfaces/Reflective', component);
            return bali.list(component.getAncestry());
        },

        $and: function(first, second) {
            validateTypeArgument('$and', '/bali/libraries/Logical', first);
            validateTypeArgument('$and', '/bali/libraries/Logical', second);
            validateSameType('$and', first, second);
            return first.constructor.and(first, second);
        },

        $arccosine: function(ratio) {
            validateTypeArgument('$arccosine', '/bali/interfaces/Continuous', ratio);
            return bali.angle.arccosine(ratio.toReal());
        },

        $arcsine: function(ratio) {
            validateTypeArgument('$arcsine', '/bali/interfaces/Continuous', ratio);
            return bali.angle.arcsine(ratio.toReal());
        },

        $arctangent: function(opposite, adjacent) {
            validateTypeArgument('$arctangent', '/bali/interfaces/Continuous', opposite);
            validateTypeArgument('$arctangent', '/bali/interfaces/Continuous', adjacent);
            return bali.angle.arctangent(opposite.toReal(), adjacent.toReal());
        },

        $areEqual: function(first, second) {
            validateTypeArgument('$areEqual', '/bali/interfaces/Comparable', first);
            validateTypeArgument('$areEqual', '/bali/interfaces/Comparable', second);
            return bali.boolean(first.isEqualTo(second));
        },

        $areSame: function(first, second) {
            validateTypeArgument('$areSame', '/bali/interfaces/Comparable', first);
            validateTypeArgument('$areSame', '/bali/interfaces/Comparable', second);
            return bali.boolean(first === second);
        },

        $association: function(key, value) {
            validateTypeArgument('$association', '/bali/abstractions/Element', key);
            validateTypeArgument('$association', '/bali/abstractions/Component', value);
            return bali.association(key, value);
        },

        $attribute: function(composite, key) {
            validateTypeArgument('$attribute', '/bali/interfaces/Structural', composite);
            validateTypeArgument('$attribute', '/bali/abstractions/Element', key);
            return composite.getAttribute(key) || bali.pattern.NONE;
        },

        $attributes: function(catalog, keys) {
            validateTypeArgument('$attributes', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$attributes', '/bali/collections/List', keys);
            return catalog.getAttributes(keys);
        },

        $authority: function(resource) {
            validateTypeArgument('$authority', '/bali/elements/Resource', resource);
            return bali.text(resource.getAuthority());
        },

        $base2: function(binary, indentation) {
            validateTypeArgument('$base2', '/bali/elements/Binary', binary);
            indentation = validateOptionalTypeArgument('$base2', '/bali/interfaces/Discrete', indentation);
            indentation = indentation || 0;
            if (indentation) {
                indentation = indentation.toInteger();
                validateIndex('$base2', 10, indentation);
            }
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base2Encode(binary.getValue()));
        },

        $base16: function(binary, indentation) {
            validateTypeArgument('$base16', '/bali/elements/Binary', binary);
            indentation = validateOptionalTypeArgument('$base16', '/bali/interfaces/Discrete', indentation);
            indentation = indentation || 0;
            if (indentation) {
                indentation = indentation.toInteger();
                validateIndex('$base16', 10, indentation);
            }
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base16Encode(binary.getValue()));
        },

        $base32: function(binary, indentation) {
            validateTypeArgument('$base32', '/bali/elements/Binary', binary);
            indentation = validateOptionalTypeArgument('$base32', '/bali/interfaces/Discrete', indentation);
            indentation = indentation || 0;
            if (indentation) {
                indentation = indentation.toInteger();
                validateIndex('$base32', 10, indentation);
            }
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base32Encode(binary.getValue()));
        },

        $base64: function(binary, indentation) {
            validateTypeArgument('$base64', '/bali/elements/Binary', binary);
            indentation = validateOptionalTypeArgument('$base64', '/bali/interfaces/Discrete', indentation);
            indentation = indentation || 0;
            if (indentation) {
                indentation = indentation.toInteger();
                validateIndex('$base64', 10, indentation);
            }
            const decoder = bali.decoder(indentation);
            return bali.text(decoder.base64Encode(binary.getValue()));
        },

        $binary: function(size, parameters) {
            validateTypeArgument('$binary', '/bali/interfaces/Discrete', size);
            parameters = validateOptionalTypeArgument('$binary', '/bali/collections/Catalog', parameters);
            size = size.toInteger();
            validateIndex('$binary', 1024, size);
            const bytes = generator.generateBytes(size);
            return bali.binary(bytes, parameters);
        },

        $boolean: function(component) {
            validateTypeArgument('$boolean', '/bali/abstractions/Component', component);
            return bali.boolean(component.toBoolean());
        },

        $bytes: function(tag) {
            validateTypeArgument('$bytes', '/bali/elements/Tag', tag);
            return bali.binary(tag.getBytes());
        },

        $catalog: function(items, parameters) {
            items = validateOptionalTypeArgument('$catalog', '/bali/abstractions/Collection', items);
            parameters = validateOptionalTypeArgument('$catalog', '/bali/collections/Catalog', parameters);
            return bali.catalog(items, parameters);
        },

        $citation: function(document) {
            validateTypeArgument('$citation', '/bali/collections/Catalog', document);
            return citeDocument(document);
        },

        $cleanType: function(type) {
            validateTypeArgument('$cleanType', '/bali/collections/Catalog', type);
            compiler.cleanType(type);
            return type;
        },

        $code: function(procedure) {
            validateTypeArgument('$code', '/bali/composites/Procedure', procedure);
            return procedure.getCode();
        },

        $coinToss: function(weight) {
            validateTypeArgument('$coinToss', '/bali/elements/Probability', weight);
            return bali.boolean(generator.flipCoin(weight.toReal()));
        },

        $comparison: function(first, second) {
            validateTypeArgument('$comparison', '/bali/interfaces/Comparable', first);
            validateTypeArgument('$comparison', '/bali/interfaces/Comparable', second);
            return bali.number(first.comparedTo(second));
        },

        $compileType: function(type) {
            validateTypeArgument('$compileType', '/bali/collections/Catalog', type);
            compiler.compileType(type);
            return type;
        },

        $complement: function(angle) {
            validateTypeArgument('$complement', '/bali/elements/Angle', angle);
            return bali.angle.complement(angle);
        },

        $component: function(source) {
            validateTypeArgument('$component', '/bali/elements/Text', source);
            return bali.component(source.getValue());
        },

        $concatenation: function(first, second) {
            validateTypeArgument('$concatenation', '/bali/libraries/Chainable', first);
            validateTypeArgument('$concatenation', '/bali/libraries/Chainable', second);
            validateSameType('$concatenation', first, second);
            return first.constructor.concatenation(first, second);
        },

        $conjugate: function(numerical) {
            validateTypeArgument('$conjugate', '/bali/libraries/Numerical', numerical);
            return numerical.constructor.conjugate(numerical);
        },

        $containsAll: function(collection, items) {
            validateTypeArgument('$containsAll', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$containsAll', '/bali/abstractions/Collection', items);
            return bali.boolean(collection.containsAll(items));
        },

        $containsAny: function(collection, items) {
            validateTypeArgument('$containsAny', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$containsAny', '/bali/abstractions/Collection', items);
            return bali.boolean(collection.containsAny(items));
        },

        $containsItem: function(collection, item) {
            validateTypeArgument('$containsItem', '/bali/abstractions/Collection', collection);
            validateTypeArgument('$containsItem', '/bali/abstractions/Component', item);
            return bali.boolean(collection.containsItem(item));
        },

        $cosine: function(angle) {
            validateTypeArgument('$cosine', '/bali/elements/Angle', angle);
            return bali.number(bali.angle.cosine(angle));
        },

        $day: function(moment) {
            validateTypeArgument('$day', '/bali/elements/Moment', moment);
            return bali.number(moment.getDay(moment));
        },

        $days: function(duration) {
            validateTypeArgument('$days', '/bali/elements/Duration', duration);
            return bali.number(duration.getDays(duration));
        },

        $default: function(component, value) {
            validateTypeArgument('$default', '/bali/abstractions/Component', component);
            validateTypeArgument('$default', '/bali/abstractions/Component', value);
            return !component.isEqualTo(bali.pattern.NONE) ? component : value;
        },

        $degrees: function(angle) {
            validateTypeArgument('$degrees', '/bali/elements/Angle', angle);
            return bali.number(angle.getDegrees());
        },

        $difference: function(first, second) {
            validateTypeArgument('$difference', '/bali/libraries/Scalable', first);
            validateTypeArgument('$difference', '/bali/libraries/Scalable', second);
            validateSameType('$difference', first, second);
            return first.constructor.difference(first, second);
        },

        $document: function(component, indentation) {
            validateTypeArgument('$document', '/bali/abstractions/Component', component);
            indentation = validateOptionalTypeArgument('$document', '/bali/interfaces/Discrete', indentation);
            if (indentation) {
                indentation = indentation.toInteger();
                validateIndex('$document', 10, indentation);
            }
            return bali.text(EOL + component.toBDN(indentation) + EOL);
        },

        $doesMatch: function(comparable, pattern) {
            validateTypeArgument('$doesMatch', '/bali/interfaces/Comparable', comparable);
            validateTypeArgument('$doesMatch', '/bali/abstractions/Component', pattern);
            return bali.boolean(comparable.isMatchedBy(pattern));
        },

        $duplicate: function(component) {
            validateTypeArgument('$duplicate', '/bali/abstractions/Component', component);
            return component.duplicate();
        },

        $duration: function(first, second) {
            validateTypeArgument('$duration', '/bali/elements/Moment', first);
            validateTypeArgument('$duration', '/bali/elements/Moment', second);
            return bali.moment.duration(first, second);
        },

        $earlier: function(moment, duration) {
            validateTypeArgument('$earlier', '/bali/elements/Moment', moment);
            validateTypeArgument('$earlier', '/bali/elements/Duration', duration);
            return bali.moment.earlier(moment, duration);
        },

        $exponential: function(base, exponent) {
            validateTypeArgument('$exponential', '/bali/libraries/Numerical', base);
            validateTypeArgument('$exponential', '/bali/libraries/Numerical', exponent);
            validateSameType('$exponential', base, exponent);
            return base.constructor.exponential(base, exponent);
        },

        $extraction: function(catalog, keys) {
            validateTypeArgument('$extraction', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$extraction', '/bali/collections/List', keys);
            return bali.catalog.extraction(catalog, keys);
        },

        $factorial: function(numerical) {
            validateTypeArgument('$factorial', '/bali/libraries/Numerical', numerical);
            return numerical.constructor.factorial(numerical);
        },

        $first: function(range) {
            validateTypeArgument('$first', '/bali/composites/Range', range);
            const first = range.getFirst();
            return (first === undefined) ? bali.pattern.NONE : bali.number(first);
        },

        $format: function(moment) {
            validateTypeArgument('$format', '/bali/elements/Moment', moment);
            return bali.text(moment.getFormat());
        },

        $fragment: function(resource) {
            validateTypeArgument('$fragment', '/bali/elements/Resource', resource);
            return bali.text(resource.getFragment());
        },

        $hash: function(component) {
            validateTypeArgument('$hash', '/bali/abstractions/Component', component);
            return bali.number(component.getHash());
        },

        $hasNext: function(iterator) {
            validateTypeArgument('$hasNext', '/bali/abstractions/Iterator', iterator);
            return iterator.hasNext();
        },

        $hasPrevious: function(iterator) {
            validateTypeArgument('$hasPrevious', '/bali/abstractions/Iterator', iterator);
            return iterator.hasPrevious();
        },

        $head: function(queue) {
            validateTypeArgument('$head', '/bali/collections/Queue', queue);
            return queue.headItem();
        },

        $hour: function(moment) {
            validateTypeArgument('$hour', '/bali/elements/Moment', moment);
            return bali.number(moment.getHour(moment));
        },

        $hours: function(duration) {
            validateTypeArgument('$hours', '/bali/elements/Duration', duration);
            return bali.number(duration.getHours(duration));
        },

        $HTML: function(component, style) {
            validateTypeArgument('$HTML', '/bali/interfaces/Exportable', component);
            validateTypeArgument('$HTML', '/bali/elements/Resource', style);
            return bali.text(EOL + component.toHTML(style.getValue().toString()) + EOL);
        },

        $imaginary: function(number) {
            validateTypeArgument('$imaginary', '/bali/elements/Number', number);
            return bali.number(number.getImaginary());
        },

        $index: function(sequential, item) {
            validateTypeArgument('$index', '/bali/interfaces/Sequential', sequential);
            validateTypeArgument('$index', '/bali/abstractions/Component', item);
            return bali.number(sequential.getIndex(item));
        },

        $insertItem: function(list, index, item) {
            validateTypeArgument('$insertItem', '/bali/collections/List', list);
            validateTypeArgument('$insertItem', '/bali/interfaces/Discrete', index);
            validateTypeArgument('$insertItem', '/bali/abstractions/Component', item);
            index = index.toInteger();
            validateIndex('$insertItem', list.getSize(), index);
            list.insertItem(index, item);
            return list;
        },

        $insertItems: function(list, index, items) {
            validateTypeArgument('$insertItems', '/bali/collections/List', list);
            validateTypeArgument('$insertItems', '/bali/interfaces/Discrete', index);
            validateTypeArgument('$insertItems', '/bali/abstractions/Collection', items);
            index = index.toInteger();
            validateIndex('$insertItems', list.getSize(), index);
            list.insertItems(index, items);
            return list;
        },

        $instance: function(type, attributes) {
            validateTypeArgument('$instance', '/bali/collections/Catalog', type);
            validateTypeArgument('$instance', '/bali/collections/Catalog', attributes);
            return bali.instance(type, attributes);
        },

        $integer: function(discrete) {
            validateTypeArgument('$integer', '/bali/interfaces/Discrete', discrete);
            return bali.number(discrete.toInteger());
        },

        $interfaces: function(component) {
            validateTypeArgument('$interfaces', '/bali/interfaces/Reflective', component);
            return bali.list(component.getInterfaces());
        },

        $inverse: function(scalable) {
            validateTypeArgument('$inverse', '/bali/libraries/Scalable', scalable);
            return scalable.constructor.inverse(scalable);
        },

        $isEmpty: function(sequential) {
            validateTypeArgument('$isEmpty', '/bali/interfaces/Sequential', sequential);
            return bali.boolean(sequential.isEmpty());
        },

        $isInfinite: function(number) {
            validateTypeArgument('$isInfinite', '/bali/elements/Number', number);
            return bali.boolean(number.isInfinite());
        },

        $isLess: function(first, second) {
            validateTypeArgument('$isLess', '/bali/interfaces/Comparable', first);
            validateTypeArgument('$isLess', '/bali/interfaces/Comparable', second);
            return bali.boolean(first.comparedTo(second) < 0);
        },

        $isMore: function(first, second) {
            validateTypeArgument('$isMore', '/bali/interfaces/Comparable', first);
            validateTypeArgument('$isMore', '/bali/interfaces/Comparable', second);
            return bali.boolean(first.comparedTo(second) > 0);
        },

        $isNext: function(current, next) {
            validateTypeArgument('$isNext', '/bali/elements/Version', current);
            validateTypeArgument('$isNext', '/bali/elements/Version', next);
            return bali.boolean(bali.version.validNextVersion(current, next));
        },

        $isParameterized: function(component) {
            validateTypeArgument('$isParameterized', '/bali/interfaces/Reflective', component);
            return bali.boolean(component.isParameterized());
        },

        $isType: function(component, type) {
            validateTypeArgument('$isType', '/bali/interfaces/Reflective', component);
            validateTypeArgument('$isType', '/bali/elements/Name', type);
            return bali.boolean(component.isType(type.toString()));
        },

        $isUndefined: function(number) {
            validateTypeArgument('$isUndefined', '/bali/elements/Number', number);
            return bali.boolean(number.isUndefined());
        },

        $isZero: function(number) {
            validateTypeArgument('$isZero', '/bali/elements/Number', number);
            return bali.boolean(number.isZero());
        },

        $item: function(sequential, index) {
            validateTypeArgument('$item', '/bali/interfaces/Sequential', sequential);
            validateTypeArgument('$item', '/bali/interfaces/Discrete', index);
            index = index.toInteger();
            validateIndex('$item', sequential.getSize(), index);
            return sequential.componentize(sequential.getItem(index));
        },

        $items: function(sequential, range) {
            validateTypeArgument('$items', '/bali/interfaces/Sequential', sequential);
            validateTypeArgument('$items', '/bali/composites/Range', range);
            return sequential.getItems(range);
        },

        $iterator: function(sequential) {
            validateTypeArgument('$iterator', '/bali/interfaces/Sequential', sequential);
            return sequential.getIterator();
        },

        $key: function(association) {
            validateTypeArgument('$key', '/bali/composites/Association', association);
            return association.getKey();
        },

        $keys: function(catalog) {
            validateTypeArgument('$keys', '/bali/collections/Catalog', catalog);
            return catalog.getKeys();
        },

        $last: function(range) {
            validateTypeArgument('$last', '/bali/composites/Range', range);
            const last = range.getLast();
            return (last === undefined) ? bali.pattern.NONE : bali.number(last);
        },

        $later: function(moment, duration) {
            validateTypeArgument('$later', '/bali/elements/Moment', moment);
            validateTypeArgument('$later', '/bali/elements/Duration', duration);
            return bali.moment.later(moment, duration);
        },

        $levels: function(version) {
            validateTypeArgument('$levels', '/bali/elements/Version' , version);
            return bali.list(version.getValue());
        },

        $list: function(items, parameters) {
            items = validateOptionalTypeArgument('$list', '/bali/abstractions/Collection', items);
            parameters = validateOptionalTypeArgument('$list', '/bali/collections/Catalog', parameters);
            return bali.list(items, parameters);
        },

        $logarithm: function(base, value) {
            validateTypeArgument('$logarithm', '/bali/libraries/Numerical', base);
            validateTypeArgument('$logarithm', '/bali/libraries/Numerical', value);
            validateSameType('$logarithm', base, value);
            return base.constructor.logarithm(base, value);
        },

        $magnitude: function(number) {
            validateTypeArgument('$magnitude', '/bali/elements/Number', number);
            return bali.number(number.getMagnitude());
        },

        $millisecond: function(moment) {
            validateTypeArgument('$millisecond', '/bali/elements/Moment', moment);
            return bali.number(moment.getMillisecond(moment));
        },

        $milliseconds: function(duration) {
            validateTypeArgument('$milliseconds', '/bali/elements/Duration', duration);
            return bali.number(duration.getMilliseconds(duration));
        },

        $minute: function(moment) {
            validateTypeArgument('$minute', '/bali/elements/Moment', moment);
            return bali.number(moment.getMinute(moment));
        },

        $minutes: function(duration) {
            validateTypeArgument('$minutes', '/bali/elements/Duration', duration);
            return bali.number(duration.getMinutes(duration));
        },

        $month: function(moment) {
            validateTypeArgument('$month', '/bali/elements/Moment', moment);
            return bali.number(moment.getMonth(moment));
        },

        $months: function(duration) {
            validateTypeArgument('$months', '/bali/elements/Duration', duration);
            return bali.number(duration.getMonths(duration));
        },

        $next: function(iterator) {
            validateTypeArgument('$next', '/bali/abstractions/Iterator', iterator);
            return iterator.componentize(iterator.getNext());
        },

        $nextVersion: function(version, level) {
            validateTypeArgument('$nextVersion', '/bali/elements/Version', version);
            validateOptionalTypeArgument('$nextVersion', '/bali/interfaces/Discrete', level);
            if (level) {
                level = level.toInteger();
                if (level) validateIndex('$nextVersion', version.getSize() + 1, level);  // allow for the next subversion
            }
            return bali.version.nextVersion(version, level);
        },

        $node: function(type, children) {
            validateTypeArgument('$node', '/bali/elements/Name', type);
            children = validateOptionalTypeArgument('$node', '/bali/abstractions/Collection', children);
            return bali.node(type.toString(), children);
        },

        $not: function(logical) {
            validateTypeArgument('$not', '/bali/libraries/Logical', logical);
            return logical.constructor.not(logical);
        },

        $now: function() {
            return bali.moment();
        },

        $or: function(first, second) {
            validateTypeArgument('$or', '/bali/libraries/Logical', first);
            validateTypeArgument('$or', '/bali/libraries/Logical', second);
            validateSameType('$or', first, second);
            return first.constructor.or(first, second);
        },

        $parameter: function(component, key) {
            validateTypeArgument('$parameter', '/bali/interfaces/Reflective', component);
            validateTypeArgument('$parameter', '/bali/abstractions/Element', key);
            return component.getParameter(key);
        },

        $parameters: function(component) {
            validateTypeArgument('$parameters', '/bali/interfaces/Reflective', component);
            return component.getParameters();
        },

        $path: function(resource) {
            validateTypeArgument('$path', '/bali/elements/Resource', resource);
            return bali.text(resource.getPath());
        },

        $phase: function(number) {
            validateTypeArgument('$phase', '/bali/elements/Number', number);
            return number.getPhase();
        },

        $previous: function(iterator) {
            validateTypeArgument('$previous', '/bali/abstractions/Iterator', iterator);
            return iterator.componentize(iterator.getPrevious());
        },

        $probability: function() {
            return bali.probability.random();
        },

        $procedure: function(code, parameters) {
            validateTypeArgument('$procedure', '/bali/composites/Code', code);
            parameters = validateOptionalTypeArgument('$procedure', '/bali/collections/Catalog', parameters);
            return bali.procedure(code, parameters);
        },

        $product: function(first, second) {
            validateTypeArgument('$product', '/bali/libraries/Numerical', first);
            validateTypeArgument('$product', '/bali/libraries/Numerical', second);
            validateSameType('$product', first, second);
            return first.constructor.product(first, second);
        },

        $query: function(resource) {
            validateTypeArgument('$query', '/bali/elements/Resource', resource);
            return bali.text(resource.getQuery());
        },

        $queue: function(items, parameters) {
            items = validateOptionalTypeArgument('$queue', '/bali/abstractions/Collection', items);
            parameters = validateOptionalTypeArgument('$queue', '/bali/collections/Catalog', parameters);
            return bali.queue(items, parameters);
        },

        $quotient: function(first, second) {
            validateTypeArgument('$quotient', '/bali/libraries/Numerical', first);
            validateTypeArgument('$quotient', '/bali/libraries/Numerical', second);
            validateSameType('$quotient', first, second);
            return first.constructor.quotient(first, second);
        },

        $radians: function(angle) {
            validateTypeArgument('$radians', '/bali/elements/Angle', angle);
            return bali.number(angle.getRadians());
        },

        $range: function(endpoints, connector, parameters) {
            endpoints = validateOptionalTypeArgument('$range', '/bali/collections/List', endpoints);
            const first = validateOptionalTypeArgument('$range', '/bali/abstractions/Element', endpoints.getItem(1));
            const last = validateOptionalTypeArgument('$range', '/bali/abstractions/Element', endpoints.getItem(2));
            connector = validateOptionalTypeArgument('$range', '/bali/elements/Text', connector);
            if (first && last) {
                validateSameType('$range', first, last);
            }
            parameters = validateOptionalTypeArgument('$range', '/bali/collections/Catalog', parameters);
            return bali.range(first, last, connector, parameters);
        },

        $real: function(continuous) {
            validateTypeArgument('$real', '/bali/interfaces/Continuous', continuous);
            return bali.number(continuous.toReal());
        },

        $reciprocal: function(numerical) {
            validateTypeArgument('$reciprocal', '/bali/libraries/Numerical', numerical);
            return numerical.constructor.reciprocal(numerical);
        },

        $remainder: function(first, second) {
            validateTypeArgument('$remainder', '/bali/libraries/Numerical', first);
            validateTypeArgument('$remainder', '/bali/libraries/Numerical', second);
            validateSameType('$remainder', first, second);
            return first.constructor.remainder(first, second);
        },

        $removeAll: function(collection) {
            validateTypeArgument('$removeAll', '/bali/abstractions/Collection', collection);
            collection.removeAll();
            return collection;
        },

        $removeAttribute: function(catalog, key) {
            validateTypeArgument('$removeAttribute', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$removeAttribute', '/bali/abstractions/Element', key);
            catalog.removeAttribute(key);
            return catalog;
        },

        $removeAttributes: function(catalog, keys) {
            validateTypeArgument('$removeAttributes', '/bali/collections/Catalog', catalog);
            validateTypeArgument('$removeAttributes', '/bali/collections/List', keys);
            catalog.removeAttributes(keys);
            return catalog;
        },

        $removeHead: function(queue) {
            validateTypeArgument('$removeHead', '/bali/collections/Queue', queue);
            return queue.removeItem();
        },

        $removeIndex: function(list, index) {
            validateTypeArgument('$removeIndex', '/bali/collections/List', list);
            validateTypeArgument('$removeIndex', '/bali/interfaces/Discrete', index);
            index = index.toInteger();
            validateIndex('$removeIndex', list.getSize(), index);
            list.removeItem(index);
            return list;
        },

        $removeItem: function(set, item) {
            validateTypeArgument('$removeItem', '/bali/collections/Set', set);
            validateTypeArgument('$removeItem', '/bali/abstractions/Component', item);
            set.removeItem(item);
            return set;
        },

        $removeItems: function(set, items) {
            validateTypeArgument('$removeItems', '/bali/collections/Set', set);
            validateTypeArgument('$removeItems', '/bali/abstractions/Collection', items);
            set.removeItems(items);
            return set;
        },

        $removeRange: function(list, range) {
            validateTypeArgument('$removeRange', '/bali/collections/List', list);
            validateTypeArgument('$removeRange', '/bali/composites/Range', range);
            list.removeItems(range);
            return list;
        },

        $removeTop: function(stack) {
            validateTypeArgument('$removeTop', '/bali/collections/Stack', stack);
            return stack.removeItem();
        },

        $reverseItems: function(sortable) {
            validateTypeArgument('$reverseItems', '/bali/interfaces/Sortable', sortable);
            sortable.reverseItems();
            return sortable;
        },

        $sans: function(first, second) {
            validateTypeArgument('$sans', '/bali/libraries/Logical', first);
            validateTypeArgument('$sans', '/bali/libraries/Logical', second);
            validateSameType('$sans', first, second);
            return first.constructor.sans(first, second);
        },

        $scaled: function(scalable, factor) {
            validateTypeArgument('$scaled', '/bali/libraries/Scalable', scalable);
            validateTypeArgument('$scaled', '/bali/elements/Number', factor);
            return scalable.constructor.scaled(scalable, factor);
        },

        $scheme: function(resource) {
            validateTypeArgument('$scheme', '/bali/elements/Resource', resource);
            return bali.text(resource.getScheme());
        },

        $second: function(moment) {
            validateTypeArgument('$second', '/bali/elements/Moment', moment);
            return bali.number(moment.getSecond(moment));
        },

        $seconds: function(duration) {
            validateTypeArgument('$seconds', '/bali/elements/Duration', duration);
            return bali.number(duration.getSeconds(duration));
        },

        $set: function(items, parameters) {
            items = validateOptionalTypeArgument('$set', '/bali/abstractions/Collection', items);
            parameters = validateOptionalTypeArgument('$set', '/bali/collections/Catalog', parameters);
            return bali.set(items, parameters);
        },

        $setAttribute: function(composite, key, value) {
            validateTypeArgument('$setAttribute', '/bali/interfaces/Structural', composite);
            validateTypeArgument('$setAttribute', '/bali/abstractions/Element', key);
            validateTypeArgument('$setAttribute', '/bali/abstractions/Component', value);
            composite.setAttribute(key, value);
            return composite;
        },

        $setItem: function(list, index, item) {
            validateTypeArgument('$setItem', '/bali/collections/List', list);
            validateTypeArgument('$setItem', '/bali/interfaces/Discrete', index);
            validateTypeArgument('$setItem', '/bali/abstractions/Component', item);
            index = index.toInteger();
            validateIndex('$setItem', list.getSize(), index);
            list.setItem(index, item);
            return list;
        },

        $setParameter: function(component, key, value) {
            validateTypeArgument('$setParameter', '/bali/interfaces/Reflective', component);
            validateTypeArgument('$setParameter', '/bali/abstractions/Element', key);
            validateTypeArgument('$setParameter', '/bali/abstractions/Component', value);
            component.setParameter(key, value);
            return component;
        },

        $setValue: function(association, value) {
            validateTypeArgument('$setValue', '/bali/composites/Association', association);
            validateTypeArgument('$setValue', '/bali/abstractions/Component', value);
            association.setValue(value);
            return association;
        },

        $shuffleItems: function(list) {
            validateTypeArgument('$shuffleItems', '/bali/collections/List', list);
            list.shuffleItems();
            return list;
        },

        $sine: function(angle) {
            validateTypeArgument('$sine', '/bali/elements/Angle', angle);
            return bali.number(bali.angle.sine(angle));
        },

        $size: function(sequential) {
            validateTypeArgument('$size', '/bali/interfaces/Sequential', sequential);
            return bali.number(sequential.getSize());
        },

        $sortItems: function(sortable) {
            validateTypeArgument('$sortItems', '/bali/interfaces/Sortable', sortable);
            sortable.sortItems();
            return sortable;
        },

        $stack: function(items, parameters) {
            items = validateOptionalTypeArgument('$stack', '/bali/abstractions/Collection', items);
            parameters = validateOptionalTypeArgument('$stack', '/bali/collections/Catalog', parameters);
            return bali.stack(items, parameters);
        },

        $sum: function(first, second) {
            validateTypeArgument('$sum', '/bali/libraries/Scalable', first);
            validateTypeArgument('$sum', '/bali/libraries/Scalable', second);
            validateSameType('$sum', first, second);
            return first.constructor.sum(first, second);
        },

        $supplement: function(angle) {
            validateTypeArgument('$supplement', '/bali/elements/Angle', angle);
            return bali.angle.supplement(angle);
        },

        $supportsInterface: function(component, iface) {
            validateTypeArgument('$supportsInterface', '/bali/interfaces/Reflective', component);
            validateTypeArgument('$supportsInterface', '/bali/elements/Name', iface);
            return component.supportsInterface(iface);
        },

        $tag: function(size) {
            size = validateOptionalTypeArgument('$tag', '/bali/interfaces/Discrete', size);
            size = size.toInteger();
            validateIndex('$tag', 64, size);
            return bali.tag(size);
        },

        $tangent: function(angle) {
            validateTypeArgument('$tangent', '/bali/elements/Angle', angle);
            return bali.number(bali.angle.tangent(angle));
        },

        $toEnd: function(iterator) {
            validateTypeArgument('$toEnd', '/bali/abstractions/Iterator', iterator);
            iterator.toEnd();
            return iterator;
        },

        $top: function(stack) {
            validateTypeArgument('$top', '/bali/collections/Stack', stack);
            return stack.topItem();
        },

        $toSlot: function(iterator, slot) {
            validateTypeArgument('$toSlot', '/bali/abstractions/Iterator', iterator);
            validateTypeArgument('$toSlot', '/bali/interfaces/Discrete', slot);
            iterator.toSlot(slot);
            return iterator;
        },

        $toStart: function(iterator) {
            validateTypeArgument('$toStart', '/bali/abstractions/Iterator', iterator);
            iterator.toStart();
            return iterator;
        },

        $type: function(component) {
            validateTypeArgument('$type', '/bali/interfaces/Reflective', component);
            return bali.component(component.getType());
        },

        $value: function(association) {
            validateTypeArgument('$value', '/bali/composites/Association', association);
            return association.getValue();
        },

        $weeks: function(duration) {
            validateTypeArgument('$weeks', '/bali/elements/Duration', duration);
            return bali.number(duration.getWeeks(duration));
        },

        $xor: function(first, second) {
            validateTypeArgument('$xor', '/bali/libraries/Logical', first);
            validateTypeArgument('$xor', '/bali/libraries/Logical', second);
            validateSameType('$xor', first, second);
            return first.constructor.xor(first, second);
        },

        $year: function(moment) {
            validateTypeArgument('$year', '/bali/elements/Moment', moment);
            return bali.number(moment.getYear(moment));
        },

        $years: function(duration) {
            validateTypeArgument('$years', '/bali/elements/Duration', duration);
            return bali.number(duration.getYears(duration));
        }

    };

    /*
     * A list of the names of the intrinsic functions supported by the virtual machine.
     */
    const names = Object.keys(intrinsics);  // javascript now preserves the chronological order of keys

    /*
     * A list of the implementations of the intrinsic functions supported by the virtual machine.
     */
    const functions = [];
    names.forEach((name) => {
        functions.push(intrinsics[name]);
    });

    // return the actual API
    return {
        name: name,
        index: index,
        invoke: invoke
    };

};
