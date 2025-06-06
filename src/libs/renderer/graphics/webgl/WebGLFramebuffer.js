import RenderTarget from '../RenderTarget';
import Texture from '../Texture';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';
import WebGLTexture from './WebGLTexture';

export default class WebGLFramebuffer extends WebGLNode {
    /** Create a WebGLFramebuffer for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {RenderTarget} renderTarget  RenderTarget
     */
    constructor(renderer, renderTarget) {
        super(renderer, renderTarget.id);
        this.location = renderer.gl.createFramebuffer();
        this.width = renderTarget.maxX;
        this.height = renderTarget.maxY;

        renderTarget.colorTexture.updated = true;
        this.colorTexture = WebGLTexture.from(renderer, renderTarget.colorTexture);
        if (renderTarget.depthTexture) {
            this.depthTexture = WebGLTexture.from(renderer, renderTarget.depthTexture);
        } else {
            this.renderBuffer = renderer.gl.createRenderbuffer();
            renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, this.renderBuffer);
            renderer.gl.renderbufferStorage(renderer.gl.RENDERBUFFER, renderer.gl.DEPTH_COMPONENT16, this.width, this.height);
        }
        if (renderTarget.stencilTexture) {
            this.stencilTexture = WebGLTexture.from(renderer, renderTarget.stencilTexture);
        }

        renderer.gl.bindFramebuffer(renderer.gl.FRAMEBUFFER, this.location);
        renderer.gl.framebufferTexture2D(renderer.gl.FRAMEBUFFER, renderer.gl.COLOR_ATTACHMENT0, this.colorTexture.target, this.colorTexture.location, renderTarget.colorTexture.level);
        if (this.depthTexture) {
            renderer.gl.framebufferTexture2D(renderer.gl.FRAMEBUFFER, renderer.gl.DEPTH_ATTACHMENT, this.depthTexture.target, this.depthTexture.location, renderTarget.depthTexture.level);
        } else {
            renderer.gl.framebufferRenderbuffer(renderer.gl.FRAMEBUFFER, renderer.gl.DEPTH_ATTACHMENT, renderer.gl.RENDERBUFFER, this.renderBuffer);
        }
        if (this.stencilTexture) {
            renderer.gl.framebufferTexture2D(renderer.gl.FRAMEBUFFER, renderer.gl.STENCIL_ATTACHMENT, this.stencilTexture.target, this.stencilTexture.location, renderTarget.stencilTexture.level);
        }

        var e = renderer.gl.checkFramebufferStatus(renderer.gl.FRAMEBUFFER);
        if (e !== renderer.gl.FRAMEBUFFER_COMPLETE) {
            const error = new Error('Framebuffer object is incomplete: ' + e);
            renderer.removeChild(this);
            throw error;
        }
        renderer.gl.bindFramebuffer(renderer.gl.FRAMEBUFFER, null);
        if (this.renderBuffer) {
            renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, null);
        }

        this.update = (renderTarget) => {
            if (renderTarget.maxX != this.width
                || renderTarget.maxY != this.height) {
                this.width = renderTarget.maxX;
                this.height = renderTarget.maxY;
                renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, this.renderBuffer);
                renderer.gl.renderbufferStorage(renderer.gl.RENDERBUFFER, renderer.gl.DEPTH_COMPONENT16, this.width, this.height);
                renderer.gl.bindRenderbuffer(renderer.gl.RENDERBUFFER, null);
            }
            this.colorTexture.deactivate();
            this.colorTexture.update(renderTarget.colorTexture);
            if(this.depthTexture){
                this.colorTexture.deactivate();
                this.depthTexture.update(renderTarget.depthTexture);
            }
            if(this.stencilTexture){
                this.colorTexture.deactivate();
                this.stencilTexture.update(renderTarget.stencilTexture);
            }
        }
    }

    /** Return whether or not this WebGLFramebuffer has been created from the RenderTarget
     * @param {RenderTarget} node  RenderTarget to compare
     */
    is(node) {
        return this.name == node.id;
    }


    /** Return whether or not the Texture is linked to this WebGLFramebuffer
     * @param {Texture} texture  Texture to compare
     */
    linkedTo(texture) {
        return texture.id == this.colorTexture.name
            || texture.id == this.depthTexture?.name
            || texture.id == this.stencilTexture?.name;
    }

    /** Get the RenderTarget's WebGLFramebuffer from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the rendering context
     * @param {RenderTarget} renderTarget the RenderTarget
     * @returns {WebGLFramebuffer} the WebGLFramebuffer
     */
    static from(renderer, renderTarget) {
        const webGLFramebuffer = renderer.nodes[renderTarget.id] || new WebGLFramebuffer(renderer, renderTarget);
        webGLFramebuffer.update(renderTarget);
        return webGLFramebuffer;
    }
}