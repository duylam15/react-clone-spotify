import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

// Định nghĩa kiểu dữ liệu cho loại bài hát
interface LoaiBaiHat {
  loai_bai_hat_id: number;
  ten_loai: string;
  mo_ta: string;
  created_at: Date;
  updated_at: Date;
}

const TypeSong: React.FC = () => {
  const [songs, setSongs] = useState<LoaiBaiHat[]>([]); // Không để là undefined/null
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<LoaiBaiHat | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/loaibaihat/");
      if (Array.isArray(response.data)) {
        setSongs(response.data);
      } else {
        console.error("Lỗi: API không trả về một mảng!", response.data);
        setSongs([]); // Đặt thành mảng rỗng nếu dữ liệu không hợp lệ
      }
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài hát:", error);
      setSongs([]); // Đảm bảo dữ liệu không bị undefined
    }
  };
  

  const handleEdit = (record: LoaiBaiHat) => {
    setSelectedSong(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (loai_bai_hat_id: number) => {
    try {
      await axios.delete(`http://localhost:8000/loaibaihat/xoa/${loai_bai_hat_id}/`);
      message.success("Xóa bài hát thành công!");
      fetchSongs();
    } catch (error) {
      message.error("Lỗi khi xóa bài hát!");
    }
  };

  const handleUpdate = async (values: LoaiBaiHat) => {
    if (!selectedSong) return;
    try {
      await axios.put(`http://localhost:8000/loaibaihat/capnhat/${selectedSong.loai_bai_hat_id}/`, values);
      message.success("Cập nhật bài hát thành công!");
      setIsModalVisible(false);
      fetchSongs();
    } catch (error) {
      message.error("Lỗi khi cập nhật bài hát!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên loại bài hát", dataIndex: "ten_loai", key: "ten_loai" },
    { title: "Mô tả", dataIndex: "mo_ta", key: "mo_ta" },
    { title: "Ngày tạo", dataIndex: "created_at", key: "created_at" },
    {
      title: "Hành động",
      key: "action",
      render: (record: LoaiBaiHat) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Button type="primary" danger onClick={() => handleDelete(record.loai_bai_hat_id)}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Loại Bài Hát</h2>
      <Table columns={columns} dataSource={songs} rowKey="id" />

      <Modal
        title="Cập nhật loại bài hát"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form initialValues={selectedSong!} onFinish={handleUpdate}>
          <Form.Item name="ten_loai" label="Tên loại bài hát" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="mo_ta" label="mo_ta sĩ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Lưu</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default TypeSong;
