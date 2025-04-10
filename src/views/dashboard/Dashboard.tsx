import React, { useEffect, useState } from "react";
import { Card } from "antd";
import { Select } from "antd";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { UserOutlined, CustomerServiceOutlined, PlayCircleOutlined, ProfileOutlined } from "@ant-design/icons";
import { getSoLuongBaiHat, getSoLuongDSP, getSoLuongNgheSi, getSoLuongNguoiDung, getSoLuongNguoiDungPremium, thongKeBaiHatGomNhomTheoThangDuaTrenNam } from "@/services/dashboard";


const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];




const Dashboard = () => {

  const [stats, setStats] = useState([
    { title: "Users", value: 0, icon: <UserOutlined />, color: "text-blue-500" },
    { title: "Songs", value: 0, icon: <CustomerServiceOutlined />, color: "text-green-500" },
    { title: "Playlists", value: 0, icon: <ProfileOutlined />, color: "text-purple-500" },
    { title: "Total Plays", value: 0, icon: <PlayCircleOutlined />, color: "text-red-500" },
  ]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [nguoiDung, baiHat, danhSachPhat, ngheSi] = await Promise.all([
          getSoLuongNguoiDung(),
          getSoLuongBaiHat(),
          getSoLuongDSP(),
          getSoLuongNgheSi()
        ]);
        console.log("Raw data:", nguoiDung, baiHat, danhSachPhat, ngheSi);

        setStats([
          { title: "Users", value: nguoiDung.so_luong_nguoi_dung, icon: <UserOutlined />, color: "text-blue-500" },
          { title: "Songs", value: baiHat.so_luong_bai_hat, icon: <CustomerServiceOutlined />, color: "text-green-500" },
          { title: "Playlists", value: danhSachPhat.so_luong_dsp, icon: <ProfileOutlined />, color: "text-purple-500" },
          { title: "Artists", value: ngheSi.so_luong_nghe_si, icon: <PlayCircleOutlined />, color: "text-red-500" },
        ]);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu thống kê:", error);
      }
    };

    fetchStats();
  }, []);


  const [dataPieChart, setDataPieChart] = useState([])

  useEffect(() => {
    const fetchDataPieCharts = async () => {
      try {
        const dataPieChart = await getSoLuongNguoiDungPremium();
        console.log("Pie chart raw data:", dataPieChart);

        const transformedData = [
          { name: "Premium", value: dataPieChart.so_luong_premium },
          { name: "Không Premium", value: dataPieChart.so_luong_khong_premium },
        ];

        setDataPieChart(transformedData);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu thống kê pie chart:", error);
      }
    };

    fetchDataPieCharts();
  }, []);


  // Tạo danh sách năm từ 2020 đến hiện tại
  const yearOptions = Array.from({ length: 6 }, (_, i) => {
    const y = 2020 + i;
    return { label: `${y}`, value: y };
  });
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  const [dataBarChart, setDataBarChart] = useState([]);
  const [year, setYear] = useState(2025);

  useEffect(() => {
    const fetchDataBarChart = async () => {
      try {
        const response = await thongKeBaiHatGomNhomTheoThangDuaTrenNam(year);
        console.log("Bar chart raw data:", response);

        const transformedData = response.map(item => ({
          name: monthNames[item.thang - 1], // vì tháng từ 1 -> 12
          value: item.so_luong,
        }));

        setDataBarChart(transformedData);
      } catch (error) {
        console.error("Lỗi khi fetch dữ liệu thống kê bar chart:", error);
      }
    };

    fetchDataBarChart();
  }, [year]);


  return (

    <div className="p-6 space-y-6 overflow-auto h-screen pb-52">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index} bordered={false} className="rounded-xl shadow hover:shadow-md transition">
            <div className="flex items-center space-x-4">
              <div className={`text-3xl ${stat.color}`}>{stat.icon}</div>
              <div>
                <p className="text-gray-500 text-sm">{stat.title}</p>
                <p className="text-xl font-semibold">{stat.value}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Bar Chart */}
      <Card className="shadow-md rounded-2xl">
        <div className="flex gap-3 items-center">
          <h2 className="text-lg font-semibold mb-4">Thống kê số lượng bài hát phát hành theo tháng ở trong 1 năm</h2>
          <div> <Select
            defaultValue={year}
            style={{ width: 120 }}
            options={yearOptions}
            onChange={(value) => setYear(value)}
          /></div>
        </div>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dataBarChart}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Pie + Line Chart Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Pie Chart */}
        <Card className="shadow-md rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Tỉ lệ người dùng đăng ký premium</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={dataPieChart}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {dataPieChart.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Line Chart */}
        <Card className="shadow-md rounded-2xl">
          <h2 className="text-lg font-semibold mb-4">Line Chart</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={dataBarChart}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="value" stroke="#82ca9d" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>

  );
};

export default Dashboard;