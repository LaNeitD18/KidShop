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
  const { loading, apiCall, result } = useApiFeedback();

  useEffect(() => {
    apiCall(fetchProducers());
  }, []);

  async function handleDelete() {
    await Promise.all(
      selectedRows.map((row) => {
        return deleteProducer(row);
      })
    )
      .then(() => {
        message.success('Xóa thành công');
        selectedRows([]);
      })
      .catch((err) => fireErrorModal(err[0]));
  }

  return (
    <div>
      <ContentHeader title="Quản lý nhà sản xuất">
        <AppButton type="add" link="add" responsive>
          Thêm nhà sản xuất
        </AppButton>
        {!!selectedRows.length && (
          <AppButton type="delete" responsive onClick={handleDelete}>
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
