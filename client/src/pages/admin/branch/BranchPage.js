import React, { useEffect } from 'react';
import MainContainer from '../../../components/MainContainer';
import { AddButton, DeleteButton } from '../../../components/Button';
import { ContentHeader } from '../../../components/Content';
import { useAppTable } from '../../../components/AppTable';

const fakeData = [
  {
    id: 'CH0001',
    address: '331, KP 10, P. An Bình, Biên Hòa, Đồng Nai',
    phone: '0987654321',
    owner: 'Ngô Công Hậu',
    createdTime: '28082021',
  },
  {
    id: 'CH0002',
    address: '420, KP 69, Quận Thủ Đức, TP HCM',
    phone: '0123456789',
    owner: 'Phan Huy Tiến',
    createdTime: '12022001',
  },
  {
    id: 'CH0003',
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
  const { setData, AppTable, selectedRows } = useAppTable(columns);

  useEffect(() => {
    setData(fakeData);
  }, []);

  return (
    <MainContainer path="admin/branch">
      <ContentHeader title="Quản lý các chi nhánh">
        <AddButton responsive>Thêm chi nhánh</AddButton>
        {!!selectedRows.length && (
          <DeleteButton responsive>Xóa chi nhánh</DeleteButton>
        )}
      </ContentHeader>
      <AppTable />
    </MainContainer>
  );
}
