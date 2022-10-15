import { Writer } from "./writer/";

const MiniPdf = {
  Writer,
};

// export const TEST = async () => {
//   const { promises: fs } = require("fs");

//   const jpegPath = "./data-in/test.jpg";

//   // const fs = require('fs');

//   // fs.readFile("./data-in/test.jpg", function (err, data) {
//   //   if (err) throw err;
//   //   // console.log(data.toString());
//   //   console.log(data);
//   // });

//   let buffer = await fs.readFile(jpegPath);

//   return { meta: readMeta(buffer) };
// };

export default MiniPdf;
export { Writer };
