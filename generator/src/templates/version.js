export default (props) => {
  const { version } = props;
  return `
export const VERSION = ${version}
  `;
};
