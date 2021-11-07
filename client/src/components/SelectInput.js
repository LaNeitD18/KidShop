import { Select } from 'antd';
import { idString } from '../utils/string';
const { Option } = Select;

export default function SelectInput({
  data,
  labelField = 'hoTen',
  idField = 'id',
  onSelect,
  idFormat,
  allowClear,
  ...rest
}) {
  const ownerOptions = data.map((d) => ({
    label: `${d[labelField]} (${idString(d[idField], idFormat)})`,
    value: d[idField],
  }));
  return (
    <Select
      size="large"
      showSearch
      placeholder="Chọn..."
      optionFilterProp="title"
      options={ownerOptions}
      onSelect={onSelect}
      allowClear={allowClear}
      {...rest}
    />
  );
}
