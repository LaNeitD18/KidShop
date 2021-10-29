import { Typography, Table } from 'antd'
import Moment from 'react-moment'
import { withKeys } from '../utils/get'

export const AppTable = ({ dataSource, ...rest }) => (
  <Table dataSource={withKeys(dataSource)} {...rest} />
)

export const idColumn = (title) => {
  return {
    title: title,
    dataIndex: 'id',
    render: (id) => <a className="font-semibold">{id}</a>,
  }
}

export const createTimeColumn = {
  title: 'Ngày tạo',
  dataIndex: 'createdTime',
  render: (createdTime) => (
    <Moment parse="DDMMYYYY" fromNow>
      {createdTime}
    </Moment>
  ),
}
