import React from 'react'

export default function LibraryCardContent({
  name,
  songCount,
}: {
  name: string
  songCount: number | string
}) {
  return (
    <div className="flex flex-col items-center  gap-2 p-2">
      <div className="text-base leading-none">{name}</div>
      <div className="flex flex-row items-end gap-3 ">
        <div className="text-base leading-none text-s-gray-lighter">{songCount}</div>
      </div>
    </div>
  )
}