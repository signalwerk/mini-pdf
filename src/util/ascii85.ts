/** Encode bytes using the PDF-compatible Adobe ASCII85 alphabet. */
export const ascii85Encode = (data: Uint8Array): string => {
  const output: Array<string> = [];

  for (let offset = 0; offset < data.length; offset += 4) {
    const byteCount = Math.min(4, data.length - offset);
    let value = 0;

    for (let index = 0; index < 4; index += 1) {
      value = value * 256 + (index < byteCount ? data[offset + index] : 0);
    }

    if (byteCount === 4 && value === 0) {
      output.push("z");
      continue;
    }

    const encoded = new Array<string>(5);
    for (let index = 4; index >= 0; index -= 1) {
      encoded[index] = String.fromCharCode((value % 85) + 33);
      value = Math.floor(value / 85);
    }

    output.push(encoded.slice(0, byteCount + 1).join(""));
  }

  return output.join("");
};
