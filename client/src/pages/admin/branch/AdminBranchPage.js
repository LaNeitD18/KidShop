import React, { useEffect, useState } from 'react'
import MainContainer from '../../../components/MainContainer'
import { AddButton, DeleteButton } from '../../../components/Button'
import { useResponsive } from '../../../components/Media'
import { ContentHeader } from '../../../components/Content'
import { AppTable, createTimeColumn, idColumn } from '../../../components/Table'

const fakeData = [
  {
    id: 'CH0001',
    address: '331, KP 10, P. An Bình, Biên Hòa, Đồng Nai',
    phone: '0987654321',
    owner: 'Ngô Công Hậu',
    createdTime: '28082021',
  },
  {
    id: 'CH0002',
    address: '420, KP 69, Quận Thủ Đức, TP HCM',
    phone: '0123456789',
    owner: 'Phan Huy Tiến',
    createdTime: '12022001',
  },
]

export default function AdminBranchPage() {
  const [data, setData] = useState([])
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 8,
    total: 100,
  })
  const [loading, setLoading] = useState(false)
  const [selectedBranchIds, setSelectedBranchIds] = useState([])

  useEffect(() => {
    setData(fakeData)
  }, [])

  const rowSelection = {
    onChange: (selectedRowKeys) => {
      setSelectedBranchIds(selectedRowKeys)
    },
  }

  const columns = [
    {
      ...idColumn('Mã cửa hàng'),
    },
    {
      title: 'Địa chỉ',
      dataIndex: 'address',
    },
    {
      title: 'SDT',
      dataIndex: 'phone',
    },
    {
      title: 'Chủ cửa hàng',
      dataIndex: 'owner',
    },
    {
      ...createTimeColumn,
    },
  ]

  return (
    <MainContainer path="admin/branch">
      <ContentHeader title="Quản lý các chi nhánh">
        <AddButton>Thêm chi nhánh</AddButton>
        {!!selectedBranchIds.length && (
          <DeleteButton>Xóa chi nhánh</DeleteButton>
        )}
      </ContentHeader>
      <AppTable
        dataSource={data}
        pagination={pagination}
        loading={loading}
        rowSelection={rowSelection}
        columns={columns}
      />
    </MainContainer>
  )
}
