import React, { useEffect, useState } from 'react';
import AppButton from '../../components/AppButton';
import { ContentHeader } from '../../components/Content';
import * as api from '../../api/supplier';
import AppTable from '../../components/AppTable';

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [data, setData] = useState([]);

  useEffect(() => {
    async function initData() {
      const suppliers = (await api.fetchAllSuppliers()).data;
      setData(suppliers);
    }
    initData();
  }, []);

  return (
    <div>
      <ContentHeader title="Quản lý nhà cung cấp">
        <AppButton type="add" responsive>
          Thêm nhà cung cấp
        </AppButton>
        {!!selectedRows.length && (
          <AppButton type="delete" responsive>
            Xóa nhà cung cấp
          </AppButton>
        )}
      </ContentHeader>
      <AppTable columns={columns} data={data} onSelectRows={setSelectedRows} />
    </div>
  );
}
