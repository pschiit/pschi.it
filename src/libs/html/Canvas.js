import HtmlNode from'./HtmlNode';

export default class  Canvas extends HtmlNode {

    /** Create a new Canvas HtmlNode
    */
    constructor() {
        super('canvas');
        /** @type {HTMLCanvasElement} */
        this.element;
    }
}