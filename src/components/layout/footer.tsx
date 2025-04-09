import { useSelector } from 'react-redux';
import OtherControls from './footer/other-controls';
import PlayerController from './footer/player-controller';
import TrackDisplayer from './footer/track-displayer';
import { RootState } from '@/stores/playlist';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Artist } from '@/types/types';

export default function Footer(): React.ReactNode {
  const currentSong: any = useSelector((state: RootState) => state?.player?.currentSong);
  console.log("currentSongcurrentSongcurrentSongcurrentSongcurrentSong", currentSong)
  const [artist, setArtist] = useState<Artist>(currentSong?.nghe_si_id)
  const artistName = currentSong?.nghe_si
  useEffect(() => {
    const fetchArtist = async () => {
      try {
        const response = await axios.get(`http://127.0.0.1:8000/api/nghesi/${currentSong?.nghe_si_id}`)
        setArtist(response.data)
      } catch (err: any) {
        console.error("Error fetching playlist:", err)
      }
    }
    fetchArtist()
  }, [])

  console.log("artistartistarxxxtistartist", artist)


  return (
    <div className="flex flex-row items-center justify-between p-2 pb-3">
      <TrackDisplayer song={currentSong} artist={artist} artistName={artistName} />
      <PlayerController />
      <OtherControls />
      <audio id="audio-player" preload="auto" src={currentSong?.duong_dan} hidden />
    </div>
  );
}