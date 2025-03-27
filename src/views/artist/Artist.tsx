import React, { useState, useEffect } from "react";
import { Table, Pagination, message, Button, Modal, Form, Input, Upload, Tag, Space, Popconfirm } from "antd";
import { LockOutlined, UnlockOutlined, UploadOutlined, SearchOutlined } from "@ant-design/icons";
import { getNgheSi, updateNgheSi } from "@/services/ngheSi";

const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/doycy5gbl/image/upload";
const CLOUDINARY_PRESET = "spotify_upload_preset";

const Artist = () => {
  const [artists, setArtists] = useState([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingArtist, setEditingArtist] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchArtists(page, size, searchTerm);
  }, [page, size, searchTerm]);

  const fetchArtists = async (page, size, search) => {
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

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(0);
  };

  const handleToggleStatus = async (artist) => {
    try {
      await updateNgheSi({ is_active: !artist.is_active }, artist.nghe_si_id);
      message.success("Cập nhật trạng thái thành công!");
      fetchArtists(page, size, searchTerm);
    } catch (error) {
      message.error("Lỗi khi cập nhật trạng thái!");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "nghe_si_id", key: "nghe_si_id", width: 80 },
    {
      title: "Ảnh",
      dataIndex: "anh_dai_dien",
      key: "anh_dai_dien",
      render: (url) => (
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
      render: (isActive) => (
        <Tag color={isActive ? "green" : "red"} style={{ fontWeight: "bold" }}>
          {isActive ? "Active" : "Inactive"}
        </Tag>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_, record) => (
        <Space>
          <Popconfirm
            title={`Bạn có chắc muốn ${record.is_active ? "khóa" : "mở khóa"} nghệ sĩ này?`}
            onConfirm={() => handleToggleStatus(record)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="link"
              danger={!record.is_active}
              icon={record.is_active ? <LockOutlined /> : <UnlockOutlined />}
            >
              {record.is_active ? "Khóa" : "Mở khóa"}
            </Button>
          </Popconfirm>
        </Space>
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
    </div>
  );
};

export default Artist;
