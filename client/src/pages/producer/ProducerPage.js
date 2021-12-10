import React, { useEffect, useState } from 'react';
import AppButton from '../../components/AppButton';
import { ContentHeader } from '../../components/Content';
import AppTable from '../../components/AppTable';
import useApiFeedback from '../../hooks/useApiFeedback';
import { deleteProducer, fetchProducers } from '../../api/producer';
import { message } from 'antd';
import { fireErrorModal } from '../../utils/feedback';

const columns = [
  {
    title: 'Mã nhà sản xuất',
    id: true,
    idFormat: ['NSX', 4],
    searchable: true,
    sortable: true,
  },
  {
    title: 'Tên nhà sản xuất',
    dataIndex: ['tenNSX'],
    searchable: true,
  },
  {
    title: 'Địa chỉ',
    dataIndex: 'diaChi',
    searchable: true,
  },
  {
    title: 'SDT',
    dataIndex: 'sdt',
    searchable: true,
  },
  {
    createdTime: true,
    sortable: true,
  },
];

export default function ProducerPage() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [apiCall, loading, error, result] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();

  const fetchListProducers = () => {
    apiCall(fetchProducers());
  };

  useEffect(() => {
    fetchListProducers();
  }, []);

  async function handleDelete() {
    deleteCall(
      Promise.all(
        selectedRows.map((row) => {
          return deleteProducer(row);
        })
      ),
      () => {
        message.success('Xóa thành công');
        setSelectedRows([]);
        fetchListProducers();
      }
    );
  }

  return (
    <div>
      <ContentHeader title="Quản lý nhà sản xuất">
        <AppButton type="add" link="add" responsive>
          Thêm nhà sản xuất
        </AppButton>
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            responsive
            onClick={handleDelete}
            loading={deleteLoading}
          >
            Xóa nhà sản xuất
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        loading={loading}
        columns={columns}
        data={result?.data}
        onSelectRows={setSelectedRows}
        itemName="nhà sản xuất"
      />
    </div>
  );
}
