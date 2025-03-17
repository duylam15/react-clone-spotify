import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '@/services/register';

export default function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [day, setDay] = useState("");
	const [month, setMonth] = useState("");
	const [year, setYear] = useState("");
	const [gender, setGender] = useState("");

	const [errors, setErrors] = useState<any>({}); // Lưu lỗi từ backend
	const navigate = useNavigate();

	const handleSubmit = async (e: any) => {
		e.preventDefault();

		const userData = {
			email: username,
			password: password,
			ten_hien_thi: name,
			ngay_sinh: `${year}-${month}-${day}`, // Format YYYY-MM-DD
			gioi_tinh: gender,
		};

		try {
			const response = await registerUser(userData);
			console.log("Đăng ký thành công:", response);
			navigate("/login");
		} catch (error: any) {
				setErrors(error); // Lưu lỗi từ response backend
		}
	};

	return (
		<div className='bg-black h-[100vh] overflow-y-auto flex items-center justify-center'>
			<div className='w-[734px] p-5 bg-black flex flex-col items-center justify-between'>
				<div className='flex flex-col items-center justify-center'>
					<img className='w-10 h-10 rounded-full' src="/public/sporify.png" alt="" />
					<div className='text-white text-3xl font-extrabold mb-4 w-[220px] text-center'>Sign up to start listening</div>
				</div>

				<form className='text-white flex flex-col space-y-3 w-full justify-center items-center' onSubmit={handleSubmit}>
					
					{/* Email */}
					<div className='flex flex-col'>
						<label htmlFor="username" className='font-semibold'>Email</label>
						<input
							type="text"
							id="username"
							placeholder='Email'
							className='p-3 rounded-md bg-black border border-gray-500 text-white outline-none w-[324px] h-[48px]'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
						{errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
					</div>

					{/* Password */}
					<div className='flex flex-col'>
						<label htmlFor="password" className='font-semibold'>Password</label>
						<input
							type="password"
							id="password"
							placeholder='Password'
							className='p-3 rounded-md bg-black border border-gray-500 text-white outline-none w-[324px] h-[48px]'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
						{errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
					</div>

					{/* Name */}
					<div className='flex flex-col'>
						<label htmlFor="name" className='font-semibold'>Name</label>
						<input
							type="text"
							id="name"
							placeholder='Name'
							className='p-3 rounded-md bg-black border border-gray-500 text-white outline-none w-[324px] h-[48px]'
							value={name}
							onChange={(e) => setName(e.target.value)}
						/>
						{errors.ten_hien_thi && <p className="text-red-500 text-sm mt-1">{errors.ten_hien_thi}</p>}
					</div>

					{/* Ngày sinh */}
					<div className="flex justify-center gap-x-3">
						{/* Ngày */}
						<div className="flex flex-col">
							<label htmlFor="day" className="font-semibold">Ngày</label>
							<input
								type="number"
								id="day"
								placeholder="DD"
								className="p-3 rounded-md bg-black border border-gray-500 text-white outline-none w-[100px] h-[48px]"
								value={day}
								onChange={(e) => setDay(e.target.value)}
							/>
						</div>

						{/* Tháng */}
						<div className="flex flex-col">
							<label htmlFor="month" className="font-semibold">Tháng</label>
							<input
								type="number"
								id="month"
								placeholder="MM"
								className="p-3 rounded-md bg-black border border-gray-500 text-white outline-none w-[100px] h-[48px]"
								value={month}
								onChange={(e) => setMonth(e.target.value)}
							/>
						</div>

						{/* Năm */}
						<div className="flex flex-col">
							<label htmlFor="year" className="font-semibold">Năm</label>
							<input
								type="number"
								id="year"
								placeholder="YYYY"
								className="p-3 rounded-md bg-black border border-gray-500 text-white outline-none w-[100px] h-[48px]"
								value={year}
								onChange={(e) => setYear(e.target.value)}
							/>
						</div>
					</div>
					{errors.ngay_sinh && <p className="text-red-500 text-sm mt-1">{errors.ngay_sinh}</p>}

					{/* Giới tính */}
					<div className="flex flex-col pt-3 pb-3 justify-start items-start w-[324px]">
						<label className="font-semibold">Giới tính</label>
						<div className="flex gap-x-6">
							<label className="flex items-center gap-x-2">
								<input type="radio" name="gender" value="male" checked={gender === "male"} onChange={(e) => setGender(e.target.value)} className="w-5 h-5"/>
								<span className="text-white">Nam</span>
							</label>
							<label className="flex items-center gap-x-2">
								<input type="radio" name="gender" value="female" checked={gender === "female"} onChange={(e) => setGender(e.target.value)} className="w-5 h-5"/>
								<span className="text-white">Nữ</span>
							</label>
						</div>
						{errors.gioi_tinh && <p className="text-red-500 text-sm mt-1">{errors.gioi_tinh}</p>}
					</div>

					{/* Submit */}
					<button type='submit' className='bg-green-500 hover:bg-green-600 text-white p-2 w-[324px] h-[48px] rounded-full text-lg font-medium text-center'>
						Sign Up
					</button>
				</form>
			</div>
		</div>
	);
}
