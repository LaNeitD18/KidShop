export const getArrayItemByRoute = (array, route) => {
  return array.find((ele) => ele.route === route)
}

export const routeObject = (routeString) => {
  const routes = routeString.split('/')
  const navRoute = routes[0]
  const menuRoute = routes.slice(0, 2).join('/')
  const subMenuRoute = routes.slice(0, 3).join('/')
  return {
    navRoute,
    menuRoute: navRoute === menuRoute ? null : menuRoute,
    subMenuRoute: menuRoute === subMenuRoute ? null : subMenuRoute,
  }
}
