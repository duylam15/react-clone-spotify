import { useAppControllerStore } from '@/features/appControllerStore';
import { RootState } from '@/stores/playlist';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { saveAs } from "file-saver";
import { Spin } from 'antd';

export default function PlayingBar() {
	const currentSong: any = useSelector((state: RootState) => state.player.currentSong);



	return (
		<div className="playing-bar w-full h-[100vh] relative">
			<div className='flex flex-col justify-between items-start '>
				<img src={currentSong?.anh_bia} className='w-full h-full object-cover' alt="" />
				<div className='font-extrabold text-[24px] ml-6 mt-3'>{currentSong?.ten_bai_hat}</div>
				<div className="  p-4 flex items-center justify-start gap-4">
					<img className="w-[70px] h-[70px] rounded-full" src={currentSong?.anh_bia} alt="" />
					<div className="text-white ">
						<div>Artist</div>
						<div className='font-semibold'>{currentSong?.nghe_si}</div>
					</div>
				</div>
			</div>
		</div>
	);
}
