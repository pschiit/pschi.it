import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Parameter from '../../renderer/graphics/shader/Parameter';
import Shader from '../../renderer/graphics/shader/Shader';

export default class ColorMaterial extends Material {
    constructor() {
        super();
        this.culling = Material.culling.back;
        this.depth = Material.depth.less;
        this.setParameter(Material.parameters.projectionMatrix);

        const vColor = Parameter.vector4('v_' + Material.parameters.color, Parameter.qualifier.out);
        this.vertexShader = Shader.vertexShader([
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    Material.parameters.projectionMatrix,
                    Material.parameters.vertexMatrix,
                    Material.parameters.position)),
            Operation.equal(vColor, Material.parameters.color),]);

        this.fragmentShader = Shader.fragmentShader([
            Operation.equal(
                Shader.parameters.output,
                vColor),
            Material.operation.gammaCorrection],);
    }

    static default = new ColorMaterial();
}