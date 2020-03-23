class Obj {
  constructor(id, content, writer) {
    this.id = id || 0;
    this.generation = 0;
    this.content = content || "";
    this.writer = writer;
  }

  toString() {
    let output = [];
    output.push(`${this.id} ${this.generation} obj`);
    output.push(`${this.content}`);
    output.push(`endobj`);
    output.push(`\n`);
    return output.join("\n");
  }
}

export default Obj;
