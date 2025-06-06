import Node from '../core/Node';
import Vector2 from '../math/Vector2';
import GraphicsNode from '../renderer/graphics/GraphicsNode';
import RenderTarget from '../renderer/graphics/RenderTarget';
import WebGLRenderer from '../renderer/graphics/webgl/WebGLRenderer';
import Canvas from './Canvas';

export default class WebGLCanvas extends Canvas {
    /** Create a new WebGLCanvas HtmlNode
     * @param {Object} contextOptions webgl options for context initialization 
    */
    constructor(contextOptions) {
        super();
        this._renderTarget = new RenderTarget();
        initContext(this, contextOptions);

        this.element.addEventListener('webglcontextlost', (e) => {
            this.removeChild(this.context);
        });
        this.element.addEventListener('webglcontextrestored', (e) => {
            initContext(contextOptions);
        });

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (!(child instanceof WebGLRenderer)
                || child.gl.canvas !== this.element) {
                this.removeChild(child);
            }
        });
        this.element.addEventListener('contextmenu', (ev) => {
            ev.preventDefault(); // this will prevent browser contextmenu default behavior on this canvas
        });

        // this.element.onclick = () => {
        //     if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        //         && this.element.requestFullscreen) {
        //         this.element.requestFullscreen();
        //     }
        // }
    }

    /** Return the RenderTarget of the current HtmlNode's HTMLElement
     * @return {RenderTarget} RenderTarget of the HTMLElement
    */
    get renderTarget() {
        const width = this.clientWidth * this.pixelRatio;
        const height = this.clientHeight * this.pixelRatio;
        if (this.width !== width) {
            this.width = width;
        }
        if (this.height !== height) {
            this.height = height;
        }
        this._renderTarget.width = this.width;
        this._renderTarget.height = this.height;
        return this._renderTarget;
    }

    /** Return the WebGLRenderer context of the current HtmlNode's HTMLElement
     * @return {WebGLRenderer} WebGLRenderer of the HTMLElement
    */
    get context() {
        if (this.childrens.length > 0) {
            return this.childrens[0];
        }
        return null;
    }

    /** Render a GraphicsNode in the WebGLCanvas
     * @param {GraphicsNode} node GraphicsNode to render
     * @returns {WebGLCanvas} the current WebGLCanvas
     */
    render(node) {
        if (arguments.length > 1) {
            WebGLCanvas.repeatFunction(arguments, this.render.bind(this));
        } else {
            this.context.render(node);
        }

        return this;
    }

    /** Remove all dependencies from GraphicsNode in the current Renderer
     * @param {GraphicsNode} node Node to render
     * @returns {WebGLCanvas} the current Renderer
     */
    remove(node) {
        if (arguments.length > 1) {
            WebGLCanvas.repeatFunction(arguments, this.remove.bind(this));
        } else {
            this.context.remove(node);
        }

        return this;
    }

    /** Get the pointer webgl-relative position (-1, 1) from an Pointer(or Mouse) Event,
     * assumes HTMLElement doesn't have padding or border
     * @param {PointerEvent} event Pointer event
     * @return {Vector2} the pointer position as Vector2
    */
    getNormalizedPointerPosition(event) {
        const rect = this.element.getBoundingClientRect();

        return new Vector2(
            ((event.clientX - rect.left) * this.width / this.element.clientWidth) / this.width * 2 - 1,
            ((event.clientY - rect.top) * this.height / this.element.clientHeight) / this.height * -2 + 1
        );
    }
}

function initContext(webGLCanvas, contextOptions) {
    const newContext = new WebGLRenderer(webGLCanvas.element.getContext('webgl', contextOptions) || webGLCanvas.element.getContext('experimental-webgl', contextOptions));
    if (!newContext) {
        webGLCanvas.element.innerText = 'WebGL is not supported.';
        throw new Error(webGLCanvas.element.innerText);
    }
    webGLCanvas.appendChild(newContext);
}