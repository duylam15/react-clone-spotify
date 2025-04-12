import ItemCard from '@/components/ui/item-card'
import React from 'react'
import { useLocation } from 'react-router-dom'

export default function Showall() {
	const location = useLocation()
	const items = location.state?.items

	console.log("Items in Showall:", items)

	return (
		<div>
			<h2 className="text-white text-[24px] font-bold ml-10">Tất cả danh sách</h2>
			{items && items.length > 0 ? (
				<ul className=" space-y-2 flex justify-start items-center flex-wrap gap-2">
					{items.map((item: any) => (
						<li key={item.danh_sach_phat_id} className="text-gray-300  w-[230px] h-[230px]">
							<ItemCard album_id={item.album_id} danh_sach_phat_id={item.danh_sach_phat_id} bxh_id={item.bxh_id} anh_danh_sach={item.anh_danh_sach} ten_danh_sach={item.ten_danh_sach} description={item.description} />
						</li>
					))}
				</ul>
			) : (
				<p className="text-gray-400 mt-4">Không có dữ liệu.</p>
			)}
		</div>
	)
}
