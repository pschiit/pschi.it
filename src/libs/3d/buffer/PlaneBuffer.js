import Color from '../../core/Color';
import Render from '../../renderer/graphics/Render';
import VertexBuffer from '../../renderer/graphics/buffer/VertexBuffer';

export default class PlaneBuffer extends VertexBuffer {
    constructor(width = 1, height = 1, bevel = 0, color = null) {
        super();
        this.primitive = Render.primitive.triangles;
        this.width = width;
        this.height = height;
        this.bevel = bevel;

        this.generatePosition();
        this.generateNormal();
        if (color) {
            this.generateColor(color);
        }
    }

    generatePosition() {
        //center vertices
        const x = (this.width / 2),
            y = (this.height / 2);
        if (this.bevel) {
            const bevel = this.bevel;
            this.position = [
                //left bottom triangle
                -x + bevel, -y, 0 + bevel,
                -x, -y + bevel, 0 + bevel,
                -x + bevel, -y + bevel, 0,

                //left
                -x, -y + bevel, 0 + bevel,
                -x, y - bevel, 0 + bevel,
                -x + bevel, y - bevel, 0,
                -x + bevel, -y + bevel, 0,

                //left top triangle
                -x, y - bevel, 0 + bevel,
                -x + bevel, y, 0 + bevel,
                -x + bevel, y - bevel, 0,

                //center bottom
                -x + bevel, -y, 0 + bevel,
                -x + bevel, -y + bevel, 0,
                x - bevel, -y + bevel, 0,
                x - bevel, -y, 0 + bevel,

                //center
                -x + bevel, -y + bevel, 0,
                -x + bevel, y - bevel, 0,
                x - bevel, y - bevel, 0,
                x - bevel, -y + bevel, 0,

                //center top
                -x + bevel, y - bevel, 0,
                -x + bevel, y, 0 + bevel,
                x - bevel, y, 0 + bevel,
                x - bevel, y - bevel, 0,

                //right top triangle
                x - bevel, y - bevel, 0,
                x - bevel, y, 0 + bevel,
                x, y - bevel, 0 + bevel,

                //right
                x - bevel, -y + bevel, 0,
                x - bevel, y - bevel, 0,
                x, y - bevel, 0 + bevel,
                x, 0 - y + bevel, 0 + bevel,

                //right bottom triangle
                x - bevel, -y, 0 + bevel,
                x - bevel, -y + bevel, 0,
                x, -y + bevel, 0 + bevel,
            ];

            this.index = [
                0, 1, 2,//left bottom triangle
                3, 4, 5, 5, 6, 3,//left
                7, 8, 9,//left top triangle
                10, 11, 12, 12, 13, 10,//center bottom
                14, 15, 16, 16, 17, 14,//center
                18, 19, 20, 20, 21, 18,//center top
                22, 23, 24,//right top triangle
                25, 26, 27, 27, 28, 25,//right
                29, 30, 31,//right bottom triangle
            ];
        } else {
            this.position = [
                -x, -y, 0,
                -x, y, 0,
                x, y, 0,
                x, -y, 0,];

            this.index = [
                0, 1, 2, 2, 3, 0,];
        }
    }

    static rainbowColor = [
        1, 0, 0, 1,
        0, 1, 0, 1,
        0, 0, 1, 1,
        1, 1, 1, 1];
}