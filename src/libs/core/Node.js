export default class Node {
    /** Create a new Node
    */
    constructor() {
        this.id = generateId();
        this.name = null;
        this.parent = null;
        this.childrens = [];
        this.listeners = {};
        this.parameters = {};
    }

    get root() {
        return this.parent ? this.parent.root : this;
    }

    getParameter(name) {
        return this.parameters[name];
    }

    setParameter(name, value) {
        if (!this.parameters[name] || this.parameters[name] != value) {
            this.parameters[name] = value;
        }
    }

    /** Append a child Node to the current Node
     * and update the child's parent to the new current Node
     * @param {Node} child the Node to append 
     * @return {Number|Number[]} the index(es) of the child Node
    */
    appendChild(child) {
        if (arguments.length > 1) {
            return Node.repeatFunction(arguments, this.appendChild.bind(this));
        }
        if (!(child instanceof Node)) {
            throw new Error(`${child.constructor.name} can't be child of ${this.constructor.name}.`);
        }
        if (this === child) {
            throw new Error(`Node ${child.id} can't be his own child.`);
        }
        if (child.parent) {
            child.parent.removeChild(child);
        }

        child.parent = this;
        const index = this.childrens.push(child) - 1;
        this.dispatchEvent({ type: Node.event.nodeInserted, inserted: child, index: index });

        return index;
    }

    /** Remove a child Node to the current Node
     * and remove the child's parent
     * @param {Node} child the node to remove to 
     * @return {Node|Node[]} the removed Node(s)
    */
    removeChild(child) {
        if (arguments.length > 1) {
            return Node.repeatFunction(arguments, this.removeChild.bind(this));
        }
        const index = this.childrens.indexOf(child);
        if (index === -1) {
            throw new Error(`Node ${child.id} not found.`);
        }

        child.parent = null;
        this.childrens.splice(index, 1);
        this.dispatchEvent({ type: Node.event.nodeRemoved, removed: child, index: index });

        return this;
    }

    /** Registers an event handler of a specific event type on the current Node
     * @param {string} type the type of event for which to add an event listener
     * @param {Function} listener event listener to be added
     * @return {Node} the current Node
    */
    addEventListener(type, listener) {
        if (this.listeners[type] === undefined) {
            this.listeners[type] = [];
        }
        if (this.listeners[type].indexOf(listener) === - 1) {
            this.listeners[type].push(listener);
        }

        return this;
    }

    /** Removes an event listener from the current Node
     * @param {string} type the type of event for which to remove an event listener
     * @param {Function} listener the event listener to be removed
     * @return {Node} the current Node
    */
    removeEventListener(type, listener) {
        if (this.listeners[type] !== undefined) {
            const index = this.listeners[type].indexOf(listener);
            if (index !== -1) {
                this.listeners[type].splice(index, 1);
                return this;
            }
        }
        throw new Error(`Listener ${type} ${listener} not found on Node ${this.id}.`);
    }

    /** Dispatches an event to the current Node
     * the event will carry the current Node as target
     * @param {Object} event the object to dispatch
     * @return {Node} the current Node
    */
    dispatchEvent(event) {
        if (this.listeners[event.type] !== undefined) {
            event.target = this;

            // Make a copy, in case listeners are removed while iterating.
            const listeners = this.listeners[event.type].slice(0);
            for (let i = 0, l = listeners.length; i < l; i++) {
                listeners[i].call(this, event);
            }
        }

        return this;
    }

    /** Dispatches a function to the current Node
     * the function will have the current node has parameters
     * @param {Function} callback the function to dispatch
     * @param {Boolean} toChildrens whether to dispatch to this node or not
     * @param {Boolean} toChildrens whether to dispatch to chidlrens or not
     * @return {Node} the current Node
    */
    dispatchCallback(callback, toNode = true, toChildrens = true) {
        if(toNode){
            callback(this);
        }
        if (toChildrens) {
            this.childrens.forEach(c => {
                c.dispatchCallback(callback, toChildrens);
            });
        }

        return this;
    }

    /** Clone the current Node
     * @return {Node} the copy Node
    */
    clone() {
        const clone = new this.constructor();
        Object.assign(clone, JSON.parse(this.JSON));

        return clone;
    }

    /** Convert the current Node to JSON
     * @return {string} the stringify JSON version of the current Node
    */
    get JSON() {
        return JSON.stringify(this);
    }

    static repeatFunction(args, fn) {
        const result = new Array(args.length);
        for (let i = 0; i < args.length; i++) {
            result[i] = fn(args[i]);
        }

        return result;
    }

    /** List of event for the Node class
    */
    static event = {
        nodeInserted: 'node-inserted',
        nodeRemoved: 'node-removed',
    }
}

const hex = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '0a', '0b', '0c', '0d', '0e', '0f', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '1a', '1b', '1c', '1d', '1e', '1f', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '2a', '2b', '2c', '2d', '2e', '2f', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '3a', '3b', '3c', '3d', '3e', '3f', '40', '41', '42', '43', '44', '45', '46', '47', '48', '49', '4a', '4b', '4c', '4d', '4e', '4f', '50', '51', '52', '53', '54', '55', '56', '57', '58', '59', '5a', '5b', '5c', '5d', '5e', '5f', '60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '6a', '6b', '6c', '6d', '6e', '6f', '70', '71', '72', '73', '74', '75', '76', '77', '78', '79', '7a', '7b', '7c', '7d', '7e', '7f', '80', '81', '82', '83', '84', '85', '86', '87', '88', '89', '8a', '8b', '8c', '8d', '8e', '8f', '90', '91', '92', '93', '94', '95', '96', '97', '98', '99', '9a', '9b', '9c', '9d', '9e', '9f', 'a0', 'a1', 'a2', 'a3', 'a4', 'a5', 'a6', 'a7', 'a8', 'a9', 'aa', 'ab', 'ac', 'ad', 'ae', 'af', 'b0', 'b1', 'b2', 'b3', 'b4', 'b5', 'b6', 'b7', 'b8', 'b9', 'ba', 'bb', 'bc', 'bd', 'be', 'bf', 'c0', 'c1', 'c2', 'c3', 'c4', 'c5', 'c6', 'c7', 'c8', 'c9', 'ca', 'cb', 'cc', 'cd', 'ce', 'cf', 'd0', 'd1', 'd2', 'd3', 'd4', 'd5', 'd6', 'd7', 'd8', 'd9', 'da', 'db', 'dc', 'dd', 'de', 'df', 'e0', 'e1', 'e2', 'e3', 'e4', 'e5', 'e6', 'e7', 'e8', 'e9', 'ea', 'eb', 'ec', 'ed', 'ee', 'ef', 'f0', 'f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8', 'f9', 'fa', 'fb', 'fc', 'fd', 'fe', 'ff'];
function generateId() {
    var d = new Date().getTime();//Timestamp
    var d2 = ((typeof performance !== 'undefined') && performance.now && (performance.now() * 1000)) || 0;//Time in microseconds since page-load or 0 if unsupported
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16;//random number between 0 and 16
        if (d > 0) {//Use timestamp until depleted
            r = (d + r) % 16 | 0;
            d = Math.floor(d / 16);
        } else {//Use microseconds since page-load if supported
            r = (d2 + r) % 16 | 0;
            d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}