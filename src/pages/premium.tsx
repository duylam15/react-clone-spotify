import React, { useRef } from "react";

const Premium: React.FC = () => {
  const plansRef = useRef<HTMLDivElement | null>(null); // Tạo ref để tham chiếu đến phần kế hoạch

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
          <button className="bg-pink-500 text-white px-6 py-3 rounded-lg hover:bg-pink-600 transition duration-300">
            Get started
          </button>
          <button
            className="border border-pink-500 text-pink-500 px-6 py-3 rounded-lg hover:bg-pink-600 hover:text-white transition duration-300"
            onClick={scrollToPlans} // Gọi hàm cuộn khi nhấn nút
          >
            View all plans
          </button>
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
            <button className="bg-pink-500 text-white px-4 py-2 rounded-lg hover:bg-pink-600 transition duration-300">
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
