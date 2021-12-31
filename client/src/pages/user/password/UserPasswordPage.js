import { Form, Input, message } from "antd";
import { editUser } from "../../../api/user";
import AppButton from "../../../components/AppButton";
import { ContentHeader } from "../../../components/Content";
import { FormGrid, OneColumnFormContainer } from "../../../components/Grid";
import useApiFeedback from "../../../hooks/useApiFeedback";
import useLocalStorage from "../../../hooks/useLocalStorage";
import { fireError } from "../../../utils/feedback";

export default function UserPasswordPage() {
  const [form] = Form.useForm();
  const [user] = useLocalStorage("user");
  const [editUserCall, editLoad] = useApiFeedback();
  return (
    <FormGrid>
      <ContentHeader title="Thay đổi mật khẩu" />
      <OneColumnFormContainer>
        <Form
          form={form}
          name="change-password"
          layout="vertical"
          onFinish={({ mkCu, mkMoi, mkLai }) => {
            if (mkMoi !== mkLai) {
              fireError({
                message: "Mật khẩu nhập lại không trùng mật khẩu mới",
              });
              return;
            }
            if (user?.id) {
              editUserCall(
                editUser(user?.id, {
                  matKhau: mkMoi,
                  matKhauCu: mkCu,
                }),
                () => {
                  form.resetFields();
                  message.success("Thay đổi mật khẩu thành công");
                }
              );
            }
          }}
          autoComplete="off"
        >
          <Form.Item
            label="Mật khẩu cũ"
            name="mkCu"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu cũ",
              },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu mới"
            name="mkMoi"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập mật khẩu mới",
              },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item
            label="Nhập lại mật khẩu"
            name="mkLai"
            rules={[
              {
                required: true,
                message: "Vui lòng nhập lại mật khẩu",
              },
            ]}
          >
            <Input.Password size="large" />
          </Form.Item>
          <Form.Item className="flex-1">
            <AppButton
              loading={editLoad}
              type="done"
              className="w-full mt-4"
              htmlType="submit"
              size="large"
            >
              Hoàn tất
            </AppButton>
          </Form.Item>
        </Form>
      </OneColumnFormContainer>
    </FormGrid>
  );
}
