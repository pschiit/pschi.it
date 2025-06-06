import FloatArray from '../../../../math/FloatArray';
import Matrix2 from '../../../../math/Matrix2';
import Matrix3 from '../../../../math/Matrix3';
import Matrix4 from '../../../../math/Matrix4';
import Vector2 from '../../../../math/Vector2';
import Vector3 from '../../../../math/Vector3';
import Vector4 from '../../../../math/Vector4';
import Texture from '../../Texture';
import Operation from '../Operation';
import Parameter from '../Parameter';
import Shader from '../Shader';
import ShaderFunction from '../ShaderFunction';

export default class GLSLShader{
    /** Create a new GLSLShader code source from a Shader
     * @param {Shader} shader Shader to convert
     * @returns {string} the GLSLShader code source
    */
    static from(shader) {
        const qualifier = {};
        let parameters = {};
        const extensions = [];
        let declarations = [];
        var main = [
            'void main(){'
        ];
        shader.operations.forEach(o => {
            o.parameters.forEach(addNode);
            let code = toString(o);
            if (code.slice(-1) != '}') {
                code += ';'
            }
            main.push(code);
        });
        if (shader.precision) {
            declarations.unshift(`precision ${shader.precision}p float;`);
            //declarations.unshift('#version 300 es');
        }
        if (extensions) {
            declarations = extensions.concat(declarations);
        }
        main.push('}');

        const result = declarations.concat(main).join('\n').replaceAll('};', '}');
        
        return result;

        function addNode(shaderNode) {
            if (Array.isArray(shaderNode)) {
                shaderNode.forEach(addNode)
            } else if (shaderNode.qualifier && !qualifier[shaderNode.name]) {
                declarations.unshift(getQualifierDeclaration(shaderNode));
                qualifier[shaderNode.name] = true;
            } else if (shaderNode instanceof Operation) {
                if (shaderNode.symbol instanceof ShaderFunction) {
                    addNode(shaderNode.symbol);
                }
                shaderNode.parameters.forEach(addNode);
            } else if (shaderNode instanceof ShaderFunction && !parameters[shaderNode.name]) {
                const previous = parameters;
                parameters = {};
                shaderNode.parameters.forEach(addNode);
                shaderNode.operations.forEach(addNode);
                let code = toString(shaderNode);
                declarations.push(code);
                parameters = previous;
                parameters[shaderNode.name] = true;
            }
        }

        function getQualifierDeclaration(parameter) {
            return `${qualifierOf(parameter.qualifier)} ${typeOf(parameter.type)} ${parameter}${parameter.length > 0 ? `[${parameter.length}]` : ''};`;
        }

        function getfunctionDeclaration(parameter) {
            return `${typeOf(parameter.type)} ${parameter}${parameter.length > 0 ? `[${parameter.length}]` : ''}`;
        }

        function toString(shaderNode) {
            if (shaderNode instanceof ShaderFunction) {
                return `${typeOf(shaderNode.output)} ${shaderNode.name}(${toString(shaderNode.parameters.map(getfunctionDeclaration).join(', '))}){\n${shaderNode.operations.map(toString).join(';\n')};\n}`
            }
            if (shaderNode instanceof Operation) {
                if (shaderNode.symbol === Operation.symbol.declare) {
                    const parameter = shaderNode.parameters[0];
                    return `${typeOf(parameter.type)} ${parameter}${parameter.length > 0 ? '[]' : ''}`;
                }
                if (shaderNode.symbol instanceof ShaderFunction) {
                    return `${shaderNode.symbol.name}(${shaderNode.parameters.map(toString).join(', ')})`
                }
                if (shaderNode.symbol === Operation.symbol.discard) {
                    return 'discard';
                }
                if (shaderNode.symbol === Operation.symbol.return) {
                    if(shaderNode.parameters.length > 0){
                        return `return ${toString(shaderNode.parameters[0])}`;
                    }
                    return `return`;
                }
                if (shaderNode.symbol === Operation.symbol.if
                    ||shaderNode.symbol === Operation.symbol.elseIf) {
                    const condition = shaderNode.parameters[0];
                    const operations = shaderNode.parameters[1];
                    return `${shaderNode.symbol}(${toString(condition)}){\n${operations.map(toString).join(';\n')};\n}`;
                }
                if (shaderNode.symbol === Operation.symbol.else) {
                    return `${shaderNode.symbol}{\n${shaderNode.parameters.map(toString).join(';\n')};\n}`;
                }
                if (shaderNode.symbol === Operation.symbol.for) {
                    const iterator = shaderNode.parameters[0];
                    const condition = shaderNode.parameters[1];
                    const step = shaderNode.parameters[2];
                    const operations = shaderNode.parameters[3];
                    return `${shaderNode.symbol}(${iterator};${toString(condition)};${step}){\n${operations.map(toString).join(';\n')};\n}`;
                }
                if (shaderNode.symbol === Operation.symbol.selection) {
                    return shaderNode.parameters.map(toString).join('');
                }
                //convertTo
                if (shaderNode.symbol.prototype instanceof FloatArray) {
                    return `${typeOf(shaderNode.symbol)}(${shaderNode.parameters.flatMap(toString).join(', ')})`;
                }
                if (shaderNode.symbol === Operation.symbol.fWidth) {
                    extensions.push('#extension GL_OES_standard_derivatives : enable');
                    return `fwidth(${shaderNode.parameters.flatMap(toString).join(', ')})`;
                }
                if (shaderNode.symbol === Operation.symbol.read) {
                    return `texture2D(${shaderNode.parameters.flatMap(toString).join(', ')})`;
                }
                if (shaderNode.symbol === Operation.symbol.normalize
                    || shaderNode.symbol === Operation.symbol.len
                    || shaderNode.symbol === Operation.symbol.abs
                    || shaderNode.symbol === Operation.symbol.fract
                    || shaderNode.symbol === Operation.symbol.dot
                    || shaderNode.symbol === Operation.symbol.min
                    || shaderNode.symbol === Operation.symbol.max
                    || shaderNode.symbol === Operation.symbol.distance
                    || shaderNode.symbol === Operation.symbol.pow
                    || shaderNode.symbol === Operation.symbol.mix
                    || shaderNode.symbol === Operation.symbol.clamp) {
                    return `${shaderNode.symbol}(${shaderNode.parameters.flatMap(toString).join(', ')})`;
                }
                return shaderNode.parameters.flatMap(toString).join(shaderNode.symbol);
            }
            if (shaderNode instanceof Parameter) {
                if (shaderNode === Shader.parameters.output) {
                    return getOutput(shader);
                }
                if (shaderNode === Shader.parameters.pointSize) {
                    return 'gl_PointSize';
                }
                if (shaderNode === Shader.parameters.fragmentCoordinate) {
                    return 'gl_FragCoord';
                }
                return shaderNode;
            }
            return shaderNode instanceof Vector4 ? 'vec4(' + toString(shaderNode[0]) + ', ' + toString(shaderNode[1]) + ', ' + toString(shaderNode[2]) + ', ' + toString(shaderNode[3]) + ')'
                : shaderNode instanceof Vector3 ? 'vec3(' + toString(shaderNode[0]) + ', ' + toString(shaderNode[1]) + ', ' + toString(shaderNode[2]) + ')'
                    : shaderNode instanceof Vector2 ? 'vec2(' + toString(shaderNode[0]) + ', ' + toString(shaderNode[1]) + ')'
                        : Number.isInteger(shaderNode) ? shaderNode + '.0'
                            : shaderNode;
        }

        function qualifierOf(type) {
            return type == Parameter.qualifier.const ? 'uniform'
                : type == Parameter.qualifier.in ? 'attribute'
                    : type == Parameter.qualifier.out ? 'varying'
                        : null;
        }

        function typeOf(value) {
            return value === Matrix4 ? 'mat4'
                : value === Matrix3 ? 'mat3'
                    : value === Matrix2 ? 'mat2'
                        : value === Vector4 ? 'vec4'
                            : value === Vector3 ? 'vec3'
                                : value === Vector2 ? 'vec2'
                                    : value === Number ? 'float'
                                        : value === Boolean ? 'bool'
                                            : value === Texture ? 'sampler2D'
                                                : null;
            //     samplerCube: 'samplerCube',
        }

        function getOutput(shader) {
            return shader.type == Shader.type.vertexShader ? 'gl_Position'
                : shader.type == Shader.type.fragmentShader ? 'gl_FragColor'
                    : null;
        }
    }
}