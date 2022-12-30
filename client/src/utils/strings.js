export function fromSlug(str) {
  const string = `${str.replaceAll('-', ' ')}`;
  return string.slice(0, 1).toUpperCase() + string.slice(1);
}
