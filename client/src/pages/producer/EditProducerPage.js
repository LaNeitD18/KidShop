import React, { useEffect } from 'react';
import AppButton from '../../components/AppButton';
import { Form, Input, message } from 'antd';
import { ContentHeader } from '../../components/Content';
import {
  deleteProducer,
  editProducer,
  fetchAProducer,
  createProducer,
} from '../../api/producer';
import useApiFeedback from '../../hooks/useApiFeedback';
import { useNavigate, useParams } from 'react-router-dom';
import { inputRuleNaN } from '../../utils/string';
import { fireSuccessModal, useFireSuccessModal } from '../../utils/feedback';

const addConsts = {
  title: 'Tạo nhà sản xuất',
  okText: 'Hoàn tất',
};

const editConsts = {
  title: 'Sửa nhà sản xuất',
  okText: 'Lưu thay đổi',
};

export default function EditProducerPage({ mode }) {
  const isEdit = mode === 'edit';
  const byModes = isEdit ? editConsts : addConsts;

  const { id } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const { apiCall: getCall } = useApiFeedback();
  const { apiCall: postCall, loading: postLoad } = useApiFeedback();
  const { apiCall: editCall, loading: editLoad } = useApiFeedback();
  const { apiCall: deleteCall, loading: deleteLoad } = useApiFeedback();

  useEffect(() => {
    if (isEdit) {
      getCall(fetchAProducer(id), ({ data }) => {
        form.setFieldsValue(data);
      });
    }
  }, []);

  const onFinish = (values) => {
    if (isEdit) {
      editCall(editProducer(id, values), () => {
        message.success('Đã lưu thay đổi thành công');
      });
    } else {
      postCall(createProducer(values), () => {
        fireSuccessModal({
          title: 'Tạo nhà sản xuất thành công',
          onOk: () => {
            form.resetFields();
          },
          onCancel: () => {
            navigate('../');
          },
        });
      });
    }
  };

  function handleDelete() {
    deleteCall(deleteProducer(id), () => {
      message.success('Đã xóa thành công');
      navigate('../');
    });
  }

  return (
    <div>
      <ContentHeader title={byModes.title}>
        <AppButton type="cancel" responsive>
          Hủy bỏ
        </AppButton>
      </ContentHeader>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 xl:gap-14">
        <div>
          <Form
            form={form}
            name="create-branch"
            layout="vertical"
            onFinish={onFinish}
            autoComplete="off"
          >
            <Form.Item
              label="Tên nhà sản xuất"
              name="tenNSX"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập tên nhà sản xuất',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Địa chỉ"
              requiredMark="optional"
              name="diaChi"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập địa chỉ',
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>
            <Form.Item
              label="Số điện thoại"
              name="sdt"
              requiredMark="optional"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số điện thoại!',
                },
                inputRuleNaN(),
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <div className="xs:flex flex-row-reverse items-center gap-6 mt-8 xs:mt-12">
              <Form.Item className="flex-1">
                <AppButton
                  loading={postLoad || editLoad}
                  type="done"
                  className="w-full"
                  htmlType="submit"
                  size="large"
                >
                  {byModes.okText}
                </AppButton>
              </Form.Item>
              {!!isEdit && (
                <Form.Item className="flex-1">
                  <AppButton
                    onClick={handleDelete}
                    type="delete"
                    className="w-full"
                    size="large"
                    loading={deleteLoad}
                    confirm={{
                      title: 'Bạn có muốn xóa nhà sản xuất này?',
                    }}
                  >
                    Xóa nhà sản xuất
                  </AppButton>
                </Form.Item>
              )}
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}
