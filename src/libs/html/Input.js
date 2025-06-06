import HtmlNode from './HtmlNode';

export default class Input extends HtmlNode {
    /** Create a new Input HtmlNode
    */
    constructor(type) {
        super('input');
        this.element.name = this.id;
        this.element.title = this.id;
        this.element.type = type;
    }
}