import Operation from './Operation';
import Parameter from './Parameter';
import ShaderNode from './ShaderNode';

export default class Shader extends ShaderNode {
    /** Create a Shader
     */
    constructor(type, operations, precision) {
        super();
        this.compiled = false;
        this.type = type;
        this.operations = operations;
        this.precision = precision || Shader.precision.high;
        this.source = null;
    }

    get constants(){
        const result = [];
        this.operations.forEach(findParameter);
        return result;

        function findParameter(node){
            if(Array.isArray(node)){
                node.forEach(findParameter);
            }
            if(node instanceof Parameter && node.qualifier == Parameter.qualifier.const){
                result.push(node);
            }else if(node instanceof Operation){
                node.parameters.forEach(findParameter);
            }
        }
    }

    static vertexShader(operations, precision = Shader.precision.high) {
        if(!Array.isArray(operations)){
            operations = [operations];
        }
        return new Shader(Shader.type.vertexShader, operations, precision);
    }

    static fragmentShader(operations, precision = Shader.precision.low) {
        if(!Array.isArray(operations)){
            operations = [operations];
        }
        return new Shader(Shader.type.fragmentShader, operations, precision);
    }

    /** Shader parameters
    */
    static parameters = {
        output: Parameter.vector4('output'),
        pointSize:Parameter.number('pointSize'),
        fragmentCoordinate: Parameter.vector4('fragmentCoordinate'),
    };

    /** Shader type value
    */
    static type = {
        vertexShader: 'vertexShader',
        fragmentShader: 'fragmentShader'
    };

    /** GLSLShader precision value
    */
    static precision = {
        low: 'low',
        medium: 'medium',
        high: 'high'
    };
}