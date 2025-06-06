import HtmlNode from './HtmlNode';

export default class Label extends HtmlNode {
    /** Create a new Input HtmlNode
    */
    constructor(input, name) {
        super('label');
        this.element.setAttribute('for', input.id);
        if(name){
            this.element.innerHTML = name;
        }
    }
}