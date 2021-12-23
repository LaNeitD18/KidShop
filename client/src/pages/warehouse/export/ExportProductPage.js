import React, { useEffect, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import {
  deleteExportReceipt,
  deleteImportReceipt,
  fetchAllImportReceipts,
  fetchExportReceipts,
} from '../../../api/warehouse';
import { message } from 'antd';
import CommonString from '../../../constants/string';
import { useParams } from 'react-router-dom';

const columns = [
  {
    title: 'Mã phiếu xuất kho',
    id: true,
    idFormat: ['XK', 4],
    searchable: true,
    sortable: true,
  },
  {
    title: 'Tổng tiền',
    dataIndex: 'tongTien',
    searchable: true,
  },

  {
    title: 'Người lập',
    dataIndex: ['nguoiLap', 'hoTen'],
    searchable: true,
  },
  {
    createdTime: true,
    sortable: true,
  },
  {
    title: 'Ghi chú',
    dataIndex: 'ghiChu',
    searchable: false,
  },
];

export default function ExportProductPage() {
  const { warehouseId } = useParams();

  const [selectedRows, setSelectedRows] = useState([]);
  const [apiCall, loading, error, result] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  function getExportReceipts() {
    apiCall(fetchExportReceipts());
  }

  useEffect(() => {
    getExportReceipts();
  }, [warehouseId]);

  function handleDelete() {
    deleteCall(
      Promise.all(
        selectedRows.map((row) => {
          return deleteExportReceipt(row);
        })
      ),
      () => {
        message.success('Xóa thành công');
        setSelectedRows([]);
        getExportReceipts();
      }
    );
  }

  return (
    <div>
      <ContentHeader title="Quản lý xuất kho">
        <AppButton type="add" link="add" responsive>
          Tạo phiếu xuất kho
        </AppButton>
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            responsive
            onClick={handleDelete}
            loading={deleteLoading}
          >
            Xóa phiếu xuất kho
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        loading={loading}
        columns={columns}
        data={result?.data?.filter(
          (item) => item?.kho.id.toString() === warehouseId.toString()
        )}
        onSelectRows={setSelectedRows}
        itemName="phiếu xuất kho"
      />
    </div>
  );
}
