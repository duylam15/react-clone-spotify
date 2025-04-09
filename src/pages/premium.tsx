import React, { useRef, useState, useEffect } from "react";
import axios from "axios";
import { taoThanhToanPayPal } from "@/services/paypal";
import { message } from 'antd'; // Import thông báo từ Ant Design
const Premium: React.FC = () => {
  const plansRef = useRef<HTMLDivElement | null>(null);
  const [showPaymentOptions, setShowPaymentOptions] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const handleGetStarted = () => {
    setShowPaymentOptions(true); // Hiển thị modal khi nhấn Get Started
  };


  const [hasShownMessage, setHasShownMessage] = useState(false); // State để theo dõi thông báo đã hiện hay chưa

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search); // Lấy các tham số URL
    const success = urlParams.get('success'); // Kiểm tra nếu có tham số success

    if (success === 'true' && !hasShownMessage) {
      // Hiển thị thông báo thành công của Ant Design
      message.success('Đăng kí Premium thành công');
      
      // Cập nhật state để tránh hiển thị thông báo nữa
      setHasShownMessage(true);

      // Đặt thời gian trì hoãn trước khi thay đổi URL để người dùng thấy thông báo
      setTimeout(() => {
        // Xóa các tham số trên URL và điều hướng lại trang mà không có tham số
        const newUrl = window.location.origin + window.location.pathname;
        window.location.replace(newUrl); // Điều hướng lại mà không có tham số
      }, 2000); // Trì hoãn 2 giây (2000 ms)
    }
  }, [hasShownMessage]); // useEffect phụ thuộc vào `hasShownMessage`

  const handlePaymentMethod = async (method: string) => {
    setLoading(true);
    setError(null);

    if (method === "zalopay") {
      try {
        // Gọi API ZaloPay
        const response = await axios.post("http://localhost:8000/api/zalopay/create/", {
          amount: 59000,
          user_id: localStorage.getItem("idLogin") || "1",
        });

        const { orderurl } = response.data;
        if (orderurl) {
          window.location.href = orderurl; // Chuyển hướng đến ZaloPay
        } else {
          throw new Error("No order URL returned from ZaloPay");
        }
      } catch (err) {
        setError("Failed to initiate ZaloPay payment. Please try again.");
        console.error(err);
      }
    } else if (method === "vnpay") {
      // Placeholder cho VNPay
      alert("VNPay integration not implemented yet.");
    } else if (method === "paypal") {
      alert("PayPal ok");

      const userId = localStorage.getItem("idLogin") || 7;
      const data = {
        amount: 2, // 59000 VNĐ ~ 2 USD
        idNguoiDung: userId,
      };

      try {
        const response = await taoThanhToanPayPal(data);
        console.log("Response from PayPal:", response);

        if (response && response.approval_url) {
          const approvalUrl = response.approval_url; // Sửa lỗi destructuring
          console.log("Approval URL:", approvalUrl);
          // Mở cửa sổ mới với URL phê duyệt
          window.open(approvalUrl, "_blank");

        } else {
          setError("No approval URL returned from PayPal");
          console.error("No approval URL:", response);
        }
      } catch (error) {
        setError("Error processing PayPal payment");
        console.error("PayPal error:", error);
      }

      

    }

    setLoading(false);
    setShowPaymentOptions(false); // Ẩn modal sau khi chọn
  };
  // Hàm cuộn đến phần "All Premium plans"
  const scrollToPlans = () => {
    if (plansRef.current) {
      plansRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col items-center w-full h-full p-6 bg-[url('https://wwwmarketing.scdn.co/static/images/premium/desktop-album-evergreen-1x.png')] bg-cover bg-center">
      <div className="bg-[#242424] bg-opacity-80 p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center mb-2">
          Listen without limits. Try 2 months of Premium Individual for free.
        </h1>
        <p className="text-lg text-center mb-4">Only ₫59,000/month after. Cancel anytime.</p>
        <div className="flex flex-col space-y-4">
          <button
            className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition duration-300 disabled:bg-gray-400"
            onClick={handleGetStarted}
            disabled={loading}
          >
            {loading ? "Processing..." : "Get started"}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
          <button
            className="border border-pink-500 text-pink-500 px-6 py-3 rounded-lg hover:bg-pink-600 hover:text-white transition duration-300"
            onClick={scrollToPlans} // Gọi hàm cuộn khi nhấn nút
          >
            View all plans
          </button>
          {/* Modal chọn phương thức thanh toán */}
          {showPaymentOptions && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-6 rounded-lg shadow-lg w-80">
                <h2 className="text-xl font-bold mb-4 text-center">Chọn phương thức thanh toán</h2>
                <div className="flex flex-col space-y-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    onClick={() => handlePaymentMethod("zalopay")}
                    disabled={loading}
                  >
                    ZaloPay
                  </button>
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600"
                    onClick={() => handlePaymentMethod("vnpay")}
                    disabled={loading}
                  >
                    VNPay
                  </button>
                  <button
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600"
                    onClick={() => handlePaymentMethod("paypal")}
                    disabled={loading}
                  >
                    PayPal
                  </button>
                </div>
                <button
                  className="mt-4 text-gray-500 hover:underline w-full"
                  onClick={() => setShowPaymentOptions(false)}
                >
                  Hủy
                </button>
              </div>
            </div>
          )}
        </div>
        <p className="text-center mt-4">
          Premium Individual only. Free for 2 months, then ₫59,000 per month after. Offer only available if you haven't tried Premium before.
          <a href="https://www.spotify.com/vn-en/legal/premium-promotional-offer-terms/" className="text-blue-500 hover:underline">Terms apply.</a>
          <br />
          Offer ends April 2, 2025.
        </p>
      </div>

      {/* Tiêu đề các gói Premium */}
      <div className="mt-12 w-full">
        <h1 className="text-2xl font-bold text-center">Affordable plans for any situation</h1>
        <p className="text-lg text-center mb-6">
          Choose a Premium plan and listen to ad-free music without limits on your phone, speaker, and other devices. Pay in various ways. Cancel anytime.
        </p>

        <div ref={plansRef} className="flex flex-col items-center">
          <div className="bg-[#242424] p-4 rounded-lg mb-4 w-80">
            <h3 className="text-3xl text-pink-500 font-semibold">Individual</h3>
            <p className="text-md">Free for 2 months</p>
            <p className="font-bold">₫59,000 / month after</p>
            <ul className="mt-2 mb-4 list-disc list-inside text-white">
              <li>1 Premium account</li>
              <li>Cancel anytime</li>
              <li>Subscribe or one-time payment</li>
            </ul>
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition duration-300" onClick={handleGetStarted}>
              Try free for 2 months
            </button>
          </div>
        </div>
      </div>

      {/* Lợi ích Premium */}
      <div className="mt-12 w-full">
        <h2 className="text-2xl font-bold text-center">All Premium plans include</h2>
        <table className="mt-4 w-full text-left bg-transparent] rounded-lg">
          <thead>
            <tr>
              <th className="text-lg font-semibold text-white">What you'll get</th>
              <th className="text-lg font-semibold text-white">Spotify's Free plan</th>
              <th className="text-lg font-semibold text-white">Premium</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-t border-gray-600">
              <td className="py-2 text-white">Ad-free music listening</td>
              <td className="py-2 text-white">—</td>
              <td className="py-2 text-white">✔️</td>
            </tr>
            <tr className="border-t border-gray-600">
              <td className="py-2 text-white">Download songs</td>
              <td className="py-2 text-white">—</td>
              <td className="py-2 text-white">✔️</td>
            </tr>
            <tr className="border-t border-gray-600">
              <td className="py-2 text-white">Play songs in any order</td>
              <td className="py-2 text-white">—</td>
              <td className="py-2 text-white">✔️</td>
            </tr>
            <tr className="border-t border-gray-600">
              <td className="py-2 text-white">High quality audio</td>
              <td className="py-2 text-white">—</td>
              <td className="py-2 text-white">✔️</td>
            </tr>
            <tr className="border-t border-gray-600">
              <td className="py-2 text-white">Listen with friends in real time</td>
              <td className="py-2 text-white">—</td>
              <td className="py-2 text-white">✔️</td>
            </tr>
            <tr className="border-t border-gray-600">
              <td className="py-2 text-white">Organize listening queue</td>
              <td className="py-2 text-white">—</td>
              <td className="py-2 text-white">✔️</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Premium;
