import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Pagination, message, Button, Modal, Form, Input, Upload, Tag, Space, Popconfirm } from "antd";
import { LockOutlined, SearchOutlined, UnlockOutlined, UploadOutlined } from "@ant-design/icons";
import { addBaiHat, getBaiHat_PhanTrang, updateBaiHat } from "@/services/songAPI";
import { Song } from "@/types/types";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { Select } from "antd";
const { Option } = Select;



// Định nghĩa kiểu dữ liệu
interface BaiHat {
  bai_hat_id: number;
  ten_bai_hat: string;
  the_loai: number;
  file_bai_hat: string;    // URL có thể phát
  duong_dan: string;       // URL gốc/lưu trữ
  loi_bai_hat: string;
  thoi_luong: number;      // Tính bằng giây
  ngay_phat_hanh: string;  // Định dạng YYYY-MM-DD (ISO)
  nghe_si: number;         // ID nghệ sĩ
  album: number;           // ID album
  is_active: boolean;
  trang_thai_duyet: string;
}
interface NgheSi {
  nghe_si_id: number;
  ten_nghe_si: string;
}

export interface TheLoai {
  loai_bai_hat_id: number;
  ten_loai: string;
  mo_ta: string;
  created_at: string;
  updated_at: string;
}


const SongAdmin: React.FC = () => {
  const [songs, setSongs] = useState<BaiHat[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSong, setEditingSong] = useState<BaiHat | null>(null);
  const [form] = Form.useForm();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [updating, setUpdating] = useState(false);

  const [theLoais, setTheLoais] = useState<TheLoai[]>([]);

  useEffect(() => {
    fetchSongs(page, size, searchTerm);
    fetchTheLoais();
  }, [page, size, searchTerm]);

  const fetchTheLoais = async () => {
    try {
      const response = await axios.get("http://localhost:8000/loaibaihat/");
      setTheLoais(response.data);
    } catch (error) {
      message.error("Lỗi khi tải danh sách thể loại!");
    }
  };

  const fetchSongs = async (page: number, size: number, search: string) => {
    setLoading(true);
    try {
      const response = await getBaiHat_PhanTrang(page, size, search);
      setSongs(response.data);
      setTotal(response.total_items);
    } catch (error) {
      message.error("Lỗi khi tải danh sách nghệ sĩ!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  function formatDuration(seconds: number): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    let result = [];

    if (hours > 0) {
      result.push(`${hours} tiếng`);
    }
    if (minutes > 0) {
      result.push(`${minutes} phút`);
    }
    if (secs > 0 || result.length === 0) {
      result.push(`${secs} giây`);
    }

    return result.join(" ");
  }


  console.log("Danh sách bài hát:", songs); // Kiểm tra dữ liệu

  const showEditModal = (song: BaiHat) => {
    setEditingSong(song);
    setSelectedFile(null); // reset file mỗi khi mở modal
    form.setFieldsValue({
      ...song,
      the_loai: song.the_loai,
      ngay_phat_hanh: dayjs(song.ngay_phat_hanh),
      trang_thai_duyet: song.trang_thai_duyet, 
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
  
      // Kiểm tra ngày
      const today = dayjs();
      if (values.ngay_phat_hanh && dayjs(values.ngay_phat_hanh).isAfter(today)) {
        message.error("Ngày phát hành không được vượt quá hôm nay!");
        return;
      }
  
      setUpdating(true);
      const formData = new FormData();
  
      for (const key in values) {
        if (key === "ngay_phat_hanh") {
          formData.append(key, values[key].format("YYYY-MM-DD"));
        } else {
          formData.append(key, values[key]);
        }
      }
  
      if (selectedFile) {
        formData.append("file_bai_hat", selectedFile);
      }
  
      if (editingSong) {
        // 👉 Nếu đang sửa
        await updateBaiHat(formData, editingSong.bai_hat_id);
        message.success("Cập nhật bài hát thành công!");
      } else {
        // 👉 Nếu đang thêm mới
        await addBaiHat(formData);
        message.success("Thêm bài hát thành công!");
      }
  
      setIsModalOpen(false);
      fetchSongs(page, size, searchTerm);
      setSelectedFile(null);
      form.resetFields();
    } catch (error) {
      message.error("Lỗi khi gửi bài hát!");
    } finally {
      setUpdating(false);
    }
  };

  const handleToggleStatus = async (song: BaiHat) => {
    try {
      await updateBaiHat({ is_active: !song.is_active }, song.bai_hat_id);
      message.success("Cập nhật trạng thái thành công!");
      fetchSongs(page, size, searchTerm);
    } catch (error) {
      message.error("Lỗi khi cập nhaật trạng thái!");
    }
  };


  const columns = [
    { title: "ID", dataIndex: "bai_hat_id", key: "bai_hat_id" },
    { title: "Tên bài hát", dataIndex: "ten_bai_hat", key: "ten_bai_hat" },
    {
      title: "Thể loại", dataIndex: "the_loai", key: "the_loai", render: (_: any, record: BaiHat) => {
        const loai = theLoais.find((tl) => tl.loai_bai_hat_id == record.the_loai);
        return loai ? loai.ten_loai : record.the_loai;
      },
    },
    { title: "Thời lượng", dataIndex: "thoi_luong", key: "thoi_luong", render: (seconds: number) => formatDuration(seconds) },
    { title: "ID nghệ sĩ", dataIndex: "nghe_si", key: "nghe_si" },
    {
      title: "Ngày phát hành", dataIndex: "ngay_phat_hanh", key: "ngay_phat_hanh",
      render: (text: string) => new Date(text).toLocaleDateString("vi-VN"),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean) => (
        <Tag color={isActive ? "green" : "red"} style={{ fontWeight: "bold" }}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái duyệt",
      dataIndex: "trang_thai_duyet",
      key: "trang_thai_duyet",
      render: (value: string) => {
        const color = value === "approved" ? "green" : value === "pending" ? "gold" : "red";
        return <Tag color={color} style={{ fontWeight: "bold" }}>{value.toUpperCase()}</Tag>;
      }
    },
    
    {
      title: "Hành động",
      key: "action",
      render: (_, record: BaiHat) => (
        <div className="action-buttons">
          <Button type="link" onClick={() => showEditModal(record)} className="edit-button">
            Sửa
          </Button>
          <Popconfirm
            title={`Bạn có chắc muốn ${record.is_active ? "khóa" : "mở khóa"} bài hát này?`}
            onConfirm={() => handleToggleStatus(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="link"
              danger={!record.is_active}
              className="lock-button"
              icon={record.is_active ? <LockOutlined /> : <UnlockOutlined />}
            >
              {record.is_active ? "Khóa" : "Mở khóa"}
            </Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div>
      <h2>Danh sách bài hát</h2>
      <div className="flex justify-between items-center ">
      <Input
        placeholder="Tìm kiếm bài hát..."
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Button
        type="primary"
        style={{ marginBottom: 16 }}
        onClick={() => {
          form.resetFields();
          setEditingSong(null);
          setSelectedFile(null);
          setIsModalOpen(true);
        }}
      >
        Thêm bài hát
      </Button>
      </div>
      <Table
        columns={columns}
        dataSource={songs}
        rowKey="nghe_si_id"
        loading={loading}
        pagination={false}
      />
      <Pagination
        current={page + 1}
        pageSize={size}
        total={total}
        onChange={(p) => setPage(p - 1)}
        showSizeChanger={false}
        showQuickJumper
        style={{ marginTop: 16, textAlign: "right" }}
      />

      {/* Modal chỉnh sửa bài hát */}
      <Modal
        title={editingSong ? "Chỉnh sửa bài hát" : "Thêm bài hát"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        confirmLoading={updating} // 👉 hiệu ứng loading
      >
        <Form form={form} layout="vertical" encType="multipart/form-data">
          <Form.Item name="ten_bai_hat" label="Tên bài hát" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item
            name="the_loai"
            label="Thể loại"
            rules={[{ required: true, message: "Vui lòng chọn thể loại!" }]}
          >
            <Select placeholder="Chọn thể loại">
              {theLoais.map((tl) => (
                <Option key={tl.loai_bai_hat_id} value={tl.loai_bai_hat_id}>
                  {tl.ten_loai}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="ngay_phat_hanh"
            label="Ngày phát hành"
            rules={[{ required: true, message: "Vui lòng chọn ngày phát hành!" }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="YYYY-MM-DD"
              disabledDate={(current) => current && current > dayjs().endOf("day")}
            />
          </Form.Item>
          <Form.Item name="nghe_si" label="ID nghệ sĩ">
            <Input />
          </Form.Item>
          {editingSong && (
                <Form.Item
                  name="trang_thai_duyet"
                  label="Trạng thái duyệt"
                  rules={[{ required: true }]}
                >
                  <Select>
                    <Option value="pending">Pending</Option>
                    <Option value="approved">Approved</Option>
                    <Option value="rejected">Rejected</Option>
                  </Select>
                </Form.Item>
              )}
          <Form.Item label="Tệp bài hát">
            <Upload
              beforeUpload={(file) => {
                setSelectedFile(file);
                return false; // Ngăn Ant Design upload tự động
              }}
              maxCount={1}
            >
              <Button icon={<UploadOutlined />}>Chọn file nhạc</Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>
    </div >
  );
};

export default SongAdmin;
