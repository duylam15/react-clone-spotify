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

  console.log("isRepeat, , , ", isRepeat,)
  console.log(", isShuffle, , ", isShuffle)

  // State để kiểm soát trạng thái phát/dừng nhạc
  const dispatch = useDispatch();
  console.log("setCurrentSongsetCurrentSongsetCurrentSongsetCurrentSong", setCurrentSong)
  const { currentSong, isPaused } = useSelector((state: RootState) => state.player);
  console.log("isPaused", isPaused)
  const audioPlayer: HTMLAudioElement | null = document.querySelector<HTMLAudioElement>('#audio-player');

  useEffect(() => {
    if (audioPlayer?.paused) {
      audioPlayer.play();
    }
  }, [currentSong]);

  console.log("currentSongcurrentSongcurrentSongcurrentSong", currentSong?.bai_hat_id)

  // Hàm xử lý sự kiện nhấn nút Play/Pause
  const onClickPlay = useCallback(() => {
    if (!audioPlayer) {
      return
    } // Nếu không tìm thấy phần tử audio thì dừng
    console.log("audioPlayeraudioPlayeraudioPlayer", audioPlayer)
    console.log("audioPlayeraudioPlayer", audioPlayer?.paused)
    if (audioPlayer.paused) {
      void audioPlayer.play()
    }// Nếu nhạc đang dừng thì phát
    else void audioPlayer.pause() // Nếu nhạc đang phát thì dừng
    dispatch(togglePlayPause());
  }, [audioPlayer])

  const listAudio: any = useSelector((state: RootState) => state.songs.songs);
  console.log("songssongssongssongssongssongsxxxx", listAudio)


  const [shuffledList, setShuffledList] = useState([...listAudio]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);


  console.log("currentIndexcurrentIndex", currentIndex)

  let currentShuffledId: number = shuffledList.find(song => song?.bai_hat_id === currentSong?.bai_hat_id)?.idShuffledList;



  console.log("xxxxxxxxxx22", currentShuffledId);

  const shuffleArray = (array: any) => {
    let shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const onShuffle = () => {
    toggleShuffle(); // Đảo trạng thái shuffle trong Zustand

    if (!isShuffle) {
      const newList = shuffleArray(listAudio).map((song, index) => ({
        ...song,
        idShuffledList: index, // Gán idShuffledList từ 0 đến length - 1
      }));
      setShuffledList(newList);
      setCurrentIndex(0); // Reset về bài đầu tiên
    } else {
      const originalList = listAudio.map((song: any, index: any) => ({
        ...song,
        idShuffledList: index, // Đặt lại idShuffledList theo danh sách gốc
      }));
      setShuffledList(originalList);
      setCurrentIndex(0);
    }
  };

  console.log("shuffledListshuffledListshuffledListshuffledList", shuffledList)


  useEffect(() => {
    if (currentSong?.bai_hat_id !== undefined) {
      setCurrentIndex(currentSong.bai_hat_id - 1);
    }
  }, [currentSong]); // Cập nhật currentIndex khi currentSong thay đổi

  console.log("currentSongcurrentSongcurrentSongcurrentSong", currentSong?.bai_hat_id);
  console.log("currentSongcurrentSongcurrentSongcurrentSong", currentIndex);

  const playAudio = (bai_hat_id: number) => {
    const audioPlayer = document.querySelector<HTMLAudioElement>("#audio-player");
    console.log("aaaaaaaaaa")
    if (!audioPlayer) return;

    console.log("🔎 Danh sách shuffledList:", shuffledList);
    console.log("songssoxxxxngssongssongssongssongsxxxx", listAudio);
    console.log("bai_hat_idbxxai_hat_id", bai_hat_id);

    console.log("bai_hat_idbài", shuffledList[bai_hat_id])
    dispatch(setCurrentSong(shuffledList[bai_hat_id]))
    // Tìm vị trí của bài hát trong shuffledList
    const songIndex = shuffledList.findIndex(song => song?.bai_hat_id === bai_hat_id);
    console.log("🔢 Kết quả tìm kiếm index:", songIndex);

    setCurrentIndex(shuffledList[bai_hat_id]?.bai_hat_id)
    console.log("bai_hat_idbai_hat_idbai_hat_id", shuffledList[bai_hat_id]?.bai_hat_id)
    console.log("currentSongcurrentSoxxxxngcurrentSongcurrentSong", currentSong)

    // Cập nhật currentIndex và phát bài hát
    console.log("isShuffleisShuffleisShuffle", isShuffle)
    console.log("isShuffleisShuffleisShuffle", listAudio)
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

    console.log("bai_hat_idxxxbai_hat_id", bai_hat_id)

    const audioPlayer = document.querySelector<HTMLAudioElement>("#audio-player");
    if (!audioPlayer) return;

    console.log("🎶 listAudio có dữ liệu:", listAudio[bai_hat_id]);
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
      console.log("Đã bật Repeat One");
      // Lắng nghe sự kiện khi bài hát kết thúc
      audioPlayer.onended = () => {
        audioPlayer.currentTime = 0; // Quay lại đầu bài
        audioPlayer.play(); // Phát lại bài hát
      };
    } else if (stateRepeat === "all") {
      console.log("Đã bật Repeat All");

      audioPlayer.onended = () => {
        const nextIndex = currentIndex + 1;

        if (nextIndex < listAudio.length) {
          // Nếu chưa phải bài cuối, phát bài tiếp theo
          onNext(listAudio, currentIndex);
        } else {
          if (isShuffle) {
            console.log("xxxxxxxx222xxxxx")
            console.log("xxxxxxxx222xxxxx", currentShuffledId)
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
        console.log("🎵 Bài hát đã kết thúc, chuyển sang bài tiếp theo...");
        onNext(listAudio, currentIndex);
      };
    }

    // Cleanup: Xóa sự kiện khi component unmount hoặc `currentSong` thay đổi
    return () => {
      audioPlayer.onended = null;
    };
  }, [currentSong, listAudio, currentIndex, isShuffle, isRepeat]);


  const onNext = useCallback((listAudio: any, currentIndex: any) => {
    console.log("aaaaaaaaa")
    console.log("listAudio", listAudio)

    if (isShuffle) {
      playAudio(currentShuffledId + 1);
      currentShuffledId += 1;

    } else {
      console.log("listAudio", listAudio)
      console.log("currentIndexcurrentIndexcurrentIndexxxx", currentIndex)
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

    console.log("Trạng thái Repeat:", stateRepeat);
    if (stateRepeat === "one") {
      console.log("Đã bật Repeat One");

      // Lắng nghe sự kiện khi bài hát kết thúc
      audioPlayer.onended = () => {
        audioPlayer.currentTime = 0; // Quay lại đầu bài
        audioPlayer.play(); // Phát lại bài hát
      };
    } else {
      // Nếu không phải "one", xóa sự kiện `onended` để không phát lại
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