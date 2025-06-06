import VertexBuffer from '../../renderer/graphics/buffer/VertexBuffer';
import Render from '../../renderer/graphics/Render';

export default class BoxBuffer extends VertexBuffer {
    constructor(width = 1, height = 1, depth = 1, bevel = 0, color = null) {
        super();
        this.primitive = Render.primitive.triangles;
        this.width = width;
        this.height = height;
        this.depth = depth;
        this.bevel = bevel;
        this.generatePosition();
        this.generateNormal();

        if (color) {
            this.generateColor(color);
        }
    }

    generatePosition() {
        const x = (this.width / 2),
            y = (this.height / 2),
            z = (this.depth / 2);
        if (this.bevel) {
            const b = this.bevel;
            this.position = [
                //near
                -x + b, -y + b, -z,
                -x + b, y - b, -z,
                x - b, y - b, -z,
                x - b, -y + b, -z,
                //near top
                -x + b, y - b, -z,
                -x + b, y, -z + b,
                x - b, y, -z + b,
                x - b, y - b, -z,
                //near top triangle
                x - b, y - b, -z,
                x - b, y, -z + b,
                x, y - b, -z + b,
                //near right
                x - b, -y + b, -z,
                x - b, y - b, -z,
                x, y - b, -z + b,
                x, -y + b, -z + b,
                //near bottom triangle
                x - b, -y, -z + b,
                x - b, -y + b, -z,
                x, -y + b, -z + b,
                //near bottom
                -x + b, -y, -z + b,
                -x + b, -y + b, -z,
                x - b, -y + b, -z,
                x - b, -y, -z + b,

                //right
                x, -y + b, -z + b,
                x, y - b, -z + b,
                x, y - b, z - b,
                x, -y + b, z - b,
                //right top
                x, y - b, -z + b,
                x - b, y, -z + b,
                x - b, y, z - b,
                x, y - b, z - b,
                //right top triangle
                x, y - b, z - b,
                x - b, y, z - b,
                x - b, y - b, z,
                //right right
                x, -y + b, z - b,
                x, y - b, z - b,
                x - b, y - b, z,
                x - b, -y + b, z,
                //right bottom triangle
                x - b, -y, z - b,
                x, -y + b, z - b,
                x - b, -y + b, z,
                //right bottom
                x - b, -y, -z + b,
                x, -y + b, -z + b,
                x, -y + b, z - b,
                x - b, -y, z - b,

                //top
                x - b, y, z - b,
                x - b, y, -z + b,
                -x + b, y, -z + b,
                -x + b, y, z - b,

                //far
                x - b, -y + b, z,
                x - b, y - b, z,
                -x + b, y - b, z,
                -x + b, -y + b, z,
                //far top
                x - b, y - b, z,
                x - b, y, z - b,
                -x + b, y, z - b,
                -x + b, y - b, z,
                //far top triangle
                -x + b, y - b, z,
                -x + b, y, z - b,
                -x, y - b, z - b,
                //far right
                -x + b, -y + b, z,
                -x + b, y - b, z,
                -x, y - b, z - b,
                -x, -y + b, z - b,
                //far bottom triangle
                -x + b, -y, z - b,
                -x + b, -y + b, z,
                -x, -y + b, z - b,
                //far bottom
                x - b, -y, z - b,
                x - b, -y + b, z,
                -x + b, -y + b, z,
                -x + b, -y, z - b,

                //left
                -x, -y + b, z - b,
                -x, y - b, z - b,
                -x, y - b, -z + b,
                -x, -y + b, -z + b,
                //left top
                -x, y - b, z - b,
                -x + b, y, z - b,
                -x + b, y, -z + b,
                -x, y - b, -z + b,
                //left top triangle
                -x, y - b, -z + b,
                -x + b, y, -z + b,
                -x + b, y - b, -z,
                //left right
                -x, -y + b, -z + b,
                -x, y - b, -z + b,
                -x + b, y - b, -z,
                -x + b, -y + b, -z,
                //left bottom triangle
                -x + b, -y, -z + b,
                -x, -y + b, -z + b,
                -x + b, -y + b, -z,
                //left bottom
                -x + b, -y, z - b,
                -x, -y + b, z - b,
                -x, -y + b, -z + b,
                -x + b, -y, -z + b,

                //bottom
                -x + b, -y, z - b,
                -x + b, -y, -z + b,
                x - b, -y, -z + b,
                x - b, -y, z - b,
            ];

            this.index = [
                0, 1, 2, 2, 3, 0,//near
                4, 5, 6, 6, 7, 4,//near top
                8, 9, 10,//near top triangle
                11, 12, 13, 13, 14, 11,//near right
                15, 16, 17,//near bottom triangle
                18, 19, 20, 20, 21, 18,//near top bottom

                22, 23, 24, 24, 25, 22,//right
                26, 27, 28, 28, 29, 26,//right top
                30, 31, 32,//right top triangle
                33, 34, 35, 35, 36, 33,//right right
                37, 38, 39,//right bottom triangle
                40, 41, 42, 42, 43, 40,//right bottom

                44, 45, 46, 46, 47, 44,//top

                48, 49, 50, 50, 51, 48,//far
                52, 53, 54, 54, 55, 52,//far top
                56, 57, 58,//far top triangle
                59, 60, 61, 61, 62, 59,//far right
                63, 64, 65,//far bottom triangle
                66, 67, 68, 68, 69, 66,//far bottom

                70, 71, 72, 72, 73, 70,//left
                74, 75, 76, 76, 77, 74,//left top
                78, 79, 80,//left top triangle
                81, 82, 83, 83, 84, 81,//left right
                85, 86, 87,//left bottom triangle
                88, 89, 90, 90, 91, 88,//left bottom

                92, 93, 94, 94, 95, 92,//top
            ];
        } else {
            this.position = [
                -x, -y, -z,//near
                -x, y, -z,
                x, y, -z,
                x, -y, -z,

                x, -y, -z,//right
                x, y, -z,
                x, y, z,
                x, -y, z,

                x, -y, z,//far
                x, y, z,
                -x, y, z,
                -x, -y, z,

                x, y, z,//top
                x, y, -z,
                -x, y, -z,
                -x, y, z,

                -x, -y, z,//left
                -x, y, z,
                -x, y, -z,
                -x, -y, -z,

                -x, -y, z,//bottom
                -x, -y, -z,
                x, -y, -z,
                x, -y, z];
            this.index = [
                0, 1, 2, 2, 3, 0,
                4, 5, 6, 6, 7, 4,
                8, 9, 10, 10, 11, 8,
                12, 13, 14, 14, 15, 12,
                16, 17, 18, 18, 19, 16,
                20, 21, 22, 22, 23, 20];
        }
    }

    static fromBox(box) {
        const size = box.size;
        return new BoxBuffer(size[0], size[1], size[2]);
    }

    static rainbowColor = [
        0, 0, 0, 1,
        0, 1, 0, 1,
        1, 1, 0, 1,
        1, 0, 0, 1,

        1, 0, 0, 1,
        1, 1, 0, 1,
        1, 1, 1, 1,
        1, 0, 1, 1,

        1, 0, 1, 1,
        1, 1, 1, 1,
        0, 1, 1, 1,
        0, 0, 1, 1,

        1, 1, 1, 1,
        1, 1, 0, 1,
        0, 1, 0, 1,
        0, 1, 1, 1,

        0, 0, 1, 1,
        0, 1, 1, 1,
        0, 1, 0, 1,
        0, 0, 0, 1,

        0, 0, 1, 1,
        0, 0, 0, 1,
        1, 0, 0, 1,
        1, 0, 1, 1,];
}