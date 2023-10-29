module.exports = class {
    constructor(data) {
      this.id = data.note_id;
      this.name = data.name;
      this.sub_name = data.sub_name;
      this.owner = data.owner;
      this.last_save = data.last_save;
      this.file_path = data.file_path;
      this.images = []
    }
  
  };