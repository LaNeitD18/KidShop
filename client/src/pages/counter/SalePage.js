import { useLayoutEffect } from 'react';
import { useLayoutContext } from '../../context/LayoutContext';
import { Checkbox, Collapse, Popover, Radio, Table, Typography } from 'antd';
import {
  UserOutlined,
  UserAddOutlined,
  ManOutlined,
  WomanOutlined,
} from '@ant-design/icons';
import { MdOutlineCake } from 'react-icons/md';
import { IoIosCash } from 'react-icons/io';
import { SelectInput } from '../../components/Inputs';
import AppButton from '../../components/AppButton';
import { HorizontalDivider, VerticalDivider } from '../../components/Divider';
import { currency, date } from '../../utils/string';
import moment from 'moment';
import Moment from 'react-moment';
import AppTable from '../../components/AppTable';
import Modal from 'antd/lib/modal/Modal';

const { Panel } = Collapse;

function CustomerDetailsCol({ label, children }) {
  return (
    <div className="flex-1 flex flex-col gap-1 items-center">
      <span className="text-xs font-semibold text-gray-400">{label}</span>
      <span className="text-3xl font-bold">{children}</span>
    </div>
  );
}

function ChildDetail({ male, name, dob }) {
  return (
    <>
      <div className="flex items-center gap-2">
        {male ? <ManOutlined /> : <WomanOutlined />}
        <span>{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <MdOutlineCake />
        <span>{date(dob)}</span>
        <span>
          (
          {
            <Moment diff={moment()} unit="years">
              {dob}
            </Moment>
          }{' '}
          tuổi)
        </span>
      </div>
    </>
  );
}

const billColumns = [
  {
    title: 'Mã MH',
    id: true,
    idFormat: ['MH', 6],
  },
  {
    title: 'Tên MH',
  },
  {
    title: 'Số lượng',
  },
  {
    title: 'Thành tiền',
  },
];

export default function SalePage() {
  const [layout, setLayout] = useLayoutContext();
  useLayoutEffect(() => {
    setLayout({
      disableSider: true,
      disableBreadcrumb: true,
      disablePx: true,
      alwaysScrollY: true,
    });
    return () => {
      setLayout({});
    };
  }, [setLayout]);
  return (
    <div className="flex mb-10 gap-3">
      <div className="flex-1 flex flex-col items-stretch">
        <div className="flex gap-3">
          <SelectInput className="flex-1" placeholder="Cửa hàng" />
          <SelectInput className="flex-1" placeholder="Quầy" />
          <SelectInput className="flex-1" placeholder="Nhân viên trực" />
        </div>
      </div>
      <div className="bg-white rounded-lg shadow-lg-soft p-4 flex flex-col gap-2 w-114">
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
                <CustomerDetailsCol label="TUỔI">28</CustomerDetailsCol>
                <VerticalDivider />
                <Popover
                  content={
                    <div>
                      <ChildDetail name="Ngô Công Hậu" dob={moment()} male />
                      <HorizontalDivider />
                      <ChildDetail name="Ngô Công Hậu" dob={moment()} />
                      <HorizontalDivider />
                      <ChildDetail name="Ngô Công Hậu" dob={moment()} male />
                    </div>
                  }
                  title="Các con"
                  placement="left"
                >
                  <div className="flex-1">
                    <CustomerDetailsCol label="SỐ CON">3</CustomerDetailsCol>
                  </div>
                </Popover>
                <VerticalDivider />
                <CustomerDetailsCol label="LẦN MUA">9</CustomerDetailsCol>
              </div>
              <div className="mx-4 mt-4">
                <AppButton type="edit" className="w-full">
                  Chỉnh sửa
                </AppButton>
              </div>
            </Panel>
          </Collapse>
        )}
        <AppTable
          columns={billColumns}
          selectable={false}
          size="small"
          bordered={false}
        />
        <div className="flex flex-col gap-1">
          <div className="flex items-center justify-between font-semibold text-2xl px-2 mt-4">
            <span>Tổng cộng</span>
            <span>{currency(1000000)}</span>
          </div>
          <div className="flex items-center justify-between px-2">
            <span>Tiền gốc</span>
            <span>{currency(1250000)}</span>
          </div>
          <div className="flex items-center justify-between px-2">
            <span>Giảm giá</span>
            <span>{currency(250000)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <AppButton type="cancel" size="large" className="mt-3">
            Hủy
          </AppButton>
          <AppButton type="done" size="large" className="mt-3 flex-1">
            Thanh toán
          </AppButton>
        </div>
      </div>
      <Modal title="Chọn hình thức thanh toán" width={312}>
        <Radio.Group>
          <div className="flex flex-col">
            <Radio value={1}>Thanh toán bằng tiền mặt</Radio>
            <Radio value={2}>Thanh toán với Momo</Radio>
            <Radio value={3}>Thanh toán qua thẻ tín dụng</Radio>
          </div>
        </Radio.Group>
      </Modal>
    </div>
  );
}
