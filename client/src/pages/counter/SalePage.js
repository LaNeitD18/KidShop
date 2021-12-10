import { useLayoutEffect } from 'react';
import { useLayoutContext } from '../../context/LayoutContext';
import { Collapse, Typography } from 'antd';
import { UserOutlined, UserAddOutlined } from '@ant-design/icons';
import { SelectInput } from '../../components/Inputs';
import AppButton from '../../components/AppButton';

const { Panel } = Collapse;

function CustomerDetailsCol({ label, children }) {
  return (
    <div className="flex-1 flex flex-col gap-1 items-center">
      <span className="text-xs font-semibold text-gray-400">{label}</span>
      <span className="text-3xl font-bold">{children}</span>
    </div>
  );
}

export default function SalePage() {
  const [layout, setLayout] = useLayoutContext();
  useLayoutEffect(() => {
    setLayout({
      disableSider: true,
      disableBreadcrumb: true,
    });
    return () => {
      setLayout({});
    };
  }, [setLayout]);
  return (
    <div className="flex">
      <div className="flex-1"></div>
      <div className="bg-white rounded-lg shadow-lg-soft h-96 p-4 flex flex-col gap-3 w-96">
        <SelectInput placeholder="Khách hàng thành viên" />
        <div className="flex items-center gap-2">
          <UserOutlined className="text-5xl p-3 opacity-80" />
          <div className="flex flex-col">
            <span className="font-bold text-xl">Nguyễn Thành Trung</span>
            <span>Thành viên trung thành</span>
          </div>
        </div>
        {false && (
          <AppButton type="add" icon={<UserAddOutlined />} className="mx-4">
            Tạo khách hàng
          </AppButton>
        )}
        {true && (
          <Collapse defaultActiveKey={['1']}>
            <Panel header="Thông tin khách hàng">
              <div className="flex tracking-wide">
                <CustomerDetailsCol label="Tuổi">28</CustomerDetailsCol>
                <div className="bg-gray-300 w-px mx-3" />
                <CustomerDetailsCol label="Lần mua">9</CustomerDetailsCol>
                <div className="bg-gray-300 w-px mx-3" />
                <CustomerDetailsCol label="Số con">3</CustomerDetailsCol>
              </div>
            </Panel>
          </Collapse>
        )}
      </div>
    </div>
  );
}
