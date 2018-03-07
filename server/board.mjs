/* eslint-disable no-underscore-dangle */
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
    if (!Object.hasOwnProperty.call(this.data.elements, data.uuid)) {
      this.data.elements[data.uuid] = {
        state: data.state,
        type: data.type,
      };
    } else {
      Object.assign(this.data.elements[data.uuid].state, data.state);
      this.data.elements[data.uuid].type = data.type;
    }
  }
}
