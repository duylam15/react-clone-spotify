import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message } from "antd";
import axios from "axios";

// Định nghĩa kiểu dữ liệu cho bài hát
interface BaiHat {
  id: number;
  ten_bai_hat: string;
  nghe_si: string;
}

const SongAdmin: React.FC = () => {
  const [songs, setSongs] = useState<BaiHat[]>([]); // Không để là undefined/null
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<BaiHat | null>(null);

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/baihat/baihat/");
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
  

  const handleEdit = (record: BaiHat) => {
    setSelectedSong(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:8000/baihat/baihat/${id}/`);
      message.success("Xóa bài hát thành công!");
      fetchSongs();
    } catch (error) {
      message.error("Lỗi khi xóa bài hát!");
    }
  };

  const handleUpdate = async (values: BaiHat) => {
    if (!selectedSong) return;
    try {
      await axios.put(`http://localhost:8000/baihat/baihat/capnhat/${selectedSong.id}/`, values);
      message.success("Cập nhật bài hát thành công!");
      setIsModalVisible(false);
      fetchSongs();
    } catch (error) {
      message.error("Lỗi khi cập nhật bài hát!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên bài hát", dataIndex: "ten_bai_hat", key: "ten_bai_hat" },
    { title: "Nghệ sĩ", dataIndex: "nghe_si", key: "nghe_si" },
    {
      title: "Hành động",
      key: "action",
      render: (record: BaiHat) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Button type="primary" danger onClick={() => handleDelete(record.id)}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Bài Hát</h2>
      <Table columns={columns} dataSource={songs} rowKey="id" />

      <Modal
        title="Cập nhật bài hát"
        visible={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form initialValues={selectedSong!} onFinish={handleUpdate}>
          <Form.Item name="ten_bai_hat" label="Tên bài hát" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nghe_si" label="Nghệ sĩ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit">Lưu</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default SongAdmin;
