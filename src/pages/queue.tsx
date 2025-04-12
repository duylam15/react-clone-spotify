import { useAppControllerStore } from '@/features/appControllerStore';
import { RootState } from '@/stores/playlist';
import React, { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { saveAs } from "file-saver";
import { Spin } from 'antd';

export default function Queue() {
  const currentSong: any = useSelector((state: RootState) => state.player.currentSong);
  const { isPaused } = useSelector((state: RootState) => state.player);
  const videoUrl = currentSong?.duong_dan;
  const videoRef = useRef<HTMLVideoElement>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [savedTime, setSavedTime] = useState(0);
  const toggleDetails = useAppControllerStore((state) => state.toggleDetails)
  const [isDownloading, setIsDownloading] = useState(false); // Trạng thái tải video

  const [mp3, setMp3] = useState(0);
  useEffect(() => {
    if (currentSong?.duong_dan?.endsWith(".mp3")) {
      setMp3(1);
    } else {
      setMp3(0);
    }
  }, [currentSong?.duong_dan]);

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

  const downloadVideo = async () => {
    const videoUrl = currentSong?.duong_dan
    const fileName = currentSong?.ten_bai_hat
    setIsDownloading(true); // Bắt đầu tải

    try {
      const response = await fetch(videoUrl, {
        method: "GET",
        headers: {
          "Content-Type": "audio/mp3", // Sử dụng content-type cho âm thanh MP3
        },
      });
      setIsDownloading(false); // Bắt đầu tải

      if (!response.ok) throw new Error("Lỗi khi tải file");

      const blob = await response.blob(); // Chuyển dữ liệu thành Blob
      const blobUrl = window.URL.createObjectURL(blob);

      // Tạo thẻ <a> ẩn để tải file
      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // Xóa object URL để tiết kiệm bộ nhớ
      window.URL.revokeObjectURL(blobUrl);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Tải xuống thất bại", error);
    }
  };


  if (!currentSong) return <div className='ml-10'>Vui lòng chọn bài hát</div>; // Không render gì nếu chưa có bài hát

  return (
    <div className="w-full h-[full]  relative flex flex-col justify-start items-center">
      <div>
        {!mp3 ? (
          <div className='ml-[-100px]'>
            <video
              ref={videoRef}
              src={videoUrl}
              autoPlay
              muted
              className=" w-[full] h-[420px]  object-cover rounded-lg shadow-lg"
            />
          </div>
        ) :
          <div className=" w-[full] h-[420px] flex justify-center items-center  object-cover rounded-lg shadow-lg">
            Bài hát này chưa có video
          </div>}
      </div>
      <div className='flex flex-col justify-center  items-start w-[100%] mt-4 ml-[120px]'>
        <div className='flex justify-between w-[80%]'>
          <div className='font-extrabold text-[24px]'> {currentSong?.ten_bai_hat}</div>
          <div className="flex justify-center items-center gap-3 ">
            {!mp3 ? <div className="bg-black-500 inline-block" onClick={downloadVideo}>
              {isDownloading ? (
                <div className='mb-2'><Spin size="small" /></div> // Hiển thị spinner khi tải
              ) : (
                <svg className="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 13V4M7 14H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1h-2m-1-5-4 5-4-5m9 8h.01" />
                </svg>
              )}
            </div> : <></>}
          </div>
        </div>
        <div className="w-[500px] ml-[-25px] p-4 flex items-center justify-start gap-4">
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
