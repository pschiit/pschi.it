import Texture from '../Texture';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';

export default class WebGLTexture extends WebGLNode {
    /** Create a WebGLTexture for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Texture} texture  Texture
     */
    constructor(renderer, texture) {
        super(renderer, texture.id);
        this.target = renderer.gl.TEXTURE_2D;
        this.location = renderer.gl.createTexture();

        this.mipmap = false;
        this.magnification = Texture.filter.linear;
        this.minification = Texture.filter.nearestMipmaplinear;
        this.wrapS = Texture.wrapping.repeat;
        this.wrapT = Texture.wrapping.repeat;

        if (this.target === renderer.gl.TEXTURE_2D) {
            this.update = (texture) => {
                renderer.texture2d = this;
                if (this.mipmap != texture.mipmap) {
                    renderer.gl.generateMipmap(this.target);
                    this.mipmap = texture.mipmap;
                }
                if (this.magnification != texture.magnification) {
                    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MAG_FILTER, renderer.gl[texture.magnification]);
                    this.magnification = texture.magnification;
                }
                if (this.minification != texture.minification) {
                    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_MIN_FILTER, renderer.gl[texture.minification]);
                    this.minification = texture.minification;
                }
                if (this.wrapS != texture.wrapS) {
                    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_S, renderer.gl[texture.wrapS]);
                    this.wrapS = texture.wrapS;
                }
                if (this.wrapT != texture.wrapT) {
                    renderer.gl.texParameteri(renderer.gl.TEXTURE_2D, renderer.gl.TEXTURE_WRAP_T, renderer.gl[texture.wrapT]);
                    this.wrapT = texture.wrapT;
                }
                const format = WebGLRenderer.formatFrom(renderer, texture.format);
                const type = WebGLRenderer.typeFrom(renderer, texture.type);
                if (texture.width && texture.height) {
                    this.width = texture.width;
                    this.height = texture.height;
                    renderer.gl.texImage2D(this.target, texture.level, format, texture.width, texture.height, texture.border, format, type, texture.data);

                } else {
                    renderer.gl.texImage2D(this.target, texture.level, format, format, type, texture.data);
                }
            };
        } else if (this.target === renderer.gl.TEXTURE_CUBE_MAP) {
            this.update = (texture) => {
                if (texture.updated) {
                    const format = WebGLRenderer.formatFrom(renderer, texture.format);
                    const type = WebGLRenderer.typeFrom(renderer, texture.type);
                    renderer.gl.bindTexture(this.target, this.location);
                    renderer.gl.texImage2D(this.target, texture.level, format, format, type, texture.data);
                };
                texture.updated = false;
            }
        }

        this.activate = () => {
            let unit = this.unit;
            if(unit == -1){
                textures.push(this);
                renderer.gl.activeTexture(renderer.gl.TEXTURE0 + this.unit);
                renderer.texture2d = this;
            }
        }
    }
        
    get unit(){
        return textures.indexOf(this);
    }

    deactivate() {
        WebGLTexture.deactivate(this.unit);
    }

    /** Return whether or not this WebGLTexture has been created from the Texture
     * @param {Texture} texture  Texture to compare
     */
    is(texture) {
        return this.name == texture.id;
    }

    /** Get the Texture's WebGLTexture from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the rendering context
     * @param {Texture} texture the Texture
     * @returns {WebGLTexture} the WebGLTexture
     */
    static from(renderer, texture) {
        if (!renderer.nodes[texture.id]) {
            texture.updated = true;
        }
        const webGLTexture = renderer.nodes[texture.id] || new WebGLTexture(renderer, texture);
        if (webGLTexture.width != texture.width || webGLTexture.height != texture.height) {
            texture.updated = true;
        }
        if (texture.updated) {
            webGLTexture.update(texture);
            texture.updated = false;
        };
        return webGLTexture;
    }

    static deactivate(unit){
        if(textures.length > unit){
            textures.splice(unit, 1);
        }
    }
}

const textures = [];