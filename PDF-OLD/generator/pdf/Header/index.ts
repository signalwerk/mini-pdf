export const magicNumberHeader = "%¥±ë";

export const Header = (major = 1, minor = 3) => {
  return `%PDF-${major}.${minor}\n${magicNumberHeader}\n\n`;
};
