import Node from '../core/Node';

export default class Renderer extends Node {
    constructor(){
        super();
    }
    /** Render a Node in the current Renderer
     * @param {Node} node Node to render
     * @returns {Renderer} the current Renderer
     */
    render(node) {
        return this;
    }
    
    /** Remove all dependencies from Node in the current Renderer
     * @param {Node} node Node to render
     * @returns {Renderer} the current Renderer
     */
    remove(node) {
        return this;
    }
}