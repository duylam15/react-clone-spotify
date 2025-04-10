import React, { useEffect, useState } from "react";
import {
  Table,
  Modal,
  Button,
  message,
  Tag,
  Descriptions,
  Popconfirm,
  Avatar,
} from "antd";
import axios from "axios";

interface User {
  nguoi_dung_id: number;
  ten_hien_thi: string;
  email: string;
  so_dien_thoai: string;
  is_active: boolean;
  avatar_url?: string;
  is_staff?: boolean;
  ngay_tao?: string;
  ngay_sinh?: string;
  gioi_tinh?: string;
}

const UserPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 5 });


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        "http://127.0.0.1:8000/nguoidung/api/danh-sach-nguoi-dung/"
      );
      console.log("Danh sách người dùng:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách người dùng:", error);
    } finally {
      setLoading(false);
    }
  };

  const showUserDetails = async (id: number) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:8000/nguoidung/api/chi-tiet-nguoi-dung/${id}/`
      );
      setSelectedUser(response.data);
      setModalVisible(true);
    } catch (error) {
      console.error("Lỗi khi lấy chi tiết người dùng:", error);
    }
  };

  const handleToggleLock = async (id: number, shouldUnlock: boolean) => {
    try {
      const action = shouldUnlock ? "unlock" : "lock";
      await axios.patch(
        `http://127.0.0.1:8000/nguoidung/api/khoa-tai-khoan/${id}/${action}/`
      );
      message.success(`${shouldUnlock ? "Mở" : "Khóa"} tài khoản thành công`);
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi cập nhật trạng thái tài khoản:", error);
      message.error("Cập nhật trạng thái tài khoản thất bại");
    }
  };

  const handleToggleAdmin = async (id: number, currentRole: boolean = false) => {
    try {
      const newRole = !currentRole;
      await axios.patch(
        `http://127.0.0.1:8000/nguoidung/api/cap-nhat-vai-tro/${id}/`,
        {
          is_staff: newRole,
        }
      );
      message.success(
        newRole
          ? "Cấp quyền quản trị viên thành công"
          : "Gỡ quyền quản trị viên thành công"
      );
      fetchUsers();
    } catch (error) {
      console.error("Lỗi khi thay đổi vai trò:", error);
      message.error("Thay đổi vai trò thất bại");
    }
  };

  const columns = [
    {
      title: "STT",
      key: "stt",
      width: 70, 
      align: "center", 
      render: (_: any, __: any, index: number) => (pagination.current - 1) * pagination.pageSize + index + 1,
    },
    {
      title: "Ảnh đại diện",
      dataIndex: "avatar_url",
      key: "avatar_url",
      render: (url: string) => (
        <Avatar src={url} shape="circle" size="large" alt="avatar" />
      ),
    },
    {
      title: "Tên hiển thị",
      dataIndex: "ten_hien_thi",
      key: "ten_hien_thi",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Số điện thoại",
      dataIndex: "so_dien_thoai",
      key: "so_dien_thoai",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (active: boolean) => (
        <Tag color={active ? "green" : "red"}>
          {active ? "Hoạt động" : "Đã khóa"}
        </Tag>
      ),
    },
    {
      title: "Vai trò",
      dataIndex: "is_staff",
      key: "is_staff",
      render: (role: boolean) => (
        <Tag color={role === true ? "geekblue" : "default"}>
          {role === true ? "Quản trị viên" : "Người dùng"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_: any, record: User) => (
        <>
          <Button
            type="link"
            onClick={() => showUserDetails(record.nguoi_dung_id)}
          >
            Xem chi tiết
          </Button>
          <Popconfirm
            title={`Bạn có chắc chắn muốn ${
              record.is_active ? "khóa" : "mở khóa"
            } tài khoản này không?`}
            onConfirm={() =>
              handleToggleLock(record.nguoi_dung_id, !record.is_active)
            }
            okText="Có"
            cancelText="Không"
          >
            <Button type="link" danger={!record.is_active}>
              {record.is_active ? "Khóa" : "Mở khóa"}
            </Button>
          </Popconfirm>
          <Popconfirm
            title={`Bạn có chắc muốn ${
              record.is_staff === true ? "gỡ quyền" : "cấp quyền"
            } quản trị viên?`}
            onConfirm={() =>
              handleToggleAdmin(record.nguoi_dung_id, record.is_staff)
            }
            okText="Xác nhận"
            cancelText="Hủy"
          >
            <Button
              type="link"
              style={{ color: record.is_staff === true ? "#faad14" : "#1890ff" }}
            >
              {record.is_staff === true ? "" : "Cấp quyền Admin"}
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16 }}>Quản lý người dùng</h1>
      <Table
         dataSource={users}
         columns={columns}
         rowKey="nguoi_dung_id"
         loading={loading}
         bordered
         pagination={{
           current: pagination.current,
           pageSize: pagination.pageSize,
           onChange: (page, pageSize) => {
             setPagination({ current: page, pageSize });
           },
         }}
         scroll={{ y: 340 }}
      />
      <Modal
        title="Chi tiết người dùng"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        {selectedUser && (
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Ảnh đại diện">
              <Avatar src={selectedUser.avatar_url} size={64} />
            </Descriptions.Item>
            <Descriptions.Item label="ID người dùng">
              {selectedUser.nguoi_dung_id}
            </Descriptions.Item>
            <Descriptions.Item label="Tên hiển thị">
              {selectedUser.ten_hien_thi}
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              {selectedUser.email}
            </Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">
              {selectedUser.so_dien_thoai}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={selectedUser.is_active ? "green" : "red"}>
                {selectedUser.is_active ? "Hoạt động" : "Đã khóa"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag
                color={selectedUser.is_staff === true ? "geekblue" : "default"}
              >
                {selectedUser.is_staff === true
                  ? "Quản trị viên"
                  : "Người dùng"}
              </Tag>
            </Descriptions.Item>
            {"ngay_tao" in selectedUser && (
              <Descriptions.Item label="Ngày tạo tài khoản">
                {new Date(
                  selectedUser.ngay_tao || ""
                ).toLocaleDateString("vi-VN")}
              </Descriptions.Item>
            )}
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default UserPage;
