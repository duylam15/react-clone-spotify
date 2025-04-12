import { Link } from 'react-router-dom'
import { useAppControllerStore } from '@/features/appControllerStore'

interface OrderableAndIndexable {
  danh_sach_phat_id: number
  order: number
}

interface Properties<T extends OrderableAndIndexable> {
  danh_sach_phat_id?: number
  className?: string
  title: string
  description?: string
  items: T[]
  to?: string
  Component: React.FC<T>
}

const cardSizePx = 220

export default function DynamicGrid<T>({
  title,
  description,
  items,
  to,
  Component,
}: Properties<T extends OrderableAndIndexable ? T : never>): React.ReactNode {
  const width = useAppControllerStore((state) => state.mainWidth)
  const columnCount = Math.floor(width / cardSizePx)

  return (
    <div>
      {/* Header */}
      <div className={`flex w-full items-center justify-between px-3.5 py-2`}>
        <Link to={to ?? '/'}>
          <button type="button" className="text-2xl font-bold text-white no-underline hover:underline">
            {title}
          </button>
        </Link>
        <Link to="/showall" state={{ items }}>
          <button className="box-decoration-slice text-sm font-bold text-s-gray-lighter no-underline hover:underline">
            Show all
          </button>
        </Link>
      </div>

      {description && <p className="px-3.5 text-sm text-s-gray-lighter">{description}</p>}

      {/* Grid content */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${columnCount}, minmax(0, 1fr))`,
        }}
      >
        {items
          .slice(0, columnCount)
          .sort((a, b) => a.order - b.order)
          .map((playlist) => (
            <Component key={playlist.danh_sach_phat_id} {...playlist} />
          ))}
      </div>
    </div>
  )
}
