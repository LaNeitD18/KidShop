import { Layout, Menu } from 'antd'
import { useEffect, useState } from 'react'
import classNames from 'classnames'
import { useResponsive } from '../components/Media'
import { UserOutlined } from '@ant-design/icons'
import { IoLogOutOutline, IoCloseSharp } from 'react-icons/io5'
import { FiMenu } from 'react-icons/fi'
import { AiOutlineApartment, AiOutlineDashboard } from 'react-icons/ai'
import { GrGroup } from 'react-icons/gr'
import { RiPencilRuler2Line } from 'react-icons/ri'
import { getArrayItemByRoute, routeObject } from '../utils/object'
import { makePath } from '../utils/string'

const { SubMenu } = Menu
const { Header, Content, Sider } = Layout

const NAV_ITEMS = [
  {
    route: 'admin',
    name: 'Quản trị',
    menu: [
      {
        route: 'employee',
        icon: <UserOutlined />,
        name: 'Nhân viên',
        submenu: [
          {
            route: 'list',
            name: 'Danh sách',
          },
          {
            route: 'create',
            name: 'Tạo nhân viên',
          },
        ],
      },
      {
        route: 'branch',
        icon: <AiOutlineApartment />,
        name: 'Các chi nhánh',
        submenu: [
          {
            route: 'list',
            name: 'Danh sách',
          },
          {
            route: 'create',
            name: 'Tạo chi nhánh',
          },
        ],
      },
      {
        route: 'group',
        icon: <GrGroup />,
        name: 'Nhóm quyền',
        submenu: [
          {
            route: 'list',
            name: 'Danh sách',
          },
          {
            route: 'create',
            name: 'Tạo nhóm quyền',
          },
        ],
      },
      {
        route: 'config',
        icon: <RiPencilRuler2Line />,
        name: 'Cấu hình',
      },
    ],
  },
  {
    route: 'business',
    name: 'Kinh doanh',
  },
  {
    route: 'store',
    name: 'Cửa hàng',
  },
  {
    route: 'pos',
    name: 'Bán hàng',
  },
  {
    route: 'supply',
    name: 'Nguồn hàng',
  },
  {
    route: 'warehouse',
    name: 'Kho',
  },
]

export default function MainContainer({ children, route }) {
  const media = useResponsive()
  const [isOpenSider, setIsOpenSider] = useState(true)
  const isSiderCollapsed = !isOpenSider && !media.isLg
  const { navRoute, menuRoute, subMenuRoute } = routeObject(route)
  console.log(routeObject(route))
  // TODO nav & menu items by role
  const navItems = NAV_ITEMS
  const menuItem = getArrayItemByRoute(navItems, navRoute).menu

  useEffect(() => {
    if (media.isLg) {
      setIsOpenSider(false)
    }
  }, [media.isLg])

  return (
    <Layout className="select-none">
      <Header className="flex fixed z-10 items-center min-h-nav-height w-full">
        {isSiderCollapsed ? (
          <FiMenu
            onClick={() => setIsOpenSider(true)}
            className="text-white mr-4 block lg:hidden opacity-75 -ml-5 p-1 cursor-pointer"
            style={{ color: 'white' }}
            size={32}
          />
        ) : (
          <IoCloseSharp
            onClick={() => setIsOpenSider(false)}
            className="text-white mr-4 block lg:hidden opacity-75 -ml-5 p-1 cursor-pointer"
            size={32}
          />
        )}

        <span className="text-white font-logo hidden xs:inline text-md sm:text-xl md:text-2xl lg:text-3xl mr-4 whitespace-nowrap">
          KidsShop
        </span>
        <Menu
          theme="dark"
          mode="horizontal"
          className="w-full -mr-6 font-semibold"
          defaultSelectedKeys={[navRoute]}
          onSelect
        >
          {navItems.map((navItem) => (
            <Menu.Item key={navItem.route}>{navItem.name}</Menu.Item>
          ))}
          <Menu.Item key="logout" className="lg:pointer-events-none">
            {!media.isLg && 'Đăng xuất'}
          </Menu.Item>
        </Menu>
        <div className="hidden lg:flex text-white items-center gap-2 min-w-max cursor-pointer">
          <IoLogOutOutline size={18} />
          Đăng xuất
        </div>
      </Header>
      <Layout className="">
        <Sider
          collapsedWidth="0"
          collapsible
          theme="light"
          collapsed={isSiderCollapsed}
          width={256}
          className="pt-nav-height h-screen left-0 overflow-x-hidden overflow-y-auto"
          style={{
            position: 'fixed',
          }}
        >
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            defaultSelectedKeys={[subMenuRoute || menuRoute || navRoute]}
            defaultOpenKeys={[menuRoute || navRoute]}
          >
            <Menu.Item icon={<AiOutlineDashboard />} key={navRoute}>
              Bảng điều khiển
            </Menu.Item>
            <Menu.Divider />
            {menuItem.map((menu) =>
              menu?.submenu ? (
                <SubMenu
                  key={makePath(navRoute, menu.route)}
                  icon={menu.icon}
                  title={menu.name}
                >
                  {menu.submenu.map((submenu) => (
                    <Menu.Item
                      key={makePath(navRoute, menu.route, submenu.route)}
                    >
                      {submenu.name}
                    </Menu.Item>
                  ))}
                </SubMenu>
              ) : (
                <Menu.Item
                  icon={menu.icon}
                  key={makePath(navRoute, menu.route)}
                >
                  {menu.name}
                </Menu.Item>
              )
            )}
          </Menu>
        </Sider>
        <Layout
          className={classNames(
            { 'ml-slider-width': !isSiderCollapsed },
            'p-4 xs:p-6 mt-nav-height'
          )}
        >
          <Content className="site-layout-background select-text">
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
