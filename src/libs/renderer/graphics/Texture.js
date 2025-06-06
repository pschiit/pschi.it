import GraphicsNode from './GraphicsNode';
import RenderTarget from './RenderTarget';

export default class Texture extends GraphicsNode {
    constructor(data, width = null, height = null) {
        super();
        this.data = data;
        this.updated = true;
        this.width = width;
        this.height = height;
        this.border = 0;
        this.level = 0;
        this.format = RenderTarget.format.rgba;
        this.type = Uint8Array;
        this.mipmap = false;
        this.magnification = Texture.filter.linear;
        this.minification = Texture.filter.nearestMipmaplinear;
        this.wrapS = Texture.wrapping.repeat;
        this.wrapT = Texture.wrapping.repeat;
    }

    get width() {
        if (this.parent instanceof RenderTarget) {
            return this.parent.maxX;
        }
        return this._width;
    }

    set width(v) {
        if (this._width != v) {
            this._width = v;
            this.updated = true;
        }
    }

    get height() {
        if (this.parent instanceof RenderTarget) {
            return this.parent.maxY;
        }
        return this._height;
    }

    set height(v) {
        if (this._height != v) {
            this._height = v;
            this.updated = true;
        }
    }

    get format() {
        if (this.parent instanceof RenderTarget) {
            return this.parent.colorTexture == this ? this.parent.format
                : this.parent.depthTexture == this ? RenderTarget.format.depth
                    : this.parent.stencilTexture == this ? RenderTarget.format.stencil
                        : this._format;
        }
        return this._format;
    }

    set format(v) {
        if (this._format != v) {
            this._format = v;
            this.updated = true;
        }
    }

    get type() {
        if (this.parent instanceof RenderTarget) {
            return this.parent.colorTexture == this ? this.parent.type
                : this.parent.depthTexture == this ? Uint32Array
                    : this.parent.stencilTexture == this ? Uint16Array
                        : this._type;
        }
        return this._type;
    }

    set type(v) {
        if (this._type != v) {
            this._type = v;
            this.updated = true;
        }
    }

    get magnification() {
        return this._magnification;
    }

    set magnification(v) {
        if (this._magnification != v) {
            this._magnification = v;
            this.updated = true;
        }
    }

    get minification() {
        return this._minification;
    }

    set minification(v) {
        if (this._minification != v) {
            this._minification = v;
            this.updated = true;
        }
    }

    get wrapS() {
        return this._wrapS;
    }

    set wrapS(v) {
        if (this._wrapS != v) {
            this._wrapS = v;
            this.updated = true;
        }
    }

    get wrapT() {
        return this._wrapT;
    }

    set wrapT(v) {
        if (this._wrapT != v) {
            this._wrapT = v;
            this.updated = true;
        }
    }

    static filter = {
        linear: 'LINEAR',
        nearest: 'NEAREST',
        nearestMipmapNearest: 'NEAREST_MIPMAP_NEAREST',
        linearMipmapNearest: 'LINEAR_MIPMAP_NEAREST',
        nearestMipmaplinear: 'NEAREST_MIPMAP_LINEAR ',
        linearMipmaplinear: 'LINEAR_MIPMAP_LINEAR',
    }

    static wrapping = {
        repeat: 'REPEAT',
        clamp: 'CLAMP_TO_EDGE',
        mirror: 'MIRRORED_REPEAT'
    }
}