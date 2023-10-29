module.exports = class {
  constructor(data) {
    this.id = data.folder_id;
    this.name = data.folder_name;
    this.owner = data.owner;
    this.children = [];
  }

  addChild(file) {
    this.children.concat(file);
  }
};
