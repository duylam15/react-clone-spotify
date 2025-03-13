import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "./register.css"
import { ScrollArea, ScrollBar } from '../components/ui/scroll-area';

export default function Register() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const [name, setName] = useState('');
	const [day, setDay] = useState("");
	const [month, setMonth] = useState("");
	const [year, setYear] = useState("");
	const [gender, setGender] = useState("");
	const navigate = useNavigate()
	const handleSubmit = (e: any) => {
		e.preventDefault();
		console.log('Username:', username);
		console.log('Password:', password);
		console.log('day:', day);
		console.log('month:', month);
		console.log('year:', year);
		console.log('gender:', gender);
	};


	return (
		<div className='bg-black h-[100%] overflow-y-auto flex items-center justify-center' >
			<div className='w-[734px]  p-5 bg-black flex flex-col items-center justify-between '>
				<div className='flex flex-col items-center justify-center'>
					<img className='w-10 h-10 rounded-full' src="/public/sporify.png" alt="" />
					<div className='text-white text-3xl font-extrabold mb-4 w-[220px] text-center'>Sign up to start listening</div>
				</div>
				<form className='text-white flex flex-col space-y-3 w-full justify-center items-center' onSubmit={handleSubmit}>
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
						</div>
					</div>

					<div className='flex flex-col items-center justify-center'>
						<div className='flex justify-center items-start flex-col'>
							<label htmlFor="Name" className='font-semibold'>Name</label>
							<input
								type="Name"
								id="Name"
								placeholder='Name'
								className='p-3 rounded-md  bg-black border border-gray-500 text-white outline-none w-[324px] h-[48px]'
								value={name}
								onChange={(e) => setName(e.target.value)}
							/>
						</div>
					</div>

					<div className="flex flex-col items-center justify-center">
						<div className="flex justify-center items-start  gap-x-3">
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


					</div>

					{/* Chọn giới tính */}
					<div className="flex flex-col pt-3 pb-3 justify-start items-start w-[324px] ">
						<div className="flex gap-x-6">
							{/* Nam */}
							<label className="flex items-center gap-x-2">
								<input
									type="radio"
									name="gender"
									value="male"
									checked={gender === "male"}
									onChange={(e) => setGender(e.target.value)}
									className="w-5 h-5"
								/>
								<span className="text-white">Nam</span>
							</label>

							{/* Nữ */}
							<label className="flex items-center gap-x-2">
								<input
									type="radio"
									name="gender"
									value="female"
									checked={gender === "female"}
									onChange={(e) => setGender(e.target.value)}
									className="w-5 h-5"
								/>
								<span className="text-white">Nữ</span>
							</label>
						</div>
					</div>
					<div className='flex items-center justify-center '>
						<button type='submit' className='bg-green-500 hover:bg-green-600 
						 text-white p-2  w-[324px] h-[48px] rounded-full text-lg font-medium text-center'>
							Logina
						</button>
					</div>
				</form>

				<div className='flex flex-col items-center justify-center'>
					<div className='text-white mt-4 cursor-pointer hover:underline'>Forgot your password?</div>
					<div className='text-white mt-2 cursor-pointer hover:underline' onClick={() => navigate(`/register`)}>
						Don't have an account? <span className='text-green-400'>Sign up for Sposatify</span>
					</div>
				</div>
			</div>
		</div >
	);
}
