import HtmlNode from './HtmlNode';

export default class Button extends HtmlNode {
    /** Create a new Input HtmlNode
    */
    constructor(onclick, type) {
        super('button');
        this.element.name = this.id;
        this.element.title = this.id;
        this.element.type = type ?? 'button';
        this.onclick = onclick;
    }

    set text(v){
        this.element.innerHTML = v;
    }

    set onclick(v) {
        this.element.onclick = v;
    }
}