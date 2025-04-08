import React from "react";
import { Card } from "antd";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer,
} from "recharts";
import { UserOutlined, CustomerServiceOutlined, PlayCircleOutlined, ProfileOutlined } from "@ant-design/icons";
const data = [
  { name: "Jan", value: 400 },
  { name: "Feb", value: 300 },
  { name: "Mar", value: 500 },
  { name: "Apr", value: 200 },
  { name: "May", value: 450 },
];

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];


const stats = [
  { title: "Users", value: "1,234", icon: <UserOutlined />, color: "text-blue-500" },
  { title: "Songs", value: "567", icon: <CustomerServiceOutlined />, color: "text-green-500" },
  { title: "Playlists", value: "89", icon: <ProfileOutlined />, color: "text-purple-500" },
  { title: "Total Plays", value: "12,345", icon: <PlayCircleOutlined />, color: "text-red-500" },
];

const Dashboard = () => {
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
        <h2 className="text-lg font-semibold mb-4">Bar Chart</h2>
        <div className="w-full h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
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
          <h2 className="text-lg font-semibold mb-4">Pie Chart</h2>
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  label
                >
                  {data.map((entry, index) => (
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
              <LineChart data={data}>
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