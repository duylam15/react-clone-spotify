import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { CButton, CCard, CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter } from '@coreui/react';
import { cilMicrophone, cilMediaRecord } from '@coreui/icons';
import CIcon from '@coreui/icons-react';

const AudioRecorder: React.FC = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [songInfo, setSongInfo] = useState<any>(null); // Trạng thái để lưu thông tin bài hát
  const [modalVisible, setModalVisible] = useState<boolean>(false); // Trạng thái hiển thị modal
  const audioChunks = useRef<Blob[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  useEffect(() => {
    const getAudio = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, { mimeType: 'audio/webm' });

        mediaRecorderRef.current.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunks.current.push(event.data);
          }
        };

        mediaRecorderRef.current.onstop = () => {
          const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' });
          audioChunks.current = [];
          
          // Gọi hàm gửi audio đến backend
          sendAudioToBackend(audioBlob);
        };
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    getAudio();
  }, []);

  const startRecording = () => {
    if (mediaRecorderRef.current) {
      audioChunks.current = [];
      mediaRecorderRef.current.start();
      setIsRecording(true);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const sendAudioToBackend = async (audioBlob: Blob) => {
    const formData = new FormData();
    formData.append('audio', audioBlob, 'recording.webm');

    setLoading(true); // Bắt đầu loading
    setSongInfo(null); // Reset thông tin bài hát
    try {
      const response = await axios.post('http://127.0.0.1:8000/baihat/timkiemtheogiaidieu/', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Audio sent successfully:', response.data);
      const shazamInfo = response.data.shazam_info;

      // Kiểm tra độ dài của matches
      if (shazamInfo.matches && shazamInfo.matches.length > 0) {
        const track = shazamInfo.track;

        // Kiểm tra nếu các thuộc tính tồn tại trước khi sử dụng
        const album = track.sections && track.sections.length > 0
          ? track.sections[0].metadata.find((item: any) => item.title === "Album")?.text?.toUpperCase() || 'UNKNOWN ALBUM'
          : 'UNKNOWN ALBUM';

        setSongInfo({
          title: track.title?.toUpperCase() || 'UNKNOWN TITLE', // Chuyển sang chữ hoa
          subtitle: track.subtitle || 'Unknown Artist',
          album: album,
          genre: track.genres?.primary || 'Unknown Genre',
          image: track.images?.coverart || 'default_cover_image_url.jpg',
          url: track.hub?.actions[1]?.uri || '#',
          share: track.share?.href || '#',
        });
        setModalVisible(true); // Hiển thị modal khi có thông tin bài hát
      } else {
        alert("Không tìm thấy bài hát");
      }
    } catch (error) {
      console.error('Error sending audio:', error);
    } finally {
      setLoading(false); // Kết thúc loading
    }
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSongInfo(null); // Reset thông tin bài hát khi đóng modal
  };

  return (
    <CCard className="text-center p-2 flex items-center justify-center">
        <CButton
        color={isRecording ? 'danger' : 'primary'}
        onClick={isRecording ? stopRecording : startRecording}
        className="w-12 h-12 text-l rounded-full flex items-center justify-center bg-blue-500 text-white hover:bg-blue-600 transition duration-300" // Các lớp Tailwind CSS
        disabled={loading} // Vô hiệu hóa nút khi đang loading
        >
        <CIcon icon={isRecording ? cilMediaRecord : cilMicrophone} size="xl" />
        </CButton>

      {loading && <div className="mt-4 text-lg">Đang tìm...</div>} {/* Hiển thị thông báo loading */}

      {/* Modal hiển thị thông tin bài hát */}
      <CModal visible={modalVisible} onClose={handleCloseModal} size="lg">
        <CModalHeader>
          <CModalTitle className="text-center w-full text-xl">{songInfo?.title}</CModalTitle>
        </CModalHeader>
        <CModalBody className="text-center flex flex-col items-center">
          <img
            src={songInfo?.image}
            alt={songInfo?.title}
            className="w-full max-w-xs rounded-lg mb-4"
          />
          <h4 className="text-lg font-semibold mb-2">{songInfo?.subtitle}</h4>
          <p className="mb-2"><strong>Album:</strong> {songInfo?.album}</p>
          <p className="mb-4"><strong>Thể loại:</strong> {songInfo?.genre}</p>
          <audio controls className="w-full mb-4">
            <source src={songInfo?.url} type="audio/mp3" />
            Your browser does not support the audio element.
          </audio>
          <div className="mb-4">
            <p>Chia sẻ bài hát:</p>
            <a href={songInfo?.share} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">
              Chia sẻ
            </a>
          </div>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" onClick={handleCloseModal}>Đóng</CButton>
        </CModalFooter>
      </CModal>
    </CCard>
  );
};

export default AudioRecorder;
