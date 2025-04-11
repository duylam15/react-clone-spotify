import { useCallback, useEffect, useRef, useState } from 'react'
import { Slider } from '@/components/ui/slider'
import { useSelector } from 'react-redux'
import { RootState } from '@/stores/playlist'


export default function ControllerSlider(): React.ReactNode {
  const [isDragging, setIsDragging] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number[]>([0])
  const defaultValue = [0]

  const audioPlayer = document.querySelector<HTMLAudioElement>('#audio-player')
  const sliderReference = useRef<HTMLSpanElement>(null)
  const { currentSong, isPaused } = useSelector((state: RootState) => state.player);

  const duration = audioPlayer?.duration ?? 0

  const onSliderCommit = useCallback(
    (value: number[]) => {
      if (value[0] === undefined || !audioPlayer) return
      audioPlayer.currentTime = value[0]
      setCurrentTime(value)
    },
    [audioPlayer],
  )

  useEffect(() => {
    if (!audioPlayer || isDragging) return
    setCurrentTime([audioPlayer.currentTime])
  }, [isDragging, audioPlayer, audioPlayer?.currentTime, setCurrentTime])

  return (
    <Slider
      disabled={currentSong?.the_loai === "Advertisement"}
      ref={sliderReference}
      defaultValue={defaultValue}
      max={duration}
      min={0}
      onValueChange={(value) => setCurrentTime(value)}
      onValueCommit={(value) => onSliderCommit(value)}
      onPointerDown={() => setIsDragging(true)}
      onPointerUp={() => setIsDragging(false)}
      step={1}
      value={currentTime}
    />
  )
}
