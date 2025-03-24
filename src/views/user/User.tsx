import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Descriptions, message } from "antd";
import axios from "axios";

// Định nghĩa kiểu dữ liệu
interface User {
  nguoi_dung_id: number;
  ten_hien_thi: string;
  email: string;
  so_dien_thoai: string;
  is_active: boolean;
}

const User: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  // Lấy danh sách người dùng
  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://localhost:8000/nguoidung/api/danh-sach-nguoi-dung/");
      if (Array.isArray(response.data)) {
        setUsers(response.data);
      } else {
        console.error("API không trả về mảng!", response.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải người dùng:", error);
      setUsers([]);
    }
  };

  const fetchUserDetails = async (nguoi_dung_id: number) => {
    try {
      const response = await axios.get(`http://localhost:8000/nguoidung/api/chi-tiet-nguoi-dung/${nguoi_dung_id}/`);
      setSelectedUser(response.data);
      setIsModalVisible(true);
    } catch (error) {
      message.error("Lỗi khi tải chi tiết người dùng!");
    }
  };

  const handleLock = async (nguoi_dung_id: number) => {
    try {
      await axios.patch(`http://localhost:8000/nguoidung/api/khoa-tai-khoan/${nguoi_dung_id}/lock/`);
      message.success("Khóa tài khoản thành công!");
      fetchUsers();
    } catch (error) {
      message.error("Lỗi khi khóa tài khoản!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "nguoi_dung_id", key: "nguoi_dung_id" },
    { title: "Tên hiển thị", dataIndex: "ten_hien_thi", key: "ten_hien_thi" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Số điện thoại", dataIndex: "so_dien_thoai", key: "so_dien_thoai" },
    {
      title: "Hành động",
      key: "action",
      render: (record: User) => (
        <>
          <Button type="primary" onClick={() => fetchUserDetails(record.nguoi_dung_id)}>Xem</Button>
          <Button type="primary" danger onClick={() => handleLock(record.nguoi_dung_id)}>Khóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Người Dùng</h2>
      <Table columns={columns} dataSource={users} rowKey="nguoi_dung_id" />

      {/* Modal chi tiết người dùng */}
      <Modal
        title="Chi tiết người dùng"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={800} // Tăng chiều rộng modal
        style={{ top: "20%" }} // Dịch modal xuống để không bị che
      >
        {selectedUser && (
          <Descriptions bordered>
            <Descriptions.Item label="ID">{selectedUser.nguoi_dung_id}</Descriptions.Item>
            <Descriptions.Item label="Tên hiển thị">{selectedUser.ten_hien_thi}</Descriptions.Item>
            <Descriptions.Item label="Email">{selectedUser.email}</Descriptions.Item>
            <Descriptions.Item label="Số điện thoại">{selectedUser.so_dien_thoai}</Descriptions.Item>
            <Descriptions.Item label="Trạng thái">{selectedUser.is_active ? "Hoạt động" : "Bị khóa"}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  );
};

export default User;