import Vector2 from '../../../math/Vector2';
import Vector3 from '../../../math/Vector3';
import Vector4 from '../../../math/Vector4';
import ShaderNode from './ShaderNode';

export default class Operation extends ShaderNode {
    constructor(symbol, parameters = []) {
        super();
        this.symbol = symbol;
        this.parameters = parameters;
    }

    toString() {
        return this.parameters.join(this.symbol);
    }

    static symbol = {
        equal: ' = ',
        addTo: ' += ',
        substractTo: ' -= ',
        multiplyTo: ' *= ',
        divideTo: ' /= ',

        add: ' + ',
        substract: ' - ',
        multiply: ' * ',
        divide: ' / ',

        and: ' && ',
        or: ' || ',

        isEqual: ' == ',
        notEquals: ' != ',
        less: ' < ',
        lessEquals: ' <= ',
        greater: ' > ',
        greaterEquals: ' >= ',

        if: 'if',
        elseIf: 'else if',
        else: 'else',
        for: 'for',
        discard: 'discard',
        return: 'return',
        selection: 'selection',
        declare: 'declare',

        len: 'length',
        abs: 'abs',
        fract: 'fract',
        fWidth: 'fWidth',
        normalize: 'normalize',
        dot: 'dot',
        min: 'min',
        max: 'max',
        distance: 'distance',
        pow: 'pow',
        mix: 'mix',
        read: 'read',
        clamp: 'clamp',

        toVector2: Vector2,
        toVector3: Vector3,
        toVector4: Vector4,

    }

    static selection(parameter, value) {
        return new Operation(Operation.symbol.selection, [parameter, value]);
    }

    static equal(parameter, value) {
        return new Operation(Operation.symbol.equal, [parameter, value]);
    }

    static addTo(parameter, value) {
        return new Operation(Operation.symbol.addTo, [parameter, value]);
    }

    static substractTo(parameter, value) {
        return new Operation(Operation.symbol.substractTo, [parameter, value]);
    }

    static multiplyTo(parameter, value) {
        return new Operation(Operation.symbol.multiplyTo, [parameter, value]);
    }

    static divideTo(parameter, value) {
        return new Operation(Operation.symbol.divideTo, [parameter, value]);
    }


    static add(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.add, parameters);
    }

    static substract(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.substract, parameters);
    }

    static multiply(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.multiply, parameters);
    }

    static divide(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.divide, parameters);
    }

    static and(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.and, parameters);
    }
    static or(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        }
        return new Operation(Operation.symbol.or, parameters);
    }

    static isEqual(a, b) {
        return new Operation(Operation.symbol.isEqual, [a, b]);
    }
    static notEquals(a, b) {
        return new Operation(Operation.symbol.notEquals, [a, b]);
    }
    static less(a, b) {
        return new Operation(Operation.symbol.less, [a, b]);
    }
    static lessEquals(a, b) {
        return new Operation(Operation.symbol.lessEquals, [a, b]);
    }
    static greater(a, b) {
        return new Operation(Operation.symbol.greater, [a, b]);
    }
    static greaterEquals(a, b) {
        return new Operation(Operation.symbol.greaterEquals, [a, b]);
    }


    static toVector2(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        } else if (!Array.isArray(parameters)) {
            parameters = [parameters];
        }
        return new Operation(Operation.symbol.toVector2, parameters);
    }

    static toVector3(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        } else if (!Array.isArray(parameters)) {
            parameters = [parameters];
        }
        return new Operation(Operation.symbol.toVector3, parameters);
    }

    static toVector4(parameters) {
        if (arguments.length > 1) {
            const result = new Array(arguments.length);
            for (const key in arguments) {
                const operand = arguments[key];
                result[key] = operand;
            }
            parameters = result;
        } else if (!Array.isArray(parameters)) {
            parameters = [parameters];
        }
        return new Operation(Operation.symbol.toVector4, parameters);
    }

    static do(shaderFunction, parameters) {
        if (!Array.isArray(parameters)) {
            parameters = [parameters];
        }
        return new Operation(shaderFunction, parameters);
    }

    static len(parameter) {
        return new Operation(Operation.symbol.len, [parameter]);
    }

    static abs(parameter) {
        return new Operation(Operation.symbol.abs, [parameter]);
    }

    static fract(parameter) {
        return new Operation(Operation.symbol.fract, [parameter]);
    }

    static fWidth(parameter) {
        return new Operation(Operation.symbol.fWidth, [parameter]);
    }

    static normalize(vector) {
        return new Operation(Operation.symbol.normalize, [vector]);
    }

    static dot(a, b) {
        return new Operation(Operation.symbol.dot, [a, b]);
    }

    static max(a, b) {
        return new Operation(Operation.symbol.max, [a, b]);
    }

    static min(a, b) {
        return new Operation(Operation.symbol.min, [a, b]);
    }

    static distance(a, b) {
        return new Operation(Operation.symbol.distance, [a, b]);
    }

    static pow(a, b) {
        return new Operation(Operation.symbol.pow, [a, b]);
    }

    static read(a, b) {
        return new Operation(Operation.symbol.read, [a, b]);
    }

    static mix(a, b, c) {
        return new Operation(Operation.symbol.mix, [a, b, c]);
    }

    static clamp(a, b, c) {
        return new Operation(Operation.symbol.clamp, [a, b, c]);
    }

    static for(iterator, condition, step, operations) {
        if (!Array.isArray(operations)) {
            operations = [operations];
        }
        return new Operation(Operation.symbol.for, [iterator, condition, step, operations]);
    }

    static if(condition, operations) {
        if (!Array.isArray(operations)) {
            operations = [operations];
        }
        return new Operation(Operation.symbol.if, [condition, operations]);
    }

    static elseIf(condition, operations) {
        if (!Array.isArray(operations)) {
            operations = [operations];
        }
        return new Operation(Operation.symbol.elseIf, [condition, operations]);
    }

    static else(operations) {
        if (!Array.isArray(operations)) {
            operations = [operations];
        }
        return new Operation(Operation.symbol.else, operations);
    }

    static declare(parameter) {
        return new Operation(Operation.symbol.declare, [parameter]);
    }

    static return(value) {
        return new Operation(Operation.symbol.return, value != null ? [value] : []);
    }

    static discard() {
        return new Operation(Operation.symbol.discard, []);
    }
}