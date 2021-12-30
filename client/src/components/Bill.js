import {
  UserOutlined,
  UserAddOutlined,
  ManOutlined,
  WomanOutlined,
  SearchOutlined,
  BarcodeOutlined,
  QrcodeOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';
import {
  Button,
  Card,
  Checkbox,
  Collapse,
  Input,
  Popover,
  Radio,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
  Modal,
  message,
  Form,
  Affix,
} from 'antd';
import moment from 'moment';
import { currency, date } from '../utils/string';
import AppButton from './AppButton';
import AppTable from './AppTable';
import { HorizontalDivider, VerticalDivider } from './Divider';
import { SelectInput } from './Inputs';
import { MdOutlineCake } from 'react-icons/md';
import Moment from 'react-moment';
import classNames from 'classnames';
import useApiFeedback from '../hooks/useApiFeedback';
import { useEffect, useState } from 'react';
import { fetchCustomers } from '../api/customer';
import { arrayFind } from '../utils/array';
import CustomerModal from './CustomerModal';

const { Panel } = Collapse;
const { Meta } = Card;

const billColumns = [
  {
    title: 'Mặt hàng',
    dataIndex: 'tenMH',
  },
  {
    title: 'Số lượng',
    dataIndex: 'count',
  },
  {
    title: 'Thành tiền',
    dataIndex: 'money',
  },
];

export default function Bill({
  total,
  items,
  rawPrice,
  discount,
  onCancel = () => {},
  onOk,
  readonly,
  onChange = () => {},
  className,
}) {
  const [customersCall, customersLoad, customersError, { data: customers }] =
    useApiFeedback();
  const [selectedCus, setSelectedCus] = useState({});
  const [cusModal, setCusModal] = useState(false);

  useEffect(() => {
    if (!readonly) {
      customersCall(fetchCustomers());
    }
  }, [readonly]);

  useEffect(() => {
    onChange({
      khId: selectedCus.id,
    });
  }, [onChange, selectedCus.id]);

  const selectedCusId = selectedCus?.id;

  console.log('selected cus', selectedCus);

  return (
    <div
      className={classNames('flex flex-col gap-2 w-full self-start pb-8', {
        'bg-white rounded-lg shadow-lg-soft p-4 lg:w-96': !readonly,
      })}
    >
      {!!cusModal && (
        <CustomerModal
          onCancel={setCusModal}
          cus={selectedCus}
          onUpdated={() => {
            customersCall(fetchCustomers(), ({ data }) => {
              setSelectedCus({});
            });
          }}
        />
      )}
      {!readonly && (
        <SelectInput
          placeholder="Khách hàng thành viên"
          data={customers?.map((c) => ({
            value: c.id,
            label: c.hoTen,
          }))}
          idFormat={['KH', 6]}
          value={selectedCus?.id}
          onSelect={(v) => {
            setSelectedCus(arrayFind(customers, v, 'id'));
          }}
          onClear={() => {
            setSelectedCus({});
          }}
        />
      )}
      <div className="flex items-center gap-2">
        <UserOutlined className="text-5xl p-3 opacity-80" />
        <div className="flex flex-col">
          {selectedCusId ? (
            <span className="font-bold text-xl">{selectedCus.hoTen}</span>
          ) : (
            <span className="font-bold text-xl">Khách</span>
          )}

          {selectedCusId ? <span>Thành viên</span> : <span>Chưa đăng ký</span>}
        </div>
      </div>
      {!selectedCusId && (
        <AppButton
          type="add"
          icon={<UserAddOutlined />}
          className="mx-4"
          onClick={() => setCusModal(true)}
        >
          Tạo khách hàng
        </AppButton>
      )}
      {selectedCusId && (
        <Collapse defaultActiveKey={['1']}>
          <Panel header="Thông tin khách hàng">
            <div className="flex tracking-wide">
              <CustomerDetailsCol label="TUỔI">
                {moment().diff(selectedCus?.ngaySinh, 'years')}
              </CustomerDetailsCol>
              <VerticalDivider />
              <Popover
                content={
                  <div>
                    {selectedCus.dsCTKhachHang?.map((con, i) => (
                      <>
                        <ChildDetail
                          name={con.hoTenCon}
                          dob={con.ngaySinhCon}
                          male={con.gioiTinhCon === 'nam'}
                        />
                        {i < selectedCus.dsCTKhachHang?.length - 1 && (
                          <HorizontalDivider />
                        )}
                      </>
                    ))}
                  </div>
                }
                title="Các con"
                placement="left"
              >
                <div className="flex-1">
                  <CustomerDetailsCol label="SỐ CON">
                    {selectedCus.dsCTKhachHang?.length}
                  </CustomerDetailsCol>
                </div>
              </Popover>
              <VerticalDivider />
              <CustomerDetailsCol label="LẦN MUA">
                {selectedCus.dsHoaDon?.length}
              </CustomerDetailsCol>
            </div>
            <div className="mx-4 mt-4">
              <AppButton
                type="edit"
                className="w-full"
                onClick={() => {
                  setCusModal(true);
                }}
              >
                Chỉnh sửa
              </AppButton>
            </div>
          </Panel>
        </Collapse>
      )}
      <AppTable
        data={items}
        columns={billColumns}
        selectable={false}
        size="small"
        bordered={false}
        minCols={3}
        defaultPageSize={4}
      />
      {!readonly && (
        <>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between font-semibold text-2xl px-2 mt-4">
              <span>Tổng cộng</span>
              <span>{currency(total)}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span>Tiền gốc</span>
              <span>{currency(rawPrice)}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span>Giảm giá</span>
              <span>{currency(discount)}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <AppButton
              type="delete"
              size="large"
              className="mt-3"
              disabled={!items.length}
              onClick={() => onCancel([])}
            >
              Hủy
            </AppButton>
            <AppButton
              type="done"
              size="large"
              className="mt-3 flex-1"
              onClick={onOk}
              disabled={!items.length}
            >
              Thanh toán
            </AppButton>
          </div>
        </>
      )}
    </div>
  );
}

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
        <span>({moment().diff(dob, 'years')} tuổi)</span>
      </div>
    </>
  );
}
