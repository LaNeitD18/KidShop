import { cloneElement, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { arrayFind } from '../utils/array';
import { stringToPaths, pathsToStrings } from '../utils/route';
import { useResponsive } from '../components/Media';
import { Breadcrumb, Divider, Layout, Menu, Typography } from 'antd';

import { IoLogOutOutline, IoCloseSharp } from 'react-icons/io5';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { UserOutlined } from '@ant-design/icons';
import { AiOutlineApartment } from 'react-icons/ai';
import { GrGroup, GrUserManager } from 'react-icons/gr';
import { RiPencilRuler2Line } from 'react-icons/ri';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const navMenu = [
  {
    path: 'admin',
    title: 'Quản trị',
    icon: <GrUserManager />,
    children: [
      {
        path: 'employee',
        title: 'QL Nhân Viên',
        icon: <UserOutlined />,
      },
      {
        path: 'branch',
        title: 'QL Chi Nhánh',
        icon: <AiOutlineApartment />,
        children: [
          {
            path: 'add',
            title: 'Tạo mới',
          },
          {
            path: 'edit',
            title: 'Sửa',
          },
        ],
      },
      {
        path: 'group',
        title: 'QL Nhóm Quyền',
        icon: <GrGroup />,
      },
      {
        path: 'config',
        title: 'Cài Đặt Cấu Hình',
        icon: <RiPencilRuler2Line />,
      },
    ],
  },
  {
    path: 'business',
    title: 'Kinh doanh',
  },
  {
    path: 'store',
    title: 'Cửa hàng',
  },
  {
    path: 'pos',
    title: 'Bán hàng',
  },
  {
    path: 'supply',
    title: 'Nguồn hàng',
    children: [
      {
        path: 'supplier',
        title: 'QL Nhà Cung Cấp',
      },
    ],
  },
  {
    path: 'storage',
    title: 'Trữ hàng',
    children: [
      {
        path: 'warehouse',
        title: 'QL Các Kho',
      },
    ],
  },
  {
    path: 'warehouse',
    title: 'Kho',
  },
];

export default function MainContainer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const paths = stringToPaths(pathname);
  const nav = arrayFind(navMenu, paths[1], 'path') || {};
  const menu = arrayFind(nav?.children, paths[2], 'path');
  const subPage = arrayFind(menu?.children, paths[3], 'path');

  const [isOpenSider, setIsOpenSider] = useState(false);

  const media = useResponsive();
  const isSiderCollapsed = !isOpenSider && !media.isLg;

  useEffect(() => {
    if (media.isLg) {
      setIsOpenSider(false);
    }
  }, [media.isLg]);

  const handleSelectNav = ({ key }) => {
    navigate(key);
  };

  const handleSelectMenu = ({ key }) => {
    navigate(key);
  };

  return (
    <Layout className="select-none">
      <Header className="flex fixed z-20 items-center min-h-nav-height w-full shadow-lg">
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
          selectedKeys={[nav?.path]}
          onSelect={handleSelectNav}
        >
          {navMenu?.map((value) => (
            <Menu.Item key={value.path}>{value.title}</Menu.Item>
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
          className="pt-nav-height h-screen left-0 overflow-x-hidden overflow-y-auto z-10 shadow-xl"
          style={{
            position: 'fixed',
          }}
        >
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0 }}
            selectedKeys={[paths.menuString]}
            onSelect={handleSelectMenu}
          >
            <div className="w-full flex-col items-center text-center mb-5 mt-7 pr-1">
              {nav.icon &&
                cloneElement(nav.icon, {
                  className: 'text-3xl w-full mb-1',
                })}
              <Title level={4}>{nav.title}</Title>
            </div>
            <Menu.Divider />
            <Menu.Item
              icon={<AiOutlineDashboard />}
              key={pathsToStrings([nav.path, 'dashboard'])}
            >
              Bảng điều khiển
            </Menu.Item>
            {nav?.children?.map((value) => (
              <Menu.Item
                icon={value.icon}
                key={pathsToStrings([nav.path, value.path])}
              >
                {value.title}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout
          className={classNames(
            'pt-4 px-6 xs:pt-6 pb-6 sm:pb-0 sm:px-10 mt-nav-height',
            {
              'ml-sider-width': media.isLg,
            }
          )}
        >
          <Breadcrumb>
            <Breadcrumb.Item href="/">
              {menu ? <Link to={nav.path}>{nav.title}</Link> : nav.title}
            </Breadcrumb.Item>
            {menu && (
              <Breadcrumb.Item>
                {subPage ? (
                  <Link to={paths.menuString}>{menu.title}</Link>
                ) : (
                  menu.title
                )}
              </Breadcrumb.Item>
            )}
            {subPage && <Breadcrumb.Item>{subPage.title}</Breadcrumb.Item>}
          </Breadcrumb>
          <Divider style={{ margin: '12px 0' }} />
          <Content className="site-layout-background select-text">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
