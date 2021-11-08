import React, { useEffect, useState, useContext } from 'react';
import AppButton from '../../components/AppButton';
import { ContentHeader } from '../../components/Content';
import * as api from '../../api/supplier';
import AppTable from '../../components/AppTable';
import CommonString from '../../constants/string';
import { useLocation, useNavigate } from 'react-router';
import { SupplierContext } from '../../context/SupplierContext';

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
  const navigate = useNavigate();
  const location = useLocation();

  const [listSuppliers, setListSuppliers] = useContext(SupplierContext);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function initData() {
      const suppliers = (await api.fetchAllSuppliers()).data;
      setListSuppliers(suppliers);
    }
    initData();
  }, []);

  const handleDelete = async () => {
    const answer = window.confirm(
      'Bạn có muốn xóa những nhà cung cấp này không?'
    );

    if (answer) {
      let newList = listSuppliers;
      for (const id of selectedRows) {
        await api.deleteSupplier(id);
        newList = newList.filter((sup) => sup.id !== id);
      }
      setListSuppliers(newList);
    }
  };

  return (
    <div>
      <ContentHeader title="Quản lý nhà cung cấp">
        {selectedRows.length < 2 && (
          <AppButton type="add" responsive>
            Thêm nhà cung cấp
          </AppButton>
        )}
        {!!selectedRows.length && (
          <AppButton type="delete" onClick={handleDelete} responsive>
            {CommonString.SUPPLIER_DELETE}
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        columns={columns}
        data={listSuppliers}
        onSelectRows={setSelectedRows}
      />
    </div>
  );
}
