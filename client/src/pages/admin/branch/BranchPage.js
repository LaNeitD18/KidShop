import React, { useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';

const fakeData = [
  {
    id: 1,
    address: '331, KP 10, P. An Bình, Biên Hòa, Đồng Nai',
    phone: '0987654321',
    owner: 'Ngô Công Hậu',
    createdTime: '28082021',
  },
  {
    id: 2,
    address: '420, KP 69, Quận Thủ Đức, TP HCM',
    phone: '0123456789',
    owner: 'Phan Huy Tiến',
    createdTime: '12022001',
  },
  {
    id: 3,
    address: '69, KP 69, Quận Thủ Đức, TP HCM',
    phone: '0123456789',
    owner: 'Phan Huy Sanh',
    createdTime: '12022001',
  },
];

const columns = [
  {
    title: 'Mã cửa hàng',
    id: true,
    idFormat: ['CH', 4],
    searchable: true,
    sortable: true,
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'address',
    searchable: true,
  },
  {
    title: 'SDT',
    dataIndex: 'phone',
    searchable: true,
  },
  {
    title: 'Chủ cửa hàng',
    dataIndex: 'owner',
    searchable: true,
  },
  {
    createdTime: true,
    sortable: true,
  },
];

export default function BranchPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  return (
    <div>
      <ContentHeader title="Quản lý các chi nhánh">
        <AppButton type="add" link="add" responsive>
          Thêm chi nhánh
        </AppButton>
        {!!selectedRows.length && (
          <AppButton type="delete" responsive>
            Xóa chi nhánh
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        columns={columns}
        data={fakeData}
        onSelectRows={setSelectedRows}
      />
    </div>
  );
}
