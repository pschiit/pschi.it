import Buffer from '../../core/Buffer';

export default class VertexBufferManager {
    constructor() {
        this.buffer = new Buffer();
        this.instanceBuffer = new Buffer();
        this.instanceBuffer.interleaved = true;
        this.instanceBuffer.usage = Buffer.usage.stream;
        this.indexBuffer = new Buffer();
    }

    add(vertexBuffer) {
        const buffers = vertexBuffer.arrayBuffer;
        if (buffers && buffers.parent != this.buffer) {
            this.buffer.appendChild(buffers);
        }
        const index = vertexBuffer.index;
        if (index && index.parent != this.indexBuffer) {
            this.indexBuffer.appendChild(index);
        }
        const instanceBuffers = vertexBuffer.instanceArrayBuffer;
        // if (instanceBuffers && instanceBuffers.parent != this.instanceBuffer) {
        //     this.instanceBuffer.appendChild(instanceBuffers);
        // }
    }
}