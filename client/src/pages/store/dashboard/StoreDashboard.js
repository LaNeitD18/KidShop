import React, { useEffect, useMemo, useState } from 'react';
import AppButton from '../../../components/AppButton';
import { ContentHeader } from '../../../components/Content';
import AppTable from '../../../components/AppTable';
import useApiFeedback from '../../../hooks/useApiFeedback';
import { deleteStore, getStoreList } from '../../../api/store';
import { message, Modal } from 'antd';
import { useRoles } from '../../../context/RolesContext';
import { useParams } from 'react-router-dom';
import { getBill, getBills } from '../../../api/bill';
import { idString } from '../../../utils/string';
import Bill from '../../../components/Bill';
import Loading from '../../../components/Loading';

export default function StoreDashboard() {
  const [selectedRows, setSelectedRows] = useState([]);
  const [billCall, billLoading, billError, { data: bills }] = useApiFeedback();
  const [deleteCall, deleteLoading] = useApiFeedback();
  const [billModal, setBillModal] = useState(null);
  const [detailCall] = useApiFeedback();

  const [roles, updateRoles] = useRoles();

  const { storeId } = useParams();

  function fetchStore() {
    billCall(getBills(storeId));
  }

  useEffect(() => {
    fetchStore();
  }, [storeId]);

  console.log(bills);

  const columns = useMemo(
    () => [
      {
        title: 'Mã hóa đơn',
        id: true,
        idFormat: ['B', 6],
        searchable: true,
        sortable: true,
        onValClick: (v) => {
          setBillModal({
            title: `Hóa đơn ${idString(v, ['B', 6])}`,
            children: <Loading />,
          });
          detailCall(getBill(v), ({ data: bill }) => {
            setBillModal({
              title: `Hóa đơn ${idString(v, ['B', 6])}`,
              transitionName: '',
              maskTransitionName: '',
              children: (
                <Bill
                  readonly
                  total={bill.tongHoaDon}
                  items={bill.dsCTHoaDon.map((ct) => ({
                    tenMH: ct.matHang.tenMH,
                    count: ct.soLuong,
                    money: ct.tongTien,
                  }))}
                />
              ),
            });
          });
        },
      },
      {
        title: 'Tổng tiền',
        dataIndex: 'tongHoaDon',
        sortable: true,
      },
      {
        title: 'Người lập',
        dataIndex: ['nguoiLap', 'hoTen'],
        searchable: true,
        sortable: true,
      },
      {
        title: 'Quầy',
        dataIndex: ['quay', 'tenQuay'],
        searchable: true,
        sortable: true,
      },
      {
        title: 'Khách hàng',
        dataIndex: ['khachHang', 'hoTen'],
        searchable: true,
        sortable: true,
        render: (v) => v || 'Khách vãng lai',
      },
      {
        createdTime: true,
        sortable: true,
      },
    ],
    [detailCall]
  );

  function handleDelete() {
    deleteCall(
      Promise.all(
        selectedRows.map((row) => {
          return deleteStore(row);
        })
      ),
      () => {
        updateRoles();
        message.success('Xóa thành công');
        setSelectedRows([]);
        fetchStore();
      }
    );
  }

  return (
    <div>
      <Modal
        visible={billModal}
        onCancel={() => setBillModal(null)}
        {...billModal}
      />
      <ContentHeader title="Danh sách hóa đơn">
        {!!selectedRows.length && (
          <AppButton
            type="delete"
            responsive
            onClick={handleDelete}
            loading={deleteLoading}
          >
            Xóa chi nhánh
          </AppButton>
        )}
      </ContentHeader>
      <AppTable
        loading={billLoading}
        columns={columns}
        data={bills}
        onSelectRows={setSelectedRows}
        itemName="chi nhánh"
      />
    </div>
  );
}
