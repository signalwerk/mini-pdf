export const magicNumberHeader = "%¥±ë";

export const Header = (major: number = 1, minor: number = 3) => {
  return `%PDF-${major}.${minor}\n${magicNumberHeader}\n\n`;
};
