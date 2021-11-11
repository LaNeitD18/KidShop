export const pathsToStrings = (pathsArray, start, end) =>
  pathsArray.slice(start, end).join('/');

export const stringToPaths = (pathname) => {
  if (pathname[0] === '/') pathname = pathname.slice(1);
  const pathsArray = pathname.split('/');
  return pathsArray;
  if (pathname[0] === '/') pathname = pathname.slice(1);
  // const pathsArray = pathname.split('/');
  return pathsArray;
};
