import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface Properties {
  danh_sach_phat_id: number
  album_id: number
  bxh_id: String
  anh_danh_sach?: string
  ten_danh_sach: string
  description?: string
  isArtist?: boolean
}

const truncateStyle: React.CSSProperties = {
  WebkitLineClamp: 2,
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}

export default function ItemCard({
  danh_sach_phat_id,
  album_id,
  bxh_id,
  anh_danh_sach,
  ten_danh_sach,
  description,
}: Properties): React.ReactNode {

  const navigate = useNavigate()
  const ifSameGoBackElseNavigate = (path: string) => (location.pathname === path ? navigate('/') : navigate(path))

  const openSong = () => {
    if (danh_sach_phat_id != null) {
      ifSameGoBackElseNavigate(`/playlist/?danhsachphatid=${danh_sach_phat_id}`)
    } else if (album_id != null) {
      ifSameGoBackElseNavigate(`/playlist/?albumid=${album_id}`)
    } else {
      ifSameGoBackElseNavigate(`/playlist/?bxh=${bxh_id}`)
    }
  }

  return (
    <div
      className="group relative flex flex-col rounded-lg bg-transparent p-3 hover:cursor-pointer hover:bg-white/10"
      onClick={openSong}
    >
      <img
        className="aspect-square w-full object-cover shadow-lg shadow-black/50 rounded-lg"
        src={anh_danh_sach}
        height={256}
        width={256}
        alt="playlist"
      />

      <p className="max-w-full truncate pb-2 ps-2 pt-3 leading-none text-white">{ten_danh_sach}</p>

      {description ? (
        <p style={truncateStyle} className="ps-2 text-sm leading-tight text-s-gray-lighter">
          {description}
        </p>
      ) : (
        <div className="h-5"></div>
      )}
    </div>
  )
}
