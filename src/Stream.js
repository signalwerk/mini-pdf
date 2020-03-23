class Stream {
  constructor(content) {
    this.content = content || "";
  }

  toString() {
    let output = [];
    output.push(`  << /Length ${this.content.length} >>`);
    output.push(`stream`);
    output.push(`${this.content}`);
    output.push(`endstream`);

    return output.join("\n");
  }
}

export default Stream;
