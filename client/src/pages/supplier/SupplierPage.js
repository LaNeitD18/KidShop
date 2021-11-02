import React, { useEffect } from 'react';
import MainContainer from '../../components/MainContainer';
import { AddButton, DeleteButton } from '../../components/Button';
import { ContentHeader } from '../../components/Content';
import { useAppTable } from '../../components/AppTable';
import * as api from '../../api/supplier';

const columns = [
  {
    title: 'Mã NCC',
    id: true,
    searchable: true,
    sortable: true,
  },
  {
    title: 'Tên NCC',
    dataIndex: 'tenNCC',
    searchable: true,
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'diaChi',
    searchable: true,
  },
  {
    title: 'Số điện thoại',
    dataIndex: 'sdt',
    searchable: true,
  },
  {
    createdTime: true,
    sortable: true,
  },
];

export default function SupplierPage() {
  const { setData, AppTable, selectedRows } = useAppTable(columns, {
    idTitle: 'Mã nhà cung cấp',
    createTime: true,
  });

  useEffect(() => {
    async function initData() {
      const suppliers = (await api.fetchAllSuppliers()).data;
      console.log('sups', suppliers);
      setData(suppliers);
    }
    initData();
  }, []);

  // TODO: change path
  return (
    <MainContainer path="admin/branch">
      <ContentHeader title="Quản lý nhà cung cấp">
        <AddButton responsive>Thêm nhà cung cấp</AddButton>
        {!!selectedRows.length && (
          <DeleteButton responsive>Xóa nhà cung cấp</DeleteButton>
        )}
      </ContentHeader>
      <AppTable />
    </MainContainer>
  );
}
