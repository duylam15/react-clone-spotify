// import { PlayIcon } from 'lucide-react'
// import React from 'react'

// // Định nghĩa props cho PlayButton
// interface ButtonProperties extends React.ButtonHTMLAttributes<HTMLButtonElement> {
//   asChild?: boolean // Không sử dụng trong bản rút gọn này, nhưng vẫn giữ nếu cần mở rộng
// }

// // Component `PlayButton`
// export default function PlayButton({ className = '', ...properties }: ButtonProperties): React.ReactNode {
//   const baseClass = 'flex items-center justify-center rounded-full bg-s-green text-black hover:bg-s-green-light'
//   const combinedClass = `${baseClass} 'size-[48px] hover:size-[50px]' ${className}`.trim()

//   return (
//     <button className="flex items-center justify-center rounded-full bg-s-green text-black hover:bg-s-green-light translate-y-2 size-[48px] hover:size-[50px] opacity-0 shadow transition-[opacity,transform] duration-200 ease-in group-hover:translate-y-0 group-hover:opacity-100" {...properties}>
//       <PlayIcon size={24} color="black" />
//     </button>
//   )
// }
