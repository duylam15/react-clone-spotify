// Import các icon từ thư viện lucide-react để sử dụng trong giao diện điều khiển nhạc
import { PauseIcon, PlayIcon, Repeat1Icon, RepeatIcon, ShuffleIcon, SkipBackIcon, SkipForwardIcon } from 'lucide-react'

import _ from "lodash";

// Import các hooks của React để sử dụng state và callback tối ưu
import { useCallback, useEffect, useRef, useState } from 'react'

// Import các component UI tùy chỉnh để sử dụng làm nút điều khiển
import ControlButton from '@/components/ui/control-button'
import ControlSwitch from '@/components/ui/control-switch'

// Import hook để lấy trạng thái và hành động từ store quản lý trình phát nhạc
import { usePlayerControllerStore } from '@/features/playerControllerStore'
import { useDispatch, useSelector } from 'react-redux'
import { RootState } from '@/stores/playlist'
import { setCurrentSong, togglePlayPause } from '@/stores/playlist/playerSlice'

// Định nghĩa component ButtonGroup, có nhiệm vụ hiển thị các nút điều khiển nhạc
export default function ButtonGroup(): React.ReactNode {
  // Lấy trạng thái và hành động từ store
  const { isRepeat, isShuffle, toggleRepeat, toggleShuffle } = usePlayerControllerStore((state) => ({
    isRepeat: state.isRepeat, // Trạng thái lặp (one/all/none)
    isShuffle: state.isShuffle, // Trạng thái phát ngẫu nhiên (true/false)
    toggleRepeat: state.toggleRepeat, // Hàm chuyển đổi chế độ lặp
    toggleShuffle: state.toggleShuffle, // Hàm chuyển đổi chế độ ngẫu nhiên
  }))

  const dispatch = useDispatch();
  const { currentSong, isPaused } = useSelector((state: RootState) => state.player);
  const audioPlayer: HTMLAudioElement | null = document.querySelector<HTMLAudioElement>('#audio-player');

  useEffect(() => {
    if (audioPlayer?.paused) {
      audioPlayer.play();
    }
  }, [currentSong]);

  const onClickPlay = useCallback(() => {
    if (!audioPlayer) {
      return
    }
    if (audioPlayer.paused) {
      void audioPlayer.play()
    }
    else void audioPlayer.pause()
    dispatch(togglePlayPause());
  }, [audioPlayer])

  const listAudio: any = useSelector((state: RootState) => state.songs.songs);

  const [shuffledList, setShuffledList] = useState([...listAudio]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);


  let currentShuffledId: number = shuffledList.find(song => song?.bai_hat_id === currentSong?.bai_hat_id)?.idShuffledList;

  const shuffleArray = (array: any) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const onShuffle = () => {
    toggleShuffle();

    if (!isShuffle) {
      const newList = shuffleArray(listAudio).map((song, index) => ({
        ...song,
        idShuffledList: index,
      }));
      setShuffledList(newList);
      setCurrentIndex(0);
    } else {
      const originalList = listAudio.map((song: any, index: any) => ({
        ...song,
        idShuffledList: index,
      }));
      setShuffledList(originalList);
      setCurrentIndex(0);
    }
  };

  useEffect(() => {
    if (currentSong?.bai_hat_id !== undefined) {
      setCurrentIndex(currentSong.bai_hat_id - 1);
    }
  }, [currentSong]);

  const playAudio = (bai_hat_id: number) => {
    const audioPlayer = document.querySelector<HTMLAudioElement>("#audio-player");
    if (!audioPlayer) return;
    dispatch(setCurrentSong(shuffledList[bai_hat_id]))
    setCurrentIndex(shuffledList[bai_hat_id]?.bai_hat_id)
    if (isShuffle) {
      audioPlayer.src = shuffledList[bai_hat_id]?.duong_dan;
    }
    audioPlayer.load();
    audioPlayer.play();
  };

  const playAudioNoShuffle = (bai_hat_id: number, listAudio: any) => {
    if (!listAudio || listAudio.length === 0) {
      console.log("⚠ listAudio chưa có dữ liệu, chờ tải...");
      return;
    }
    const audioPlayer = document.querySelector<HTMLAudioElement>("#audio-player");
    if (!audioPlayer) return;
    dispatch(setCurrentSong(listAudio[bai_hat_id]))
    audioPlayer.src = listAudio[bai_hat_id]?.duong_dan;
    audioPlayer.load();
    audioPlayer.play();
  };

  const onPrevious = useCallback((listAudio: any, currentIndex: any) => {
    if (isShuffle) {
      playAudio(currentShuffledId - 1);
      currentShuffledId -= 1;
    } else {
      playAudioNoShuffle(currentIndex - 1, listAudio);
      setCurrentIndex(currentIndex - 1);
    }
  }, [isShuffle, currentShuffledId]);

  useEffect(() => {
    const audioPlayer = document.querySelector<HTMLAudioElement>("#audio-player");
    const stateRepeat = usePlayerControllerStore.getState().isRepeat;

    if (!audioPlayer) return;

    if (stateRepeat === "one") {
      audioPlayer.onended = () => {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
      };
    } else if (stateRepeat === "all") {
      audioPlayer.onended = () => {
        const nextIndex = currentIndex + 1;
        if (nextIndex < listAudio.length) {
          onNext(listAudio, currentIndex);
        } else {
          if (isShuffle) {
            playAudio(0)
          } else {
            playAudioNoShuffle(0, listAudio);
            setCurrentIndex(0);
          }
        }
      };
    } else {
      // Khi bài hát kết thúc, tự động chuyển sang bài tiếp theo
      audioPlayer.onended = () => {
        onNext(listAudio, currentIndex);
      };
    }

    // Cleanup: Xóa sự kiện khi component unmount hoặc `currentSong` thay đổi
    return () => {
      audioPlayer.onended = null;
    };
  }, [currentSong, listAudio, currentIndex, isShuffle, isRepeat]);


  const onNext = useCallback((listAudio: any, currentIndex: any) => {
    if (isShuffle) {
      playAudio(currentShuffledId + 1);
      currentShuffledId += 1;
    } else {
      playAudioNoShuffle(currentIndex + 1, listAudio);
      setCurrentIndex(currentIndex + 1);
    }
  }, [isShuffle, currentShuffledId]);


  // Gán trực tiếp hàm toggleRepeat vào onRepeat để tối ưu hiệu suất
  const onRepeat = useCallback(() => {
    toggleRepeat();
    const stateRepeat = usePlayerControllerStore.getState().isRepeat;
    const audioPlayer = document.querySelector<HTMLAudioElement>("#audio-player");
    if (!audioPlayer) return; // Kiểm tra nếu không tìm thấy thẻ audio
    if (stateRepeat === "one") {
      audioPlayer.onended = () => {
        audioPlayer.currentTime = 0;
        audioPlayer.play();
      };
    } else {
      audioPlayer.onended = null;
    }
  }, [toggleRepeat]);

  return (
    <div className="flex flex-row justify-center gap-3 pb-1">
      {/* Nút bật/tắt phát nhạc ngẫu nhiên */}
      <ControlSwitch Icon={ShuffleIcon} size={17} onClick={onShuffle} switchControl={isShuffle} />

      {/* Nút quay lại bài hát trước */}
      <ControlButton Icon={SkipBackIcon} onClick={() => onPrevious(listAudio, currentIndex)} button />

      {/* Nút Play/Pause */}
      <ControlButton
        Icon={isPaused ? PlayIcon : PauseIcon} // Hiển thị Play nếu nhạc đang dừng, ngược lại hiển thị Pause
        className="bg-s-gray-lightest text-black transition-transform duration-100 hover:scale-105 active:scale-95"
        onClick={onClickPlay}
      />

      {/* Nút chuyển bài hát tiếp theo */}
      <ControlButton Icon={SkipForwardIcon} onClick={() => onNext(listAudio, currentIndex)} button />

      {/* Nút bật/tắt chế độ lặp lại */}
      <ControlSwitch
        Icon={isRepeat === 'one' ? Repeat1Icon : RepeatIcon} // Nếu đang lặp một bài thì hiển thị Repeat1Icon, ngược lại hiển thị RepeatIcon
        onClick={onRepeat}
        switchControl={isRepeat === 'one' || isRepeat === 'all'} // Bật nếu chế độ lặp là 'one' hoặc 'all'
      />
    </div>
  )
}


// Tóm tắt chức năng của từng phần:
// Quản lý trạng thái trình phát nhạc

// Sử dụng useState để lưu trạng thái phát / dừng nhạc(isPaused).
// Sử dụng usePlayerControllerStore để lấy trạng thái và thao tác lặp / ngẫu nhiên từ store.
// Lấy phần tử < audio > từ DOM để điều khiển phát nhạc.
// Hàm xử lý sự kiện

// onClickPlay: Dừng hoặc phát nhạc khi nhấn nút.
//   onShuffle: Chuyển đổi chế độ phát ngẫu nhiên.
//     onRepeat: Chuyển đổi chế độ lặp lại.
//       onPrevious: Chuyển về bài hát trước.
//         onNext: Chuyển sang bài hát tiếp theo.
// Giao diện điều khiển

// Gồm các nút phát / dừng, chuyển bài, chế độ phát ngẫu nhiên, chế độ lặp lại.
// Các nút được thiết kế bằng các component UI tùy chỉnh(ControlButton, ControlSwitch).
// 🔥 Tóm lại: Đây là một nhóm nút điều khiển nhạc với tính năng phát / dừng, chuyển bài, lặp lại, phát ngẫu nhiên, sử dụng React hook để quản lý trạng thái và tối ưu hiệu suất. 🚀