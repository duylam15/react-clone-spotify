import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function ResetPassword() {
  const { uid, token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`http://localhost:8000/nguoidung/api/password-reset-confirm/${uid}/${token}/`, {
        password,
      });

      alert(response.data.message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      setMessage('Error resetting password');
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-900">
      <div className="bg-black p-6 rounded-lg shadow-md text-white">
        <h2 className="text-2xl font-bold mb-4">Reset Password</h2>
        {message && <p className="mb-4">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            placeholder="Enter new password"
            className="w-full p-2 rounded bg-gray-700 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full p-2 bg-green-600 rounded hover:bg-green-700">
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
