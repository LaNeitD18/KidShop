import React, { useContext, useEffect, useState } from 'react';
import { AddButton, DeleteButton } from '../../components/Button';
import { ContentHeader } from '../../components/Content';
import * as api from '../../api/supplier';
import AppTable from '../../components/AppTable';
import CommonString from '../../constants/string';
import { useLocation, useNavigate } from 'react-router';
import { SupplierContext } from '../../context/SupplierContext';

const columns = [
  // {
  //   title: 'Mã NCC',
  //   id: true,
  //   searchable: true,
  //   sortable: true,
  // },
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
  // {
  //   createdTime: true,
  //   sortable: true,
  // },
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

  const handleNavigate = () => {
    if (selectedRows.length < 1) {
      navigate(location.pathname + '/add');
    } else if (selectedRows.length === 1) {
      const item = listSuppliers.filter((sup) => sup.id === selectedRows[0])[0];
      navigate(location.pathname + `/edit/${selectedRows[0]}`, { state: item });
    }
  };

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
          <AddButton onClick={handleNavigate} responsive>
            {selectedRows.length < 1 ? 'Thêm nhà cung cấp' : 'Sửa nhà cung cấp'}
          </AddButton>
        )}
        {!!selectedRows.length && (
          <DeleteButton onClick={handleDelete} responsive>
            {CommonString.SUPPLIER_DELETE}
          </DeleteButton>
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
