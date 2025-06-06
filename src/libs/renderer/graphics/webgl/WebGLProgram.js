import Buffer from '../../../core/Buffer';
import Material from '../Material';
import WebGLBuffer from './WebGLBuffer';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';
import WebGLShader from './WebGLShader';
import WebGLTexture from './WebGLTexture';

export default class WebGLProgram extends WebGLNode {
    /** Create a WebGLProgram from a Material for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Material} material  associated Material
     */
    constructor(renderer, material) {
        super(renderer, material.id);
        this.parameters = {};
        this.cache = {};
        this.location = renderer.gl.createProgram();
        this.vertexShader = WebGLShader.from(renderer, material.vertexShader);
        renderer.gl.attachShader(this.location, this.vertexShader.location);
        this.fragmentShader = WebGLShader.from(renderer, material.fragmentShader);
        renderer.gl.attachShader(this.location, this.fragmentShader.location);
        renderer.gl.linkProgram(this.location);
        if (!renderer.gl.getProgramParameter(this.location, renderer.gl.LINK_STATUS)) {
            const error = new Error(`Failed to create program : ${renderer.gl.getProgramInfoLog(this.location)}`);
            renderer.removeChild(this);
            throw error;
        }
        const uniformsCount = renderer.gl.getProgramParameter(this.location, renderer.gl.ACTIVE_UNIFORMS);
        for (let i = 0; i < uniformsCount; i++) {
            const uniform = renderer.gl.getActiveUniform(this.location, i);
            createUniform(renderer, this, uniform);
        }
        const attributesCount = renderer.gl.getProgramParameter(this.location, renderer.gl.ACTIVE_ATTRIBUTES);
        for (let i = 0; i < attributesCount; i++) {
            const attribute = renderer.gl.getActiveAttrib(this.location, i);
            createAttribute(renderer, this, attribute);
        }
    }

    /** Return whether or not this WebGLProgram has been created from the Material
     * @param {Material} material  Material to compare
     */
    is(material) {
        return this.name == material.id;
    }

    updateParameter(name, value) {
        const callback = this.getParameter(name);
        if (callback) {
            callback(value);
        }
    }

    /** Get the Material's WebGLProgram from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Material} material  associated Material
     * @returns {WebGLProgram} the WebGLProgram
     */
    static from(renderer, material) {
        return material.compiled ? renderer.nodes[material.id] || new WebGLProgram(renderer, material)
            : new WebGLProgram(renderer, material);
    }
}

/** Create a attribute for a WebGLProgram with the current WebGLRenderer.
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {WebGLProgram} program WebGLProgram to update
 * @param {WebGLActiveInfo} attribute WebGL location of Attribute
 */
function createAttribute(renderer, program, attribute) {
    const location = renderer.gl.getAttribLocation(program.location, attribute.name);
    const divisor = attribute.type == renderer.gl.FLOAT_MAT4 ? 4
        : attribute.type == renderer.gl.FLOAT_MAT3 ? 3
            : attribute.type == renderer.gl.FLOAT_MAT2 ? 2
                : 1;
    program.setParameter(attribute.name, divisor > 1 ? (v) => {
        if (v instanceof Buffer) {
            renderer.arrayBuffer = WebGLBuffer.from(renderer, v, renderer.gl.ARRAY_BUFFER);
            let offset = v.BYTES_PER_OFFSET;
            for (let i = 1; i <= divisor; i++) {
                renderer.gl.enableVertexAttribArray(location + i);
                renderer.gl.vertexAttribPointer(location + i, v.step / divisor, WebGLRenderer.typeFrom(renderer, v.type), v.normalize, v.root.BYTES_PER_STEP, offset);
                offset += v.BYTES_PER_ELEMENT * divisor;
                if (v.divisor) {
                    renderer.gl.vertexAttribDivisor(location + i, v.divisor);
                }
            }
        } else {
            renderer.gl.disableVertexAttribArray(location);
            if (Number.isFinite(v)) {
                renderer.gl.vertexAttrib1f(location, v);
            } else {
                switch (v.length) {
                    case 4:
                        renderer.gl.vertexAttrib4fv(location, v);
                        break;
                    case 3:
                        renderer.gl.vertexAttrib3fv(location, v);
                        break;
                    case 2:
                        renderer.gl.vertexAttrib2fv(location, v);
                        break;
                    case 1:
                        renderer.gl.vertexAttrib1fv(location, v);
                        break;
                    default:
                    //throw new Error('the length of a float constant value must be between 1 and 4!');
                }
            }
        }
    } : (v) => {
        if (v instanceof Buffer) {
            renderer.arrayBuffer = WebGLBuffer.from(renderer, v, renderer.gl.ARRAY_BUFFER);
            renderer.gl.enableVertexAttribArray(location);
            renderer.gl.vertexAttribPointer(location, v.step, WebGLRenderer.typeFrom(renderer, v.type), v.normalize, v.root.BYTES_PER_STEP, v.BYTES_PER_OFFSET);
            if (v.divisor) {
                renderer.gl.vertexAttribDivisor(location, v.divisor);
            }
        } else {
            renderer.gl.disableVertexAttribArray(location);
            if (Number.isFinite(v)) {
                renderer.gl.vertexAttrib1f(location, v);
            } else {
                console.log(v)
                switch (v.length) {
                    case 4:
                        renderer.gl.vertexAttrib4fv(location, v);
                        break;
                    case 3:
                        renderer.gl.vertexAttrib3fv(location, v);
                        break;
                    case 2:
                        renderer.gl.vertexAttrib2fv(location, v);
                        break;
                    case 1:
                        renderer.gl.vertexAttrib1fv(location, v);
                        break;
                    default:
                        throw new Error('the length of a float constant value must be between 1 and 4!');
                }
            }
        }
    });
}

/** Create a uniform for a WebGLProgram with the current WebGLRenderer.
 * @param {WebGLRenderer} renderer WebGLRenderer context
 * @param {WebGLProgram} program WebGLProgram to update
 * @param {WebGLActiveInfo} uniform WebGL location of Uniform
 */
function createUniform(renderer, program, uniform) {
    const location = renderer.gl.getUniformLocation(program.location, uniform.name);
    const name = uniform.name.replace('[0]', '');
    switch (uniform.type) {
        case renderer.gl.FLOAT:
            if (uniform.size > 1) {
                program.setParameter(name, (v) => {
                    if (!program.cache[name]?.equals(v)) {
                        renderer.gl.uniform1fv(location, v);
                        program.cache[name] = v.clone();
                    }
                });
            } else {
                program.setParameter(name, (v) => {
                    if (v?.length == 1) {
                        v = v[0];
                    }
                    if (program.cache[name] != v) {
                        renderer.gl.uniform1f(location, v);
                        program.cache[name] = v;
                    }
                });
            }
            break;
        case renderer.gl.FLOAT_VEC2:
            program.setParameter(name, (v) => {
                if (v?.toVector2) {
                    v = v.toVector2();
                }
                if (!program.cache[name]?.equals(v)) {
                    renderer.gl.uniform2fv(location, v);
                    program.cache[name] = v.clone();
                }
            });
            break;
        case renderer.gl.FLOAT_VEC3:
            program.setParameter(name, (v) => {
                if (v?.toVector3) {
                    v = v.toVector3();
                }
                if (!program.cache[name]?.equals(v)) {
                    renderer.gl.uniform3fv(location, v);
                    program.cache[name] = v.clone();
                }
            });
            break;
        case renderer.gl.FLOAT_VEC4:
            program.setParameter(name, (v) => {
                if (!program.cache[name]?.equals(v)) {
                    renderer.gl.uniform4fv(location, v);
                    program.cache[name] = v.clone();
                }
            });
            break;
        case renderer.gl.BOOL:
        case renderer.gl.INT:
            if (uniform.size > 1) {
                program.setParameter(name, (v) => {
                    if (!program.cache[name]?.equals(v)) {
                        renderer.gl.uniform1iv(location, v);
                        program.cache[name] = v.clone();
                    }
                });
            } else {
                program.setParameter(name, (v) => {
                    if (v?.length == 1) {
                        v = v[0];
                    }
                    if (program.cache[name] != v) {
                        renderer.gl.uniform1i(location, v);
                        program.cache[name] = v;
                    }
                });
            }
            break;
        case renderer.gl.BOOL_VEC2:
        case renderer.gl.INT_VEC2:
            program.setParameter(name, (v) => {
                if (v?.toVector2) {
                    v = v.toVector2();
                }
                if (!program.cache[name]?.equals(v)) {
                    renderer.gl.uniform2iv(location, v);
                    program.cache[name] = v.clone();
                }
            });
            break;
        case renderer.gl.BOOL_VEC3:
        case renderer.gl.INT_VEC3:
            program.setParameter(name, (v) => {
                if (v?.toVector3) {
                    v = v.toVector3();
                }
                if (!program.cache[name]?.equals(v)) {
                    renderer.gl.uniform3iv(location, v);
                    program.cache[name] = v.clone();
                }
            });
            break;
        case renderer.gl.BOOL_VEC4:
        case renderer.gl.INT_VEC4:
            program.setParameter(name, (v) => {
                if (!program.cache[name]?.equals(v)) {
                    renderer.gl.uniform4iv(location, v);
                    program.cache[name] = v.clone();
                }
            });
            break;
        case renderer.gl.FLOAT_MAT2:
            program.setParameter(name, (v) => {
                if (!program.cache[name]?.equals(v)) {
                    renderer.gl.uniformMatrix2fv(location, false, v);
                    program.cache[name] = v.clone();
                }
            });
            break;
        case renderer.gl.FLOAT_MAT3:
            program.setParameter(name, (v) => {
                if (!program.cache[name]?.equals(v)) {
                    renderer.gl.uniformMatrix3fv(location, false, v);
                    program.cache[name] = v.clone();
                }
            });
            break;
        case renderer.gl.FLOAT_MAT4:
            program.setParameter(name, (v) => {
                if (!program.cache[name]?.equals(v)) {
                    renderer.gl.uniformMatrix4fv(location, false, v);
                    program.cache[name] = v.clone();
                }
            });
            break;
        case renderer.gl.SAMPLER_2D:
        case renderer.gl.SAMPLER_CUBE:
            if (uniform.size > 1 || uniform.name.endsWith('[0]')) {
                program.setParameter(name, (v) => {
                    if (v) {
                        if (renderer.framebuffer) {
                            v = v.filter(t => !renderer.framebuffer.linkedTo(t));
                        }
                        const units = v.map(t => {
                            const webGLTexture = WebGLTexture.from(renderer, t);
                            webGLTexture.activate();
                            return webGLTexture.unit;
                        });
                        if (program.cache[name] != units) {
                            renderer.gl.uniform1iv(location, units);
                        }
                        if (program.cache[name]) {
                            program.cache[name].forEach(unit => {
                                if (units.indexOf(unit) == -1) {
                                    WebGLTexture.deactivate(unit);
                                }
                            });
                        }
                        program.cache[name] = units;
                    } else if (program.cache[name] != null) {
                        program.cache[name].forEach(WebGLTexture.deactivate);
                        renderer.gl.uniform1iv(location, null);
                        program.cache[name] = null;
                    };
                });
            } else {
                program.setParameter(name, (v) => {
                    if (v.length) {
                        v = v[0];
                    }
                    if (v && !renderer.framebuffer?.linkedTo(v)) {
                        var texture = WebGLTexture.from(renderer, v);
                        texture.activate();
                        if (program.cache[name] != texture.unit) {
                            renderer.gl.uniform1i(location, texture.unit);
                            program.cache[name] = texture.unit;
                        }
                    } else if (program.cache[name] != null) {
                        WebGLTexture.deactivate(program.cache[name]);
                        renderer.gl.uniform1i(location, null);
                        program.cache[name] = null;
                    };
                });
            }
            break;
        default:
            throw new Error(`${uniform.type} is missing createUniform implementation.`);
    }
}