import { cloneElement, useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import classNames from 'classnames';
import { arrayFind } from '../utils/array';
import { stringToPaths, pathsToStrings } from '../utils/route';
import { useResponsive } from '../components/Media';
import { Breadcrumb, Divider, Layout, Menu, Select, Typography } from 'antd';
import theme from '../constants/theme';

import { IoLogOutOutline, IoCloseSharp, IoBusiness } from 'react-icons/io5';
import { FiMenu } from 'react-icons/fi';
import { AiOutlineDashboard } from 'react-icons/ai';
import { UserOutlined } from '@ant-design/icons';
import { AiOutlineApartment } from 'react-icons/ai';
import { GrGroup, GrUserManager, GrAppsRounded } from 'react-icons/gr';
import { RiPencilRuler2Line } from 'react-icons/ri';
import { MdPointOfSale, MdOutlineStore } from 'react-icons/md';
import { GoChevronDown } from 'react-icons/go';
import { useRoles } from '../context/RolesContext';
import { idString } from '../utils/string';

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
    icon: <IoBusiness />,
    children: [
      {
        path: 'product',
        title: 'QL mặt hàng',
        icon: <GrAppsRounded />,
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
    ],
  },
  {
    path: 'store',
    title: 'Cửa hàng',
    icon: <MdOutlineStore />,
    context: 'stores',
    idFormat: ['CH', 4],
    children: [
      {
        path: 'counter',
        title: 'QL Quầy',
        icon: <MdPointOfSale />,
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
    ],
  },
  {
    path: 'counter',
    title: 'Bán hàng',
  },
  {
    path: 'supply',
    title: 'Nguồn hàng',
    children: [
      {
        path: 'supplier',
        title: 'QL Nhà Cung Cấp',
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
        path: 'producer',
        title: 'QL Nhà Sản Xuất',
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
    ],
  },
  {
    path: 'storage',
    title: 'Trữ hàng',
    children: [
      {
        path: 'warehouses',
        title: 'QL Các Kho',
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
    ],
  },
  {
    path: 'warehouse',
    title: 'Kho',
    context: 'warehouses',
    idFormat: ['KH', 4],
    children: [
      {
        path: 'import-product',
        title: 'QL Nhập kho',
        children: [
          {
            path: 'add',
            title: 'Lập phiếu nhập kho',
          },
          {
            path: 'edit',
            title: 'Sửa',
          },
        ],
      },
      {
        path: 'export-product',
        title: 'QL Xuất kho',
        children: [
          {
            path: 'add',
            title: 'Lập phiếu xuất kho',
          },
          {
            path: 'edit',
            title: 'Sửa',
          },
        ],
      },
    ],
  },
];

export default function MainContainer() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const paths = stringToPaths(pathname);

  const [roles] = useRoles();

  const nav = arrayFind(navMenu, paths[1], 'path') || {};
  const hasNavContext = nav?.context ? 1 : 0;
  const menu = arrayFind(nav?.children, paths[hasNavContext + 2], 'path');
  const subPage = arrayFind(menu?.children, paths[hasNavContext + 3], 'path');

  const [isOpenSider, setIsOpenSider] = useState(false);

  const media = useResponsive();
  const isSiderCollapsed = !isOpenSider && !media.isLg;

  useEffect(() => {
    if (media.isLg) {
      setIsOpenSider(false);
    }
  }, [media.isLg]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleSelectNav = ({ key }) => {
    if (key === 'logout') {
      handleLogout();
      return;
    }
    navigate(key);
  };

  const handleSelectMenu = ({ key }) => {
    navigate(key);
  };

  const navContextOptions = roles[nav?.context]?.map((v) => ({
    value: v,
    label: idString(v, nav?.idFormat),
  }));

  const navContext = arrayFind(navContextOptions, paths[2], 'value');

  useEffect(() => {
    if (navContextOptions && !navContext && paths[2]) {
      navigate('/error/403', { replace: true });
    }
  }, [navContextOptions, navContext, paths[2]]);

  return (
    <Layout className="select-none">
      <Header className="flex fixed z-20 items-center min-h-nav-height w-full shadow-md">
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

        <span className="text-white font-logo hidden cursor-pointer xs:inline text-md sm:text-xl md:text-2xl lg:text-2xl mr-4 whitespace-nowrap">
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
        <div
          className="hidden lg:flex text-white items-center gap-2 min-w-max cursor-pointer"
          onClick={handleLogout}
        >
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
          className="pt-nav-height h-screen left-0 overflow-x-hidden overflow-y-auto z-10 border-r"
          style={{
            position: 'fixed',
          }}
        >
          <Menu
            mode="inline"
            style={{ height: '100%', borderRight: 0, padding: '0 1rem' }}
            selectedKeys={
              hasNavContext
                ? pathsToStrings([paths[1], paths[2], paths[3]])
                : pathsToStrings([paths[1], paths[2]])
            }
            onSelect={handleSelectMenu}
          >
            <div className="w-full flex-col items-center text-center mb-6 mt-7 pr-1">
              {nav.icon &&
                cloneElement(nav.icon, {
                  className: 'text-3xl w-full mb-1',
                })}
              <Title level={4}>{nav.title}</Title>
              {!!hasNavContext && (
                <Select
                  style={{
                    color: theme.color.primary,
                    fontWeight: 600,
                    fontSize: '1.125rem',
                  }}
                  options={navContextOptions}
                  value={navContext}
                  labelInValue
                  bordered={false}
                  suffixIcon={
                    <GoChevronDown
                      style={{ marginTop: 1, marginLeft: -8 }}
                      className=" text-primary"
                    />
                  }
                  onSelect={(option) => {
                    let tempPaths = [...paths];
                    tempPaths[2] = option?.value;
                    navigate(['', ...tempPaths].join('/'));
                  }}
                />
              )}
            </div>
            <Menu.Divider />
            <div className="mb-5" />
            <Menu.Item
              icon={<AiOutlineDashboard />}
              key={pathsToStrings(
                navContext
                  ? [nav.path, navContext.value, 'dashboard']
                  : [nav.path, 'dashboard']
              )}
            >
              Bảng điều khiển
            </Menu.Item>
            {nav?.children?.map((value) => (
              <Menu.Item
                icon={value.icon}
                key={pathsToStrings(
                  navContext
                    ? [nav.path, navContext.value, value.path]
                    : [nav.path, value.path]
                )}
              >
                {value.title}
              </Menu.Item>
            ))}
          </Menu>
        </Sider>
        <Layout
          className={classNames('pb-6 sm:pb-0 mt-nav-height', {
            'ml-sider-width': media.isLg,
          })}
        >
          <div className="bg-white py-4 pl-6 sm:pl-10 md:pl-6 lg:pl-10 border-b">
            <Breadcrumb>
              <Breadcrumb.Item href="/">
                {menu ? <Link to={nav.path}>{nav.title}</Link> : nav.title}
              </Breadcrumb.Item>
              {menu && (
                <Breadcrumb.Item>
                  {subPage ? (
                    <Link
                      to={
                        hasNavContext
                          ? [paths[1], paths[2], paths[3]].join('/')
                          : [paths[1], paths[2]].join('/')
                      }
                    >
                      {menu.title}
                    </Link>
                  ) : (
                    menu.title
                  )}
                </Breadcrumb.Item>
              )}
              {subPage && <Breadcrumb.Item>{subPage.title}</Breadcrumb.Item>}
            </Breadcrumb>
          </div>
          {/* <Divider style={{ margin: '12px 0' }} /> */}
          <Content className="site-layout-background select-text px-6 sm:px-10 md:px-6 lg:px-10 pt-5">
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
}
