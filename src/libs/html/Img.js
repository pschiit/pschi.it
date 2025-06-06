import HtmlNode from './HtmlNode';

export default class Img extends HtmlNode {

    constructor(src, onload) {
        super('img');
        this.loadImage(src, onload);
    }

    loadImage(src, onload) {
        if (onload) {
            this.element.onload = onload;
        }
        this.element.src = src;

        return this;
    }
}