export function escapeHtml(unsafe: string): string {
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function style(obj): string {
  return Object.entries(obj)
    .map(
      ([key, value]) =>
        `${key.replace(/([A-Z])/g, (g) => `-${g[0].toLowerCase()}`)}:${value}`
    )
    .join(";");
}

// convert a js object like :
// const obj = {
//   tag: 'p',
//   children: [
//     'test',
//     {
//       tag: 'li',
//       children: ['item'],
//     },
//   ],
// }

// to a string:
// const html = `<p>test<li>item</li></p>`

type Obj2htmlPrefs = {
  level?: number;
  pretty?: boolean;
};

export function obj2html(obj, prefs?: Obj2htmlPrefs): string {
  if (!obj) {
    return "";
  }

  const options = prefs || {};
  const pretty = options.pretty || false;
  const level = options.level || 0;

  const childOptions = {
    ...options,
    level: level + 1,
  };

  const formatter = {
    start: "",
    end: "",
    startNL: "",
    endNL: "",
  };

  if (pretty) {
    formatter.start = "  ".repeat(level);
    formatter.end = "  ".repeat(level);
    formatter.startNL = "\n";
    formatter.endNL = level > 0 ? "\n" : "";
  }

  // value
  if (typeof obj === "string") {
    return `${formatter.startNL}${formatter.start}${escapeHtml(obj)}`;
  }

  // array
  if (Array.isArray(obj)) {
    return obj.map((item) => obj2html(item, options)).join("");
  }

  // attribute handling
  const attr = [
    ...Object.entries(obj.attr || {}).map(([key, value]) => {
      if (value) {
        return `${key}="${key === "style" ? style(value) : value}"`;
      }
      return null;
    }),
  ]
    .filter((item) => !!item)
    .join(" ");

  // has children
  if (obj.children) {
    return `${formatter.endNL}${formatter.start}<${[obj.tag, attr].join(
      " "
    )}>${obj2html(obj.children, childOptions)}${formatter.startNL}${
      formatter.end
    }</${obj.tag}>`;
  }

  return `${formatter.endNL}${formatter.start}<${[obj.tag, attr].join(" ")}/>`;
}
