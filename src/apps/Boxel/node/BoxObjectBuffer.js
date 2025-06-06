import Color from '../../../libs/core/Color';
import Int8Vector3 from '../../../libs/math/Int8Vector3';
import Uint8Vector3 from '../../../libs/math/Uint8Vector3';
import VertexBuffer from '../../../libs/renderer/graphics/buffer/VertexBuffer';
import Render from '../../../libs/renderer/graphics/Render';

export default class BoxObjectBuffer extends VertexBuffer {
    constructor(bevel = 0) {
        super();
        this.primitive = Render.primitive.triangles;
        this.bevel = bevel;
        this.colorLength = 3;
    }

    generate(boxes) {
        const bevel = this.bevel;
        const positionBuffer = [];
        const normalBuffer = [];
        const colorBuffer = [];
        const indexBuffer = [];
        let offset = 0;
        for (const [position, color] of boxes) {
            int8Vector3.hex = position;
            colorVector.hex = color;
            const frontObstruct = boxes.has(position + 1);
            const backObstruct = boxes.has(position - 1);
            const leftObstruct = boxes.has(position + 65536);
            const rightObstruct = boxes.has(position - 65536);
            const bottomObstruct = boxes.has(position + 256);
            const topObstruct = boxes.has(position - 256);
            if (!frontObstruct
                || !backObstruct
                || !leftObstruct
                || !rightObstruct
                || !bottomObstruct
                || !topObstruct) {
                createBox(int8Vector3, colorVector);
            }
        }

        this.position = positionBuffer;
        this.normal = normalBuffer;
        this.color = colorBuffer;
        this.arrayBuffer.interleaved = true;
        console.log(this.color);
        this.index = indexBuffer;

        function createBox(position, color) {
            const x = position[0],
                y = position[1],
                z = position[2];
            if (bevel) {
                positionBuffer.push(
                    //near
                    x + bevel, y + bevel, z,
                    x + bevel, y + 1 - bevel, z,
                    x + 1 - bevel, y + 1 - bevel, z,
                    x + 1 - bevel, y + bevel, z,
                    //near top
                    x + bevel, y + 1 - bevel, z,
                    x + bevel, y + 1, z + bevel,
                    x + 1 - bevel, y + 1, z + bevel,
                    x + 1 - bevel, y + 1 - bevel, z,
                    //near top triangle
                    x + 1 - bevel, y + 1 - bevel, z,
                    x + 1 - bevel, y + 1, z + bevel,
                    x + 1, y + 1 - bevel, z + bevel,
                    //near right
                    x + 1 - bevel, y + bevel, z,
                    x + 1 - bevel, y + 1 - bevel, z,
                    x + 1, y + 1 - bevel, z + bevel,
                    x + 1, y + bevel, z + bevel,
                    //near bottom triangle
                    x + 1 - bevel, y, z + bevel,
                    x + 1 - bevel, y + bevel, z,
                    x + 1, y + bevel, z + bevel,
                    //near bottom
                    x + bevel, y, z + bevel,
                    x + bevel, y + bevel, z,
                    x + 1 - bevel, y + bevel, z,
                    x + 1 - bevel, y, z + bevel,

                    //right
                    x + 1, y + bevel, z + bevel,
                    x + 1, y + 1 - bevel, z + bevel,
                    x + 1, y + 1 - bevel, z + 1 - bevel,
                    x + 1, y + bevel, z + 1 - bevel,
                    //right top
                    x + 1, y + 1 - bevel, z + bevel,
                    x + 1 - bevel, y + 1, z + bevel,
                    x + 1 - bevel, y + 1, z + 1 - bevel,
                    x + 1, y + 1 - bevel, z + 1 - bevel,
                    //right top triangle
                    x + 1, y + 1 - bevel, z + 1 - bevel,
                    x + 1 - bevel, y + 1, z + 1 - bevel,
                    x + 1 - bevel, y + 1 - bevel, z + 1,
                    //right right
                    x + 1, y + bevel, z + 1 - bevel,
                    x + 1, y + 1 - bevel, z + 1 - bevel,
                    x + 1 - bevel, y + 1 - bevel, z + 1,
                    x + 1 - bevel, y + bevel, z + 1,
                    //right bottom triangle
                    x + 1 - bevel, y, z + 1 - bevel,
                    x + 1, y + bevel, z + 1 - bevel,
                    x + 1 - bevel, y + bevel, z + 1,
                    //right bottom
                    x + 1 - bevel, y, z + bevel,
                    x + 1, y + bevel, z + bevel,
                    x + 1, y + bevel, z + 1 - bevel,
                    x + 1 - bevel, y, z + 1 - bevel,

                    //top
                    x + 1 - bevel, y + 1, z + 1 - bevel,
                    x + 1 - bevel, y + 1, z + bevel,
                    x + bevel, y + 1, z + bevel,
                    x + bevel, y + 1, z + 1 - bevel,

                    //far
                    x + 1 - bevel, y + bevel, z + 1,
                    x + 1 - bevel, y + 1 - bevel, z + 1,
                    x + bevel, y + 1 - bevel, z + 1,
                    x + bevel, y + bevel, z + 1,
                    //far top
                    x + 1 - bevel, y + 1 - bevel, z + 1,
                    x + 1 - bevel, y + 1, z + 1 - bevel,
                    x + bevel, y + 1, z + 1 - bevel,
                    x + bevel, y + 1 - bevel, z + 1,
                    //far top triangle
                    x + bevel, y + 1 - bevel, z + 1,
                    x + bevel, y + 1, z + 1 - bevel,
                    x, y + 1 - bevel, z + 1 - bevel,
                    //far right
                    x + bevel, y + bevel, z + 1,
                    x + bevel, y + 1 - bevel, z + 1,
                    x, y + 1 - bevel, z + 1 - bevel,
                    x, y + bevel, z + 1 - bevel,
                    //far bottom triangle
                    x + bevel, y, z + 1 - bevel,
                    x + bevel, y + bevel, z + 1,
                    x, y + bevel, z + 1 - bevel,
                    //far bottom
                    x + 1 - bevel, y, z + 1 - bevel,
                    x + 1 - bevel, y + bevel, z + 1,
                    x + bevel, y + bevel, z + 1,
                    x + bevel, y, z + 1 - bevel,

                    //left
                    x, y + bevel, z + 1 - bevel,
                    x, y + 1 - bevel, z + 1 - bevel,
                    x, y + 1 - bevel, z + bevel,
                    x, y + bevel, z + bevel,
                    //left top
                    x, y + 1 - bevel, z + 1 - bevel,
                    x + bevel, y + 1, z + 1 - bevel,
                    x + bevel, y + 1, z + bevel,
                    x, y + 1 - bevel, z + bevel,
                    //left top triangle
                    x, y + 1 - bevel, z + bevel,
                    x + bevel, y + 1, z + bevel,
                    x + bevel, y + 1 - bevel, z,
                    //left right
                    x, y + bevel, z + bevel,
                    x, y + 1 - bevel, z + bevel,
                    x + bevel, y + 1 - bevel, z,
                    x + bevel, y + bevel, z,
                    //left bottom triangle
                    x + bevel, y, z + bevel,
                    x, y + bevel, z + bevel,
                    x + bevel, y + bevel, z,
                    //left bottom
                    x + bevel, y, z + 1 - bevel,
                    x, y + bevel, z + 1 - bevel,
                    x, y + bevel, z + bevel,
                    x + bevel, y, z + bevel,

                    //bottom
                    x + bevel, y, z + 1 - bevel,
                    x + bevel, y, z + bevel,
                    x + 1 - bevel, y, z + bevel,
                    x + 1 - bevel, y, z + 1 - bevel,
                );

                normalBuffer.push(
                    0, 0, -1,
                    0, 0, -1,
                    0, 0, -1,
                    0, 0, -1,
                    0, 0.7071067690849304,
                    -0.7071067690849304, 0, 0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0.7071067690849304,
                    -0.7071067690849304,
                    0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0,
                    1,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    0,
                    0.7071067690849304,
                    0.7071067690849304,
                    -0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    0.5773502588272095,
                    -0.7071067690849304,
                    0,
                    0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0.7071067690849304,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    -1,
                    0,
                    0,
                    -1,
                    0,
                    0,
                    -1,
                    0,
                    0,
                    -1,
                    0,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    0.7071067690849304,
                    0,
                    -0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    0.5773502588272095,
                    -0.5773502588272095,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    -0.5773502588272095,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    -0.7071067690849304,
                    -0.7071067690849304,
                    0,
                    0,
                    -1,
                    0,
                    0,
                    -1,
                    0,
                    0,
                    -1,
                    0,
                    0,
                    -1,
                    0
                );

                colorBuffer.push(
                    //near
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //near top
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //near top triangle
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //near right
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //near bottom triangle
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //near bottom
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    //right
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //right top
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //right top triangle
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //right right
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //right bottom triangle
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //right bottom
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    //top
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    //far
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //far top
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //far top triangle
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //far right
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //far bottom triangle
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //far bottom
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    //left
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //left top
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //left top triangle
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //left right
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //left bottom triangle
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    //left bottom
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    //bottom
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                );

                indexBuffer.push(
                    offset + 0, offset + 1, offset + 2, offset + 2, offset + 3, offset + 0,//near
                    offset + 4, offset + 5, offset + 6, offset + 6, offset + 7, offset + 4,//near top
                    offset + 8, offset + 9, offset + 10,//near top triangle
                    offset + 11, offset + 12, offset + 13, offset + 13, offset + 14, offset + 11,//near right
                    offset + 15, offset + 16, offset + 17,//near bottom triangle
                    offset + 18, offset + 19, offset + 20, offset + 20, offset + 21, offset + 18,//near top bottom

                    offset + 22, offset + 23, offset + 24, offset + 24, offset + 25, offset + 22,//right
                    offset + 26, offset + 27, offset + 28, offset + 28, offset + 29, offset + 26,//right top
                    offset + 30, offset + 31, offset + 32,//right top triangle
                    offset + 33, offset + 34, offset + 35, offset + 35, offset + 36, offset + 33,//right right
                    offset + 37, offset + 38, offset + 39,//right bottom triangle
                    offset + 40, offset + 41, offset + 42, offset + 42, offset + 43, offset + 40,//right bottom

                    offset + 44, offset + 45, offset + 46, offset + 46, offset + 47, offset + 44,//top

                    offset + 48, offset + 49, offset + 50, offset + 50, offset + 51, offset + 48,//far
                    offset + 52, offset + 53, offset + 54, offset + 54, offset + 55, offset + 52,//far top
                    offset + 56, offset + 57, offset + 58,//far top triangle
                    offset + 59, offset + 60, offset + 61, offset + 61, offset + 62, offset + 59,//far right
                    offset + 63, offset + 64, offset + 65,//far bottom triangle
                    offset + 66, offset + 67, offset + 68, offset + 68, offset + 69, offset + 66,//far bottom

                    offset + 70, offset + 71, offset + 72, offset + 72, offset + 73, offset + 70,//left
                    offset + 74, offset + 75, offset + 76, offset + 76, offset + 77, offset + 74,//left top
                    offset + 78, offset + 79, offset + 80,//left top triangle
                    offset + 81, offset + 82, offset + 83, offset + 83, offset + 84, offset + 81,//left right
                    offset + 85, offset + 86, offset + 87,//left bottom triangle
                    offset + 88, offset + 89, offset + 90, offset + 90, offset + 91, offset + 88,//left bottom

                    offset + 92, offset + 93, offset + 94, offset + 94, offset + 95, offset + 92//top
                );
                offset += 96;
            } else {
                positionBuffer.push(
                    x, y, z,//near
                    x, y + 1, z,
                    x + 1, y + 1, z,
                    x + 1, y, z,

                    x + 1, y, z,//right
                    x + 1, y + 1, z,
                    x + 1, y + 1, z + 1,
                    x + 1, y, z + 1,

                    x + 1, y, z + 1,//far
                    x + 1, y + 1, z + 1,
                    x, y + 1, z + 1,
                    x, y, z + 1,

                    x + 1, y + 1, z + 1,//top
                    x + 1, y + 1, z,
                    x, y + 1, z,
                    x, y + 1, z + 1,

                    x, y, z + 1,//left
                    x, y + 1, z + 1,
                    x, y + 1, z,
                    x, y, z,

                    x, y, z + 1,//bottom
                    x, y, z,
                    x + 1, y, z,
                    x + 1, y, z + 1);
                colorBuffer.push(
                    color[0], color[1], color[2],//near
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    color[0], color[1], color[2],//right
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    color[0], color[1], color[2],//far
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    color[0], color[1], color[2],//top
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    color[0], color[1], color[2],//left
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],

                    color[0], color[1], color[2],//bottom
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                    color[0], color[1], color[2],
                );
                normalBuffer.push(
                    0, 0, -1,//near
                    0, 0, -1,
                    0, 0, -1,
                    0, 0, -1,

                    1, 0, 0,//right
                    1, 0, 0,
                    1, 0, 0,
                    1, 0, 0,

                    0, 0, 1,//far
                    0, 0, 1,
                    0, 0, 1,
                    0, 0, 1,

                    0, 1, 0,//top
                    0, 1, 0,
                    0, 1, 0,
                    0, 1, 0,

                    -1, 0, 0,//left
                    -1, 0, 0,
                    -1, 0, 0,
                    -1, 0, 0,

                    0, -1, 0,//bottom
                    0, -1, 0,
                    0, -1, 0,
                    0, -1, 0,
                );
                indexBuffer.push(
                    offset + 0, offset + 1, offset + 2, offset + 2, offset + 3, offset + 0,//near
                    offset + 4, offset + 5, offset + 6, offset + 6, offset + 7, offset + 4,//right
                    offset + 8, offset + 9, offset + 10, offset + 10, offset + 11, offset + 8,//far
                    offset + 12, offset + 13, offset + 14, offset + 14, offset + 15, offset + 12,//top
                    offset + 16, offset + 17, offset + 18, offset + 18, offset + 19, offset + 16,//left
                    offset + 20, offset + 21, offset + 22, offset + 22, offset + 23, offset + 20//bottom
                );
                offset += 24;
            }
        }
    }
}
const int8Vector3 = new Int8Vector3();
const uint8Vector3 = new Uint8Vector3();
const colorVector = new Color();