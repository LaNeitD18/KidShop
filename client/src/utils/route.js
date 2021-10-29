import appRoute from '../constants/appRoute';
import { getByKey } from './get';

export const getUserRoute = (group) => appRoute;

export const routingObjects = (pathString) => {
  const routes = pathString.split('/');
  const navPath = routes[0];
  const menuPath = routes.slice(0, 2).join('/');
  const navObject = getByKey(appRoute, navPath);
  const menuObject = getByKey(navObject?.menu, routes[1]);
  const subObject = getByKey(menuObject?.sub, routes[2]);
  return {
    navPath,
    menuPath,
    navObject,
    menuObject,
    subObject,
  };
};

export const makePath = (...stringArr) => {
  const nonEmtpyStrings = stringArr.filter((s) => s);
  return nonEmtpyStrings.join('/');
};
