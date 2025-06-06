import GLSLShader from '../shader/GLSL/GLSLShader';
import Shader from '../shader/Shader';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';

export default class  WebGLShader extends WebGLNode {
    /** Create a WebGLShader from a Shader for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Shader} shader  associated Shader
     */
    constructor(renderer, shader) {
        super(renderer, shader.id);
        this.location = renderer.gl.createShader(renderer.gl[getType(shader.type)]);
        const source = shader.source ? shader.source : GLSLShader.from(shader);
        //console.log(source);
        renderer.gl.shaderSource(this.location, source);
        renderer.gl.compileShader(this.location);
        const success = renderer.gl.getShaderParameter(this.location, renderer.gl.COMPILE_STATUS);
        if (!success) {
            const error = new Error(`Failed to create ${shader.type} ${shader.id} :\n${renderer.gl.getShaderInfoLog(this.location)}\n\n${source.source}`);
            renderer.removeChild(this);
            throw error;
        }
        shader.compiled = true;
    }

    /** Return whether or not this WebGLShader has been created from the Shader
     * @param {Shader} shader  Shader to compare
     */
    is(shader) {
        return this.name == shader.id;
    }
    
    /** Get the Shader's WebGLShader from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Shader} shader  the Shader 
     * @returns {WebGLShader} the WebGLShader
     */
     static from(renderer, shader) {
        return renderer.nodes[shader.id] || new WebGLShader(renderer, shader);
    }
}

function getType(shaderType) {
    return shaderType == Shader.type.vertexShader ? 'VERTEX_SHADER'
        : shaderType == Shader.type.fragmentShader ? 'FRAGMENT_SHADER'
            : null;
}