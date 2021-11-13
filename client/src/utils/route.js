export const pathsToStrings = (pathsArray, start, end) => {
  const nonEmptyPathsArray = pathsArray.filter((p) => p);
  return nonEmptyPathsArray?.slice(start, end).join('/');
};

export const stringToPaths = (pathname) => {
  if (pathname[0] === '/') pathname = pathname.slice(1);
  const pathsArray = pathname.split('/');
  return pathsArray;
};
