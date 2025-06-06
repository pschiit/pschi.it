import Node from './Node';

export default class App extends Node{
    /** Create a new app 
    */
    constructor(canvas) {
        super();
        this.canvas = canvas;
    }

    run() {

    }

    stop() {
        this.canvas.context?.dispatchCallback(this.canvas.context.removeChild);
    }
}