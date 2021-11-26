import React, { useEffect, useRef, useState } from "react";
import AppButton from "../../../components/AppButton";
import { Button, Form, Image, Input, message, Tooltip, Upload } from "antd";
import { ContentHeader } from "../../../components/Content";
import {
  deleteStore,
  editStore,
  getStore,
  postStore,
} from "../../../api/store";
import { getUserList } from "../../../api/user";
import { SelectInput, UploadImageInput } from "../../../components/Inputs";
import useApiFeedback from "../../../hooks/useApiFeedback";
import { useNavigate, useParams } from "react-router-dom";
import { inputRuleNaN } from "../../../utils/string";
import { fireError, fireSuccessModal } from "../../../utils/feedback";
import { FormGrid } from "../../../components/Grid";

import classNames from "classnames";
import { ExpandableImage } from "../../../components/Images";

const addConsts = {
  title: "Tạo mặt hàng",
  okText: "Hoàn tất",
};

const editConsts = {
  title: "Sửa mặt hàng",
  okText: "Lưu thay đổi",
};

export default function EditProductPage({ mode }) {
  const isEdit = mode === "edit";
  const byModes = isEdit ? editConsts : addConsts;

  const { branchId } = useParams();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  const { apiCall: getCall } = useApiFeedback();
  const { apiCall: postCall, loading: postLoad } = useApiFeedback();
  const { apiCall: editCall, loading: editLoad } = useApiFeedback();
  const { apiCall: deleteCall, loading: deleteLoad } = useApiFeedback();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUserList().then((res) => {
      setUsers(res.data);
    });
  }, []);

  useEffect(() => {
    if (isEdit) {
      getCall(getStore(branchId), ({ data }) => {
        form.setFieldsValue({
          ...data,
          idChuCuaHang: data?.chuCuaHang?.id,
        });
      });
    }
  }, []);

  const onFinish = (values) => {
    const dto = {
      ...values,
    };
    console.log(dto);
    if (isEdit) {
      editCall(editStore(branchId, dto), () => {
        message.success("Đã lưu thay đổi thành công");
      });
    } else {
      postCall(postStore(dto), () => {
        fireSuccessModal({
          title: "Tạo mặt hàng thành công",
          onOk: () => {
            form.resetFields();
          },
          onCancel: () => {
            navigate("../");
          },
        });
      });
    }
  };

  function handleDelete() {
    deleteCall(deleteStore(branchId), () => {
      message.success("Đã xóa thành công");
      navigate("../");
    });
  }

  const [imgUrl, setImgUrl] = useState(null);

  return (
    <div>
      <ContentHeader title={byModes.title}>
        <AppButton type="cancel" responsive>
          Hủy bỏ
        </AppButton>
      </ContentHeader>
      <Form
        form={form}
        name="create-branch"
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <FormGrid column={2}>
          <div>
            <ExpandableImage src={imgUrl} />
            <div className="mb-4" />
            <Form.Item label="Ảnh sản phẩm">
              <UploadImageInput onValueChange={setImgUrl} />
            </Form.Item>
          </div>

          <div>
            <Form.Item
              label="Địa chỉ"
              requiredMark="optional"
              name="diaChi"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập địa chỉ",
                },
              ]}
            >
              <Input size="large" />
            </Form.Item>

            <Form.Item
              label="Chủ cửa hàng"
              name="idChuCuaHang"
              requiredMark="optional"
              rules={[
                {
                  required: true,
                  message: "Vui lòng chọn chủ cửa hàng",
                },
              ]}
            >
              <SelectInput
                data={users.map((u) => ({
                  label: u.hoTen,
                  value: u.id,
                }))}
              />
            </Form.Item>

            <Form.Item
              label="Số điện thoại"
              name="sdt"
              requiredMark="optional"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập số điện thoại!",
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
                      title: "Bạn có muốn xóa mặt hàng này?",
                    }}
                  >
                    Xóa mặt hàng
                  </AppButton>
                </Form.Item>
              )}
            </div>
          </div>
        </FormGrid>
      </Form>
    </div>
  );
}
