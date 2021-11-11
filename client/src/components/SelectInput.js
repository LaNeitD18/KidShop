import { Select } from 'antd';
import { idString } from '../utils/string';
const { Option } = Select;

export default function SelectInput({
  data,
  labelField = 'label',
  idField = 'id',
  onSelect,
  idFormat,
  allowClear = true,
  showSearch = true,
  showId = true,
  ...rest
}) {
  const options = data.map((d) => ({
    label: showId
      ? `${d[labelField]} (${idString(d[idField], idFormat)})`
      : d[labelField],
    value: d[idField],
  }));
  return (
    <Select
      size="large"
      showSearch={showSearch}
      placeholder="Chọn..."
      optionFilterProp="label"
      options={options}
      onSelect={onSelect}
      allowClear={allowClear}
      {...rest}
    />
  );
}
