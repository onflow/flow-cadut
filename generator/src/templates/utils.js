export const each = (array, mapper) => {
  return array.map(mapper).join("\n");
};