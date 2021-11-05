export const pathsToStrings = (pathsArray, start, end) =>
  pathsArray.slice(start, end).join('/');

export const stringToPaths = (pathname) => {
  if (pathname[0] === '/') pathname = pathname.slice(1);
  const pathsArray = pathname.split('/');
  const stringJoin = (start, end) => pathsToStrings(pathsArray, start, end);
  return {
    ...pathsArray,
    stringJoin,
    menuString: stringJoin(1, 3),
    subPageString: stringJoin(1, 4),
  };
};
