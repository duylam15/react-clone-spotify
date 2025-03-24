import React, { useState, useEffect } from "react";
import { Table, Button, Modal, Form, Input, message, Select } from "antd";
import axios from "axios";

const { Option } = Select;

// Định nghĩa kiểu dữ liệu
interface BaiHat {
  bai_hat_id: number;
  ten_bai_hat: string;
  nghe_si: number;
}

interface NgheSi {
  nghe_si_id: number;
  ten_nghe_si: string;
}

const SongAdmin: React.FC = () => {
  const [songs, setSongs] = useState<BaiHat[]>([]);
  const [artists, setArtists] = useState<NgheSi[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedSong, setSelectedSong] = useState<BaiHat | null>(null);

  useEffect(() => {
    fetchSongs();
    fetchArtists();
  }, []);

  // Lấy danh sách bài hát
  const fetchSongs = async () => {
    try {
      const response = await axios.get("http://localhost:8000/baihat/baihat/");
      if (Array.isArray(response.data)) {
        setSongs(response.data);
      } else {
        console.error("API không trả về mảng!", response.data);
        setSongs([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải bài hát:", error);
      setSongs([]);
    }
  };

  // Lấy danh sách nghệ sĩ
  const fetchArtists = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/nghesi/list/");
      if (Array.isArray(response.data)) {
        setArtists(response.data);
      } else {
        console.error("API không trả về mảng!", response.data);
        setArtists([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải nghệ sĩ:", error);
      setArtists([]);
    }
  };

  const getArtistName = (nghe_si_id: string | number) => {
    const artist = artists.find((a) => a.nghe_si_id === Number(nghe_si_id)); // Chuyển về number
    return artist ? artist.ten_nghe_si : "Không xác định";
  };

  const handleEdit = (record: BaiHat) => {
    setSelectedSong(record);
    setIsModalVisible(true);
  };

  const handleDelete = async (bai_hat_id: number) => {
    try {
      await axios.delete(`http://localhost:8000/baihat/baihat/${bai_hat_id}/`);
      message.success("Xóa bài hát thành công!");
      fetchSongs();
    } catch (error) {
      message.error("Lỗi khi xóa bài hát!");
    }
  };

  const handleUpdate = async (values: BaiHat) => {
    if (!selectedSong) return;
    console.log("Giá trị cập nhật:", values); // Kiểm tra dữ liệu
    try {
      await axios.put(
        `http://localhost:8000/baihat/baihat/capnhat/${selectedSong.bai_hat_id}/`,
        { ...values, nghe_si: Number(values.nghe_si) } // Đảm bảo là số
      );
      message.success("Cập nhật bài hát thành công!");
      setIsModalVisible(false);
      fetchSongs();
    } catch (error) {
      console.error("Lỗi khi cập nhật bài hát:", error);
      message.error("Lỗi khi cập nhật bài hát!");
    }
  };
  

  const columns = [
    { title: "ID", dataIndex: "bai_hat_id", key: "bai_hat_id" },
    { title: "Tên bài hát", dataIndex: "ten_bai_hat", key: "ten_bai_hat" },
    {
      title: "Nghệ sĩ",
      dataIndex: "nghe_si",
      key: "nghe_si",
      render: (nghe_si: number) => {
        console.log("ID nghệ sĩ:", nghe_si);
        return getArtistName(nghe_si);
      },
    },
    {
      title: "Hành động",
      key: "action",
      render: (record: BaiHat) => (
        <>
          <Button type="primary" onClick={() => handleEdit(record)}>Sửa</Button>
          <Button type="primary" danger onClick={() => handleDelete(record.bai_hat_id)}>Xóa</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <h2>Quản lý Bài Hát</h2>
      <Table columns={columns} dataSource={songs} rowKey="bai_hat_id" />

      {/* Modal cập nhật */}
      <Modal
        title="Cập nhật bài hát"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form initialValues={selectedSong!} onFinish={handleUpdate}>
          <Form.Item name="ten_bai_hat" label="Tên bài hát" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="nghe_si" label="Nghệ sĩ" rules={[{ required: true }]}>
            <Select>
              {artists.map((artist) => (
                <Option key={artist.nghe_si_id} value={artist.nghe_si_id}>
                  {artist.ten_nghe_si}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Button type="primary" htmlType="submit">Lưu</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default SongAdmin;
