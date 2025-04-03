import { loginUser } from '@/services/login';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [errors, setErrors] = useState<any>({}); // Lưu lỗi từ backend
	const navigate = useNavigate()


	const handleSubmit = async (e: any) => {
		e.preventDefault();
		console.log('Username:', username);
		console.log('Password:', password);

		const userData = {
			email: username,
			password: password,
		};

		try {
			const response = await loginUser(userData);
			if(response.ten_hien_thi != null)
			{
				console.log("Đăng nhập thành công:", response);
				alert("chào mừng " + response.ten_hien_thi + " đã quay trời lại");
				navigate("/");
			}
			else {
				console.log("Đăng nhập thất bại:", response);
				setErrors(response);
			}
		} catch (error: any) {
			setErrors(error); // Lưu lỗi từ response backend
		}
	};

	return (
		<div className='bg-gray-800 h-[100vh]  flex items-center justify-center '>
			<div className='w-[734px]  p-5 bg-black flex flex-col items-center justify-between '>
				<div className='flex flex-col items-center justify-center'>
					<img className='w-10 h-10 rounded-full' src="/public/sporify.png" alt="" />
					<div className='text-white text-3xl font-extrabold mb-4'>Log in to Spotify</div>
					<div className='text-white space-y-2 mb-4'>
						<div className='cursor-pointer p-2 pl-4 border w-[324px] h-[48px] flex items-center justify-around font-semibold text-center border-gray-300 rounded-full leading-[100%]'><img src="/public/ggicon.webp" alt="" className='w-[25px] h-[25px]' /><p className='pr-[17px]'>Continue with Google</p></div>
						<div className='cursor-pointer p-2 pl-4 border w-[324px] h-[48px] flex items-center justify-around font-semibold text-center border-gray-300 rounded-full leading-[100%]'><img src="/public/fbicon.webp" alt="" className='w-[25px] h-[25px]' />Continue with Facebook</div><div className='cursor-pointer p-2 pl-4 border w-[324px] h-[48px] flex items-center justify-around font-semibold text-center border-gray-300 rounded-full leading-[100%]'>
							<img src="/public/apple.png" className='w-[25px] h-[25px]' /><p className='pr-[25px]'>Continue with Apple</p></div>
					</div><img />
				</div>
				<form className='text-white flex flex-col space-y-3 w-full' onSubmit={handleSubmit}>
					<div className='flex flex-col items-center justify-center'>
						<div className='flex justify-center items-start flex-col'>
							<label htmlFor="username" className='font-semibold'>Email or username</label>
							<input
								type="text"
								id="username"
								placeholder='Email or username'
								className='p-3 rounded-md  bg-black border border-gray-500 text-white outline-none w-[324px] h-[48px] '
								value={username}
								onChange={(e) => setUsername(e.target.value)}
							/>
							{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
						</div>
					</div>

					<div className='flex flex-col items-center justify-center'>
						<div className='flex justify-center items-start flex-col'>
							<label htmlFor="password" className='font-semibold'>Password</label>
							<input
								type="password"
								id="password"
								placeholder='Password'
								className='p-3 rounded-md  bg-black border border-gray-500 text-white outline-none w-[324px] h-[48px]'
								value={password}
								onChange={(e) => setPassword(e.target.value)}
							/>
							{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
						</div>
					</div>

					<div className='flex items-center justify-center '>
						<button type='submit' className='bg-green-500 hover:bg-green-600 
						 text-white p-2  w-[324px] h-[48px] rounded-full text-lg font-medium text-center'>
							Login
						</button>
					</div>

				</form>

				<div className='flex flex-col items-center justify-center'>
					<div className='text-white mt-4 cursor-pointer hover:underline'
						onClick={() => navigate('/forgot-password')}>
						Forgot your password?
					</div>
					<div className='text-white mt-2 cursor-pointer hover:underline' onClick={() => navigate(`/register`)}>
						Don't have an account? <span className='text-green-400'>Sign up for Spotify</span>
					</div>
				</div>
			</div>
		</div>
	);
}
