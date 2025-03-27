import React, { useState, useEffect } from "react";
import { Table, Pagination, message, Button, Modal, Form, Input, Upload, Tag, Space, Popconfirm } from "antd";
import { LockOutlined, SearchOutlined, UnlockOutlined, UploadOutlined } from "@ant-design/icons";
import { getNgheSi, lockNgheSi, unlockNgheSi, updateNgheSi } from "@/services/ngheSi";

interface NgheSi {
  nghe_si_id: number;
  ten_nghe_si: string;
  tieu_su: string;
  ngay_sinh: string;
  quoc_gia: string;
  anh_dai_dien: string; // URL ảnh đại diện
  is_active: boolean;
}

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/doycy5gbl/image/upload";
const CLOUDINARY_PRESET = "spotify_upload_preset"; // Thay bằng upload preset của bạn

const Artist: React.FC = () => {
  const [artists, setArtists] = useState<NgheSi[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState<NgheSi | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchArtists(page, size, searchTerm);
  }, [page, size, searchTerm]);

  const fetchArtists = async (page: number, size: number, search: string) => {
    setLoading(true);
    try {
      const response = await getNgheSi(page, size, search);
      setArtists(response.data);
      setTotal(response.total_items);
    } catch (error) {
      message.error("Lỗi khi tải danh sách nghệ sĩ!");
    } finally {
      setLoading(false);
    }
  };

  const showEditModal = (artist: NgheSi) => {
    setEditingArtist(artist);
    form.setFieldsValue(artist);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      await updateNgheSi(values, editingArtist?.nghe_si_id);
      message.success("Cập nhật nghệ sĩ thành công!");
      setIsModalOpen(false);
      fetchArtists(page, size, searchTerm);
    } catch (error) {
      message.error("Lỗi khi cập nhật nghệ sĩ!");
    }
  };

  const handleToggleStatus = async (artist: NgheSi) => {
    try {
      await updateNgheSi({ is_active: !artist.is_active }, artist.nghe_si_id);
      message.success("Cập nhật trạng thái thành công!");
      fetchArtists(page, size, searchTerm);
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_PRESET);

    try {
      const res = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      console.log("data CLOud: ", data)
      const imageUrl = data.secure_url;
      form.setFieldsValue({ anh_dai_dien: imageUrl });
      message.success("Tải ảnh lên thành công!");
    } catch (error) {
      console.log(error);
      message.error("Lỗi khi tải ảnh lên Cloudinary!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "nghe_si_id", key: "nghe_si_id", width: 80 },
    {
      title: "Ảnh",
      dataIndex: "anh_dai_dien",
      key: "anh_dai_dien",
      render: (url: string) => (
        <img src={url} alt="Ảnh đại diện" style={{ width: 50, height: 50, borderRadius: "50%" }} />
      ),
    },
    { title: "Tên nghệ sĩ", dataIndex: "ten_nghe_si", key: "ten_nghe_si" },
    { title: "Quốc gia", dataIndex: "quoc_gia", key: "quoc_gia" },
    { title: "Ngày sinh", dataIndex: "ngay_sinh", key: "ngay_sinh" },
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
      title: "Hành động",
      key: "action",
      render: (_, record: NgheSi) => (
        <div className="action-buttons">
          <Button type="link" onClick={() => showEditModal(record)} className="edit-button">
            Sửa
          </Button>
          <Popconfirm
            title={`Bạn có chắc muốn ${record.is_active ? "khóa" : "mở khóa"} nghệ sĩ này?`}
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
      <h2>Danh sách Nghệ Sĩ</h2>
      <Input
        placeholder="Tìm kiếm nghệ sĩ..."
        prefix={<SearchOutlined />} 
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={artists}
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

      {/* Modal chỉnh sửa nghệ sĩ */}
      <Modal
        title="Chỉnh sửa Nghệ Sĩ"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ten_nghe_si" label="Tên nghệ sĩ" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ngay_sinh" label="Ngày sinh" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="quoc_gia" label="Quốc gia" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tieu_su" label="Tiểu sử">
            <Input.TextArea />
          </Form.Item>

          {/* Upload ảnh */}
          <Form.Item name="anh_dai_dien" label="Ảnh đại diện">
            <Upload
              beforeUpload={(file) => {
                handleUpload(file);
                return false;
              }}
              showUploadList={false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {form.getFieldValue("anh_dai_dien") && (
              <img
                src={form.getFieldValue("anh_dai_dien")}
                alt="Ảnh đại diện"
                style={{ width: 80, height: 80, marginTop: 10, borderRadius: "50%" }}
              />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Artist;