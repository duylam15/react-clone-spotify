import { forgotPassword } from '@/services/user';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            // Giả sử có API gửi email reset password

            const sendData =  {email : email}

            const response = await forgotPassword(sendData)
            alert(response?.data.message) ;

            
        } catch (error) {
            setMessage('Đã có lỗi xảy ra. Vui lòng thử lại!');
        }
    };

    return (
        <div className='bg-gray-800 h-[100vh] flex items-center justify-center'>
            <div className='w-[400px] p-5 bg-black flex flex-col items-center'>
                <h2 className='text-white text-2xl font-bold mb-4'>Forgot Password</h2>
                <p className='text-gray-400 mb-4'>Nhập email để đặt lại mật khẩu</p>
                
                {message && <p className="text-green-400 mb-2">{message}</p>}

                <form className='w-full' onSubmit={handleSubmit}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className='p-3 w-full rounded bg-black border border-gray-500 text-white outline-none'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <button type="submit"
                        className='bg-green-500 hover:bg-green-600 text-white p-2 w-full rounded mt-3'>
                        Send Reset Link
                    </button>
                </form>

                <button className='text-gray-400 mt-3 hover:underline' 
                        onClick={() => navigate('/login')}>
                    Back to Login
                </button>
            </div>
        </div>
    );
}
