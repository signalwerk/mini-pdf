// Comment containing at least 4 high bit characters. This example has 6.
const magicNumberHeader = "%¥±ë";

class Header {
  constructor(major, minor) {
    this.major = major || 1;
    this.minor = minor || 1;
  }

  toString() {
    return `%PDF-${this.major}.${this.minor}\n${magicNumberHeader}\n\n`;
  }
}

export default Header;
