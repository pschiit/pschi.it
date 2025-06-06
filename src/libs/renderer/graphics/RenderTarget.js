import Color from '../../core/Color';
import Vector4 from '../../math/Vector4';
import GraphicsNode from './GraphicsNode';

export default class RenderTarget extends GraphicsNode {
    constructor(data, width = null, height = null, x = 0, y = 0) {
        super();
        this.viewport = new Vector4(x,y,width,height);
        this.data = data;
        this.format = RenderTarget.format.rgba;
        this.type = Uint8Array;
        this.backgroundColor = Color.black();
        this.scissor = null;
        this.read = null;
        this.material = null;

        this.colorTexture = null;
        this.depthTexture = null;
        this.stencilTexture = null;
    }

    get maxX(){
        return this.x + this.width;
    }

    get maxY(){
        return this.y + this.height;
    }

    get x() {
        return this.viewport[0];
    }

    set x(v) {
        this.viewport[0] = v;
    }

    get y() {
        return this.viewport[1];
    }

    set y(v) {
        this.viewport[1] = v;
    }

    get width() {
        return this.viewport[2];
    }

    set width(v) {
        this.viewport[2] = v;
    }

    get height() {
        return this.viewport[3];
    }

    set height(v) {
        this.viewport[3] = v;
    }

    get format() {
        return this._format;
    }

    set format(v) {
        if (this.format != v) {
            this._format = v;
            this.step = this.format === RenderTarget.format.rgba ? 4
                : this.format === RenderTarget.format.rbg ? 3
                    : 1;
        }
    }

    get size() {
        return this.width * this.height * this.step
    }

    get scissorSize() {
        return this.scissor ? this.scissor[2] * this.scissor[3] * this.step
            : 0;
    }

    get output() {
        if (this.read) {
            const length = this.read[2] * this.read[3] * this.step;
            if (this._readBuffer?.length != length) {
                this._readBuffer = new this.type(length);
            }
            return this._readBuffer;
        } else {
            if (this._readBuffer) {
                this._readBuffer = null;
            }
            return null;
        }
    }

    get readSize() {
        return this.read ? this.read[2] * this.read[3] * this.step
            : 0;
    }

    get aspectRatio() {
        return this.width / this.height;
    }

    get colorTexture() {
        return this.childrens[this._colorTexture];
    }

    set colorTexture(v) {
        if (this.colorTexture != v) {
            if(v && v.parent != this){
                this._colorTexture = this.appendChild(v);
            } else if(!v){
                if(this.colorTexture){
                    this.removeChild(this.colorTexture);
                    this._colorTexture = null;
                }
            }
        }
    }

    get depthTexture() {
        return this.childrens[this._depthTexture];
    }

    set depthTexture(v) {
        if (this.depthTexture != v) {
            if(v && v.parent != this){
                this._depthTexture = this.appendChild(v);
            } else if(!v){
                if(this.depthTexture){
                    this.removeChild(this.depthTexture);
                    this._depthTexture = null;
                }
            }
        }
    }

    get stencilTexture() {
        return this.childrens[this._stencilTexture];
    }

    set stencilTexture(v) {
        if (this.stencilTexture != v) {
            if(v && v.parent != this){
                this._stencilTexture = this.appendChild(v);
            } else if(!v){
                if(this.stencilTexture){
                    this.removeChild(this.stencilTexture);
                    this._stencilTexture = null;
                }
            }
        }
    }

    static format = {
        rgba: 'RGBA',
        rgb: 'RGB',
        alpha: 'ALPHA',
        depth: 'DEPTH_COMPONENT',
        stencil: 'DEPTH_STENCIL'
    };
}