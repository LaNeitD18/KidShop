import React, { useContext, useEffect, useState } from 'react';
import AppButton from '../../components/AppButton';

import { ContentHeader } from '../../components/Content';
import AppTable from '../../components/AppTable';
import CommonString from '../../constants/string';
import { useLocation, useNavigate } from 'react-router';
import { WarehouseContext } from '../../context';
import * as api from '../../api/warehouse';

const columns = [
  // {
  //   title: 'Mã kho',
  //   id: true,
  //   searchable: true,
  //   sortable: true,
  // },
  {
    title: CommonString.WAREHOUSE_ADDRESS,
    dataIndex: 'diaChi',
    searchable: true,
  },
  {
    title: CommonString.WAREHOUSE_PHONE,
    dataIndex: 'sdt',
    searchable: true,
  },
  // {
  //   createdTime: true,
  //   sortable: true,
  // },
];

export default function WarehousePage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [listWarehouses, setListWarehouses] = useContext(WarehouseContext);
  const [selectedRows, setSelectedRows] = useState([]);

  useEffect(() => {
    async function initData() {
      const warehouses = (await api.fetchAllWarehouses()).data;
      setListWarehouses(warehouses);
    }
    initData();
  }, []);

  const handleNavigate = () => {
    if (selectedRows.length < 1) {
      navigate(location.pathname + '/add');
    } else if (selectedRows.length === 1) {
      const item = listWarehouses.filter(
        (warehouse) => warehouse.id === selectedRows[0]
      )[0];
      navigate(location.pathname + `/edit/${selectedRows[0]}`, { state: item });
    }
  };

  const handleDelete = async () => {
    const answer = window.confirm('Bạn có muốn xóa những kho hàng này không?');
    if (answer) {
      let newList = listWarehouses;
      for (const id of selectedRows) {
        await api.deleteWarehouse(id);
        newList = newList.filter((item) => item.id !== id);
      }
      setListWarehouses(newList);
      setSelectedRows([]);
    }
  };

  return (
    <div>
      <ContentHeader title={CommonString.WAREHOUSE_TITLE}>
        {selectedRows.length < 2 && (
          <AppButton type="add" onClick={handleNavigate} responsive>
            {selectedRows.length < 1
              ? CommonString.WAREHOUSE_ADD
              : CommonString.WAREHOUSE_EDIT}
          </AppButton>
        )}
        {!!selectedRows.length && (
          <AppButton type="delete" onClick={handleDelete} responsive>
            {CommonString.WAREHOUSE_DELETE}
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        columns={columns}
        data={listWarehouses}
        onSelectRows={setSelectedRows}
      />
    </div>
  );
}
