import Material from '../../renderer/graphics/Material';
import Operation from '../../renderer/graphics/shader/Operation';
import Shader from '../../renderer/graphics/shader/Shader';

export default class PickingMaterial extends Material {
    constructor() {
        super();
        
        this.setParameter(Material.parameters.projectionMatrix);
        
        this.vertexShader = Shader.vertexShader(
            Operation.equal(
                Shader.parameters.output,
                Operation.multiply(
                    Material.parameters.projectionMatrix,
                    Material.parameters.vertexMatrix,
                    Material.parameters.position)));

        this.fragmentShader = Shader.fragmentShader(
            Operation.equal(
                Shader.parameters.output,
                Operation.toVector4(Material.parameters.colorId, 1)));
    }
}