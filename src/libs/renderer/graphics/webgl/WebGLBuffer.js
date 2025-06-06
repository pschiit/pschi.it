
import Buffer from '../../../core/Buffer';
import WebGLNode from './WebGLNode';
import WebGLRenderer from './WebGLRenderer';

export default class WebGLBuffer extends WebGLNode {
    /** Create a WebGLBuffer from a Buffer for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {Buffer} buffer  Buffer
     * @param {Number} webGLTarget  WebGL target
     */
    constructor(renderer, buffer, webGLTarget) {
        super(renderer, buffer.id);
        this.target = webGLTarget;
        this.location = renderer.gl.createBuffer();
        this.usage = getUsage(renderer, buffer);

        if (webGLTarget === renderer.gl.ELEMENT_ARRAY_BUFFER) {
            this.update = (buffer) => {
                renderer.elementArrayBuffer = this;
                const newLength = buffer.length;
                if (this.length >= newLength) {
                    renderer.gl.bufferSubData(this.target, 0, buffer.data);
                } else {
                    renderer.gl.bufferData(this.target, buffer.data, this.usage);
                    this.length = newLength;
                }
            };
        } else {
            this.update = (buffer) => {
                renderer.arrayBuffer = this;
                const newLength = buffer.length;
                if (this.length >= newLength) {
                    const data = buffer.data;
                    renderer.gl.bufferSubData(this.target, 0, data);
                } else {
                    const data = buffer.data;
                    renderer.gl.bufferData(this.target, data, this.usage);
                    this.length = newLength;
                }
            };
        }
    }

    /** Return whether or not this WebGLBuffer has been created from the Buffer
     * @param {Buffer} buffer  Buffer to compare
     */
    is(buffer) {
        return this.name == buffer.id;
    }

    /** Get the Buffer's WebGLBuffer from a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the rendering context
     * @param {Buffer} buffer the Buffer
     * @param {Number} webGLTarget  WebGL target
     * @returns {WebGLBuffer} the WebGLBuffer
     */
    static from(renderer, buffer, webGLTarget) {
        var mainBuffer = buffer.root;
        if (!renderer.nodes[mainBuffer.id]) {
            mainBuffer.updated = true;
        }
        const webGLBuffer = renderer.nodes[mainBuffer.id] || new WebGLBuffer(renderer, mainBuffer, webGLTarget);

        if (mainBuffer.updated) {
            webGLBuffer.update(mainBuffer);
            mainBuffer.updated = false;
        };

        return webGLBuffer;
    }
}

function getUsage(renderer, buffer) {
    return buffer.usage === Buffer.usage.dynamic ? renderer.gl.DYNAMIC_DRAW
        : buffer.usage === Buffer.usage.stream ? renderer.gl.STREAM_DRAW
            : renderer.gl.STATIC_DRAW;
}