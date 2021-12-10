import React, { useEffect, useState } from 'react';
import AppButton from '../../components/AppButton';
import { ContentHeader } from '../../components/Content';
import * as api from '../../api/supplier';
import AppTable from '../../components/AppTable';
import CommonString from '../../constants/string';
import useApiFeedback from '../../hooks/useApiFeedback';
import { message } from 'antd';

const columns = [
  {
    title: 'Mã NCC',
    id: true,
    idFormat: ['NCC', 4],
    searchable: true,
    sortable: true,
  },
  {
    title: CommonString.SUPPLIER_NAME,
    dataIndex: 'tenNCC',
    searchable: true,
  },
  {
    title: CommonString.SUPPLIER_ADDRESS,
    dataIndex: 'diaChi',
    searchable: true,
  },
  {
    title: CommonString.SUPPLIER_PHONE,
    dataIndex: 'sdt',
    searchable: true,
  },
];

export default function SupplierPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [apiCall, loading, error, result] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  const fetchListSuppliers = () => {
    apiCall(api.fetchAllSuppliers());
  };

  useEffect(() => {
    fetchListSuppliers();
  }, []);

  const handleDelete = async () => {
    deleteCall(
      Promise.all(
        selectedRows.map((row) => {
          return api.deleteSupplier(row);
        })
      ),
      () => {
        message.success('Xóa thành công');
        setSelectedRows([]);
        fetchListSuppliers();
      }
    );
  };

  return (
    <div>
      <ContentHeader title="Quản lý nhà cung cấp">
        <AppButton type="add" link="add" responsive>
          Thêm nhà cung cấp
        </AppButton>
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            responsive
            onClick={handleDelete}
            loading={deleteLoading}
          >
            Xóa nhà cung cấp
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        loading={loading}
        columns={columns}
        data={result?.data}
        onSelectRows={setSelectedRows}
        itemName="nhà cung cấp"
      />
    </div>
  );
}
