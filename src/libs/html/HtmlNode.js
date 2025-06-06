import Node from '../core/Node';
import Vector2 from '../math/Vector2';

export default class HtmlNode extends Node {
    /** Create a new HtmlNode
     * @param {string} type the HTML tag of the new HtmlNode HTMLElement
    */
    constructor(type) {
        super();
        this._style = {};
        if (type) {
            this.element = document.createElement(type);
            this.element.id = this.id;
        }

        this.addEventListener(Node.event.nodeInserted, (e) => {
            const child = e.inserted;
            if (child instanceof HtmlNode) {
                this.element.appendChild(child.element);
            }
        });
        this.addEventListener(Node.event.nodeRemoved, (e) => {
            const child = e.removed;
            if (child instanceof HtmlNode) {
                child.element.remove();
            }
        });
    }

    /** Return the style applied to the current HtmlNode's HTMLElement
     * @return {Object} type the HTML tag of the new HtmlNode HTMLElement
    */
    get style() {
        return this._style;
    }

    /** Update the style applied to the current HtmlNode's HTMLElement.
     * This only update the properties of style and do not remove missing properties
     * @param {Object} value the object representation of the style properties modifications
    */
    set style(value) {
        for (const key in value) {
            if (Object.hasOwnProperty.call(value, key)) {
                this.element.style[key] = value[key];
                this._style[key] = this.element.style[key];
            }
        }
    }

    /** Return the width of the current HtmlNode's HTMLElement
     * @return {Number} width of the HTMLElement
    */
    get width() {
        return this.element.width;
    }

    /** Set the width of the current HtmlNode's HTMLElement
     * @param {Number} width of the HTMLElement
    */
    set width(value) {
        this.element.width = value;
    }

    /** Return the height of the current HtmlNode's HTMLElement
     * @param {Number} height of the HTMLElement
    */
    get height() {
        return this.element.height;
    }

    /** Set the height of the current HtmlNode's HTMLElement
     * @param {Number} height of the HTMLElement
    */
    set height(value) {
        this.element.height = value;
    }

    /** Return the clientWidth of the current HtmlNode's HTMLElement
     * @return {Number} clientWidth of the HTMLElement
    */
    get clientWidth() {
        return this.element.clientWidth;
    }

    /** Return the clientHeight of the current HtmlNode's HTMLElement
     * @return {Number} clientHeight of the HTMLElement
    */
    get clientHeight() {
        return this.element.clientHeight;
    }

    /** Return the aspect ratio of the current HtmlNode's HTMLElement
     * @return {Number} width / height of the HTMLElement
    */
    get aspectRatio() {
        return this.clientWidth / this.clientHeight;
    }

    get pixelRatio() {
        return window.devicePixelRatio;
    }

    vibrate(pattern) {
        if (navigator.vibrate) {
            navigator.vibrate(pattern);
        }
    }

    /** Set the width and height of the current HtmlNode's HTMLElement
     * to the parent's HTMLElement.clientWidth/clientHeight
     * @return the current HtmlNode
    */
    fitParent() {
        if (this.parent?.element) {
            this.width = this.parent.element.clientWidth;
            this.height = this.parent.element.clientHeight;
        }

        return this;
    }


    /** Registers an event handler of a specific event type on the current Node
     * @param {string} type the type of event for which to add an event listener
     * @param {Function} listener event listener to be added
     * @return {Node} the current Node
    */
    addEventListener(type, listener) {
        super.addEventListener(type, listener);
        if (type.startsWith('key')) {
            document.addEventListener(type, listener);
        } else {
            this.element?.addEventListener(type, listener);
        }
        return this;
    }

    /** Removes an event listener from the current Node
     * @param {string} type the type of event for which to remove an event listener
     * @param {Function} listener the event listener to be removed
     * @return {Node} the current Node
    */
    removeEventListener(type, listener) {
        super.removeEventListener(type, listener);
        if (type.startsWith('key')) {
            document.removeEventListener(type, listener);
        } else {
            this.element?.removeEventListener(type, listener);
        }
        return this;
    }

    /** Dispatches an event to the current Node
     * the event will carry the current Node as target
     * @param {Object} event the object to dispatch
     * @return {Node} the current Node
    */
    dispatchEvent(event) {
        super.dispatchEvent(event);
        if (event instanceof Event) {
            this.element?.dispatchEvent(event);
        }
        return this;
    }

    /** Get the pointer position from an Pointer(or Mouse) Event,
     * assumes HTMLElement doesn't have padding or border
     * @param {PointerEvent} event Pointer event
     * @return {Vector2} the pointer position as Vector2
    */
    getPointerPosition(event) {
        const rect = this.element.getBoundingClientRect();
        return new Vector2(
            Math.round((event.clientX - rect.left) * this.width / this.element.clientWidth),
            Math.round((rect.bottom - event.clientY) * this.height / this.element.clientHeight)
        );
    }

    setPointerCapture(pointerId) {
        this.element.setPointerCapture(pointerId);
    }

    releasePointerCapture(pointerId) {
        this.element.releasePointerCapture(pointerId);
    }

    saveFile(data, fileName, fileType) {
        return new Promise((resolve, reject) => {
            const dataView = data instanceof ArrayBuffer ? new DataView(data) : data;
            const blob = new Blob([dataView], { type: fileType });

            if (navigator.msSaveBlob) {
                navigator.msSaveBlob(blob, fileName);
                return resolve();
            } else if (/iPhone|fxios/i.test(navigator.userAgent)) {
                // This method is much slower but createObjectURL
                // is buggy on iOS
                const reader = new FileReader();
                reader.addEventListener('loadend', () => {
                    if (reader.error) {
                        return reject(reader.error);
                    }
                    if (reader.result) {
                        const a = document.createElement('a');
                        // @ts-ignore
                        a.href = reader.result;
                        a.download = fileName;
                        document.body.appendChild(a);
                        a.click();
                        document.body.removeChild(a);
                    }
                    resolve();
                });
                reader.readAsDataURL(blob);
            } else {
                const downloadUrl = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = downloadUrl;
                a.download = fileName;
                document.body.appendChild(a);
                a.click();
                URL.revokeObjectURL(downloadUrl);
                setTimeout(resolve, 100);
                document.body.removeChild(a);
            }
        });
    }

    /** Return the HtmlNode singleton of the document
     * @return {HtmlNode} the document HtmlNode
    */
    static get document() {
        if (!HtmlNode.documentNode) {
            HtmlNode.documentNode = new HtmlNode();
            HtmlNode.documentNode.element = document.documentElement;
        }
        return HtmlNode.documentNode;
    }

    /** Return the HtmlNode singleton of the document.body
     * @return {HtmlNode} the document.body HtmlNode
    */
    static get body() {
        if (!HtmlNode.bodyNode) {
            HtmlNode.bodyNode = new HtmlNode();
            HtmlNode.bodyNode.parent = HtmlNode.document;
            HtmlNode.bodyNode.element = document.body;
        }
        return HtmlNode.bodyNode;
    }
}