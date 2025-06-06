import GraphicsNode from './GraphicsNode';

export default class GraphicsRenderer extends GraphicsNode {
    constructor(){
        super();
    }

    /** Render a GraphicsNode in the current GraphicsRenderer
     * @param {GraphicsNode} node Node to render
     * @returns {GraphicsRenderer} the current GraphicsRenderer
     */
    render(node) {
        return this;
    }


    /** Remove all dependencies from GraphicsNode in the current GraphicsRenderer
     * @param {GraphicsNode} node GraphicsNode to render
     * @returns {GraphicsRenderer} the current GraphicsRenderer
     */
    remove(node) {
        return this;
    }
}