import Node from '../../../core/Node';
import WebGLRenderer from './WebGLRenderer';

export default class WebGLNode extends Node {
    /** Create a WebGLNode from a Node for a WebGLRenderingContext
     * @param {WebGLRenderer} renderer the context of the renderer
     * @param {String} name Node name
     */
    constructor(renderer, name) {
        super();
        this.name = name;
        this.location = null;
        renderer.appendChild(this);
    }
}