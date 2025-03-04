import React, { useState } from 'react';

export default function Login() {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');

	const handleSubmit = (e: any) => {
		e.preventDefault();
		console.log('Username:', username);
		console.log('Password:', password);
	};

	return (
		<div className='bg-slate-600 h-[100vh] flex items-center justify-center'>
			<div className='pt-10 pb-10 px-10 bg-black flex flex-col items-center justify-center'>
				<img className='w-10 h-10 rounded-full' src="/public/uifaces-popular-image (1).jpg" alt="" />
				<div className='text-white text-lg font-semibold mb-4'>Log in to Spotify</div>

				<div className='text-white space-y-2 mb-4'>
					<div className='cursor-pointer hover:underline'>Continue with Google</div>
					<div className='cursor-pointer hover:underline'>Continue with Facebook</div>
					<div className='cursor-pointer hover:underline'>Continue with Apple</div>
					<div className='cursor-pointer hover:underline'>Continue with phone number</div>
				</div>

				<form className='text-white flex flex-col space-y-3 w-full' onSubmit={handleSubmit}>
					<div className='flex flex-col'>
						<label htmlFor="username">Email or username</label>
						<input
							type="text"
							id="username"
							placeholder='Email or username'
							className='p-2 rounded bg-gray-800 text-white outline-none'
							value={username}
							onChange={(e) => setUsername(e.target.value)}
						/>
					</div>

					<div className='flex flex-col'>
						<label htmlFor="password">Password</label>
						<input
							type="password"
							id="password"
							placeholder='Password'
							className='p-2 rounded bg-gray-800 text-white outline-none'
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					<button type='submit' className='bg-green-500 hover:bg-green-600 text-white p-2 rounded'>
						Login
					</button>
				</form>

				<div className='text-white mt-4 cursor-pointer hover:underline'>Forgot your password?</div>
				<div className='text-white mt-2 cursor-pointer hover:underline'>
					Don't have an account? <span className='text-green-400'>Sign up for Spotify</span>
				</div>
			</div>
		</div>
	);
}
