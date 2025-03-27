import React, { useState, useEffect } from "react";
import { Table, Pagination, message, Button, Modal, Form, Input, Upload, Tag, Space, Popconfirm } from "antd";
import { getAlbum, updateAlbum } from "@/services/album";
import { LockOutlined, SearchOutlined, UnlockOutlined, UploadOutlined } from "@ant-design/icons";
import dayjs from 'dayjs';
import { DatePicker } from "antd";


const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/doycy5gbl/image/upload";
const CLOUDINARY_PRESET = "spotify_upload_preset";

interface Album {
  album_id: number;
  ten_album: string;
  anh_bia: string | null;
  ngay_phat_hanh: string | null;
  the_loai: string | null;
  is_active: boolean;
  created_at: string | null;
  updated_at: string | null;
  nghe_si: number;
}

const Album: React.FC = () => {
  const [albums, setAlbums] = useState<Album[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAlbum, setEditingAlbum] = useState<Album | null>(null);


  useEffect(() => {
    fetchAlbums(page, size, searchTerm);
  }, [page, size, searchTerm]);

  const fetchAlbums = async (page: number, size: number, search: string) => {
    setLoading(true);
    try {
      const response = await getAlbum(page, size, search);
      setAlbums(response.data);
      setTotal(response.total_items);
    } catch (error) {
      message.error("Lỗi khi tải danh sách album!");
    } finally {
      setLoading(false);
    }
  };

  // const showEditModal = (album: Album) => {
  //   console.log("Album sus", album);
  //   form.setFieldsValue({
  //     ten_album: album?.ten_album || "",
  //     the_loai: album?.the_loai || "",
  //     ngay_phat_hanh: album?.ngay_phat_hanh || "",
  //     anh_bia: album?.anh_bia || ""
  // });
  //   setEditingAlbum(album);
  //   form.setFieldsValue(album);
  //   setIsModalOpen(true);
  // };

  const showEditModal = (album: Album) => {
    console.log("Album received:", album);

    const formattedAlbum = {
      ...album,
      ngay_phat_hanh: album.ngay_phat_hanh ? dayjs(album.ngay_phat_hanh) : null,
    };

    form.resetFields(); // Reset form trước khi set lại giá trị mới
    form.setFieldsValue(formattedAlbum);

    setEditingAlbum(formattedAlbum);
    setIsModalOpen(true);
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
  
      // Chuyển đổi ngày phát hành về dạng YYYY-MM-DD
      const formattedValues = {
        ...values,
        ngay_phat_hanh: values.ngay_phat_hanh ? values.ngay_phat_hanh.format("YYYY-MM-DD") : null,
      };
  
      console.log("Album cập nhật value:", formattedValues);
  
      await updateAlbum(formattedValues, editingAlbum?.album_id);
      message.success("Cập nhật album thành công!");
      setIsModalOpen(false);
      fetchAlbums(page, size, searchTerm);
    } catch (error) {
      message.error("Lỗi khi cập nhật album!");
    }
  };

  const handleToggleStatus = async (album: Album) => {
    try {
      await updateAlbum({ is_active: !album.is_active }, album.album_id);
      message.success("Cập nhật trạng thái thành công!");
      fetchAlbums(page, size, searchTerm);
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
      const imageUrl = data.secure_url;
      form.setFieldsValue({ anh_bia: imageUrl });
      message.success("Tải ảnh lên thành công!");
    } catch (error) {
      message.error("Lỗi khi tải ảnh lên Cloudinary!");
    }
  };

  console.log("Editing Album Data:", editingAlbum);
  const columns = [
    { title: "ID", dataIndex: "album_id", key: "album_id", width: 80 },
    {
      title: "Ảnh bìa",
      dataIndex: "anh_bia",
      key: "anh_bia",
      render: (url: string) => (
        <img src={url} alt="Ảnh bìa" style={{ width: 50, height: 50, borderRadius: "5px" }} />
      ),
    },
    { title: "Tên Album", dataIndex: "ten_album", key: "ten_album" },
    { title: "Thể loại", dataIndex: "the_loai", key: "the_loai" },
    { title: "Ngày phát hành", dataIndex: "ngay_phat_hanh", key: "ngay_phat_hanh" },
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
    // {
    //   title: "Hành động",
    //   key: "action",
    //   render: (_, record: Album) => (
    //     <Space>
    //       <Button type="link" onClick={() => showEditModal(record)}>Sửa</Button>
    //     </Space>
    //   ),
    // },
    {
      title: "Hành động",
      key: "action",
      render: (_, record: Album) => (
        <div className="action-buttons">
          <Button type="link" onClick={() => showEditModal(record)} className="edit-button">
            Sửa
          </Button>
          <Popconfirm
            title={`Bạn có chắc muốn ${record.is_active ? "khóa" : "mở khóa"} album này?`}
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
  const [form] = Form.useForm();
  return (
    <div>
      <h2>Danh sách Album</h2>
      <Input
        placeholder="Tìm kiếm album..."
        prefix={<SearchOutlined />}
        onChange={(e) => handleSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300 }}
      />
      <Table
        columns={columns}
        dataSource={albums}
        rowKey="album_id"
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

      <Modal
        title="Chỉnh sửa Album"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleUpdate}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="ten_album" label="Tên Album" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="the_loai" label="Thể loại" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="ngay_phat_hanh" label="Ngày phát hành" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item name="anh_bia" label="Ảnh bìa">
            <Upload beforeUpload={(file) => { handleUpload(file); return false; }} showUploadList={false}>
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
            {form.getFieldValue("anh_bia") && (
              <img src={form.getFieldValue("anh_bia")} alt="Ảnh bìa" style={{ width: 80, height: 80, marginTop: 10, borderRadius: "5px" }} />
            )}
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default Album;
