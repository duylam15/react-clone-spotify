import { useAppControllerStore } from '@/features/appControllerStore';
import { RootState } from '@/stores/playlist';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { saveAs } from "file-saver";

export default function PlayingBar() {
	const currentSong: any = useSelector((state: RootState) => state.player.currentSong);
	const { isPaused } = useSelector((state: RootState) => state.player);
	const videoUrl = currentSong?.duong_dan;
	const videoRef = useRef<HTMLVideoElement>(null);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const [savedTime, setSavedTime] = useState(0);
	const toggleDetails = useAppControllerStore((state) => state.toggleDetails)

	// Lấy phần tử audio sau khi component render
	useEffect(() => {
		audioRef.current = document.querySelector<HTMLAudioElement>('#audio-player');
	}, []);

	// Cập nhật video theo thời gian của audio
	useEffect(() => {
		const syncVideoWithAudio = () => {
			if (videoRef.current && audioRef.current) {
				videoRef.current.currentTime = audioRef.current.currentTime;
			}
		};
		const interval = setInterval(syncVideoWithAudio, 500); // Cập nhật mỗi 500ms
		return () => clearInterval(interval); // Xóa interval khi unmount
	}, []);

	useEffect(() => {
		const handleVisibilityChange = () => {
			if (!document.hidden && videoRef.current && audioRef.current) {
				videoRef.current.currentTime = audioRef.current.currentTime; // Đồng bộ lại thời gian
				videoRef.current.play(); // Tiếp tục phát video
			}
		};

		document.addEventListener("visibilitychange", handleVisibilityChange);

		return () => {
			document.removeEventListener("visibilitychange", handleVisibilityChange);
		};
	}, []);


	// Xử lý pause/play
	useEffect(() => {
		if (videoRef.current) {
			if (isPaused) {
				setSavedTime(videoRef.current.currentTime);
				videoRef.current.pause();
			} else {
				videoRef.current.currentTime = savedTime;
				videoRef.current.play();
			}
		}
	}, [isPaused]);

	console.log("currentSongcurrentSong", currentSong)


	const downloadVideo = () => {
		const videoUrl = "https://spotifycloud.s3.ap-southeast-2.amazonaws.com/songs/B%E1%BA%A7u_Tr%E1%BB%9Di_M%E1%BB%9Bi_-_Da_LAB_ft._Minh_T%E1%BB%91c__Lam_Official_MV.mp4";
		const fileName = "BauTroiMoi_DaLAB.mp4";

		const link = document.createElement("a"); // Tạo thẻ <a> ẩn
		link.href = videoUrl;
		link.setAttribute("download", fileName); // Đặt thuộc tính download
		document.body.appendChild(link);
		link.click(); // Mô phỏng click để tải xuống
		document.body.removeChild(link); // Xóa thẻ <a> sau khi tải
	};


	return (
		<div className="playing-bar w-full h-[100vh] relative">
			<div className='flex justify-between items-center font-semibold text-[20px]'>
				{currentSong?.ten_bai_hat}
				<div className="flex justify-center items-center gap-3 ">
					<div className="bg-black-500 inline-block" onClick={downloadVideo}>
						<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" />
						</svg>
					</div>
					<div className='' onClick={() => toggleDetails(false)}>
						<svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
							<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
						</svg>

					</div>
				</div>
			</div>
			<div>
				{videoUrl && (
					<video
						ref={videoRef}
						src={videoUrl}
						autoPlay
						muted
						className="absolute w-full h-full object-cover rounded-lg shadow-lg"
					/>
				)}
			</div>
		</div>
	);
}
