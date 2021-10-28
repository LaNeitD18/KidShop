import { UserOutlined } from '@ant-design/icons'
import { AiOutlineApartment } from 'react-icons/ai'
import { GrGroup, GrUserManager } from 'react-icons/gr'
import { RiPencilRuler2Line } from 'react-icons/ri'

const appRoute = [
  {
    key: 'admin',
    name: 'Quản trị',
    icon: <GrUserManager />,
    menu: [
      {
        key: 'employee',
        icon: <UserOutlined />,
        name: 'Nhân viên',
      },
      {
        key: 'branch',
        icon: <AiOutlineApartment />,
        name: 'Các chi nhánh',
      },
      {
        key: 'group',
        icon: <GrGroup />,
        name: 'Nhóm quyền',
      },
      {
        key: 'config',
        icon: <RiPencilRuler2Line />,
        name: 'Cấu hình',
      },
    ],
  },
  {
    key: 'business',
    name: 'Kinh doanh',
  },
  {
    key: 'store',
    name: 'Cửa hàng',
  },
  {
    key: 'pos',
    name: 'Bán hàng',
  },
  {
    key: 'supply',
    name: 'Nguồn hàng',
  },
  {
    key: 'warehouse',
    name: 'Kho',
  },
]

export default appRoute
