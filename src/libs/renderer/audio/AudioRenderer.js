import Renderer from '../Renderer';
import AudioNode from './AudioNode';

export default class AudioRenderer extends Renderer {
    constructor(){
        super();
    }
    /** Render a AudioNode in the current AudioRenderer
     * @param {AudioNode} node AudioNode to render
     * @returns {AudioRenderer} the current AudioRenderer
     */
    render(node) {
        return this;
    }


    /** Remove all dependencies from AudioNode in the current AudioRenderer
     * @param {AudioNode} node AudioNode to render
     * @returns {AudioRenderer} the current AudioRenderer
     */
    remove(node) {
        return this;
    }
}