export default class Board {

    constructor(data) {
        this.data = data;
    }

    getId() {
        return this.data._id;
    }

    getName() {
        return this.data.name;
    }

    getCreatedTime() {
        return this.data.created;
    }

    getLastUsedTime() {
        return this.data.lastUsed;
    }

    serialize() {
        return this.data;
    }

    applyElementUpdate(data) {
        Object.assign(this.data.elements, data);
    }

}