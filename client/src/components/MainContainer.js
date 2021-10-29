import { cloneElement, useEffect, useState } from 'react'
import classNames from 'classnames'
import { useResponsive } from '../components/Media'
import { Breadcrumb, Divider, Layout, Menu, Typography } from 'antd'
import { IoLogOutOutline, IoCloseSharp } from 'react-icons/io5'
import { FiMenu } from 'react-icons/fi'
import { AiOutlineDashboard } from 'react-icons/ai'
import { getUserRoute, makePath, routingObjects } from '../utils/route'

const { Header, Content, Sider } = Layout
const { Title } = Typography

export default function MainContainer({ children, path, className }) {
  const media = useResponsive()
  const [isOpenSider, setIsOpenSider] = useState(false)
  const isSiderCollapsed = !isOpenSider && !media.isLg
  const userRoute = getUserRoute()
  const { navPath, menuPath, navObject, menuObject } = routingObjects(path)

  useEffect(() => {
    if (media.isLg) {
      setIsOpenSider(false)
    }
  }, [media.isLg])

  return (
    <Layout className="select-none">
      <Header className="flex fixed z-20 items-center min-h-nav-height w-full">
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

        <span className="text-white font-logo hidden cursor-pointer xs:inline text-md sm:text-xl md:text-2xl lg:text-3xl mr-4 whitespace-nowrap">
          KidsShop
        </span>
        <Menu
          theme="dark"
          mode="horizontal"
          className="w-full -mr-6 font-semibold"
          defaultSelectedKeys={[navPath]}
          onSelect
        >
          {userRoute.map((nav) => (
            <Menu.Item key={nav.key}>{nav.name}</Menu.Item>
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
      <Layout>
        <Sider
          collapsedWidth="0"
          collapsible
          theme="light"
          collapsed={isSiderCollapsed}
          width={256}
          className="pt-nav-height h-screen left-0 overflow-x-hidden overflow-y-auto z-10"
          style={{
            position: 'fixed',
          }}
        >
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            defaultSelectedKeys={[menuPath]}
          >
            <div className="w-full flex-col items-center text-center my-5 pr-1">
              {cloneElement(navObject.icon, {
                className: 'text-3xl w-full mb-1',
              })}
              <Title level={4}>{navObject.name}</Title>
            </div>
            <Menu.Divider />
            <Menu.Item
              icon={<AiOutlineDashboard />}
              key={makePath(navPath, 'dashboard')}
            >
              Bảng điều khiển
            </Menu.Item>
            {navObject.menu.map((menu) => (
              <Menu.Item icon={menu.icon} key={makePath(navPath, menu.key)}>
                {menu.name}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout
          className={classNames('p-4 pt-3 xs:p-6 xs:pt-5 mt-nav-height', {
            'ml-sider-width': media.isLg,
          })}
        >
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              <a href="/">{navObject.name}</a>
            </Breadcrumb.Item>
            {menuObject && (
              <Breadcrumb.Item>
                <a href="/">{menuObject.name}</a>
              </Breadcrumb.Item>
            )}
          </Breadcrumb>
          <Divider style={{ margin: '12px 0' }} />
          <Content
            className={classNames('site-layout-background select-text', {
              [className]: true,
            })}
          >
            {children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  )
}
