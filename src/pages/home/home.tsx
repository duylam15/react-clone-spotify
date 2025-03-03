// Import kiểu `Playlist` từ file `@/types`.
// `Playlist` có thể là một interface hoặc type định nghĩa cấu trúc của playlist.
import { Playlist } from '@/types/types';

// Import component `PlaylistCardsContainer` từ file `playlist-cards-container`.
// Đây là component dùng để hiển thị danh sách playlist dưới dạng thẻ.
import PlaylistCardsContainer from './playlist-cards-container';

// Khai báo một danh sách `Playlists` có kiểu `Playlist[]` (mảng các playlist).
const Playlists: Playlist[] = [
  {
    id: '1', // ID của playlist.
    order: 1, // Thứ tự của playlist.
    image: 'uifaces-popular-image (1).jpg', // Ảnh đại diện cho playlist.
    title: 'A very long playlist name that going to be truncated', // Tiêu đề của playlist.
    description: 'Very very long description to see look of second row this text', // Mô tả của playlist.
    followers: 100, // Số lượng người theo dõi playlist.
  },
  {
    id: '2',
    order: 2,
    image: 'uifaces-popular-image (1).jpg',
    title: 'Playlist 2',
    description: 'Description 2',
    followers: 100,
  },

  {
    id: '3',
    order: 3,
    image: 'uifaces-popular-image (1).jpg',
    title: 'Playlist 3',
    description: 'Description 3',
    followers: 100,
  },
  {
    id: '4',
    order: 4,
    image: 'uifaces-popular-image (1).jpg',
    title: 'Playlist 4',
    description: 'Description 4',
    followers: 100,
  },
  {
    id: '5',
    order: 5,
    image: 'uifaces-popular-image (1).jpg',
    title: 'Playlist 5',
    description: 'Description 5',
    followers: 100,
  },
  {
    id: '6',
    order: 6,
    image: 'uifaces-popular-image (1).jpg',
    title: 'Playlist 6',
    description: 'Description 6',
    followers: 100,
  },
  {
    id: '7',
    order: 7,
    image: 'uifaces-popular-image (1).jpg',
    title: 'Playlist 7',
    description: 'Description 7',
    followers: 100,
  },
  {
    id: '8',
    order: 8,
    image: 'uifaces-popular-image (1).jpg',
    title: 'Playlist 8',
    description: 'Description 8',
    followers: 100,
  },
  {
    id: '9',
    order: 9,
    image: 'uifaces-popular-image (1).jpg',
    title: 'Playlist 9',
    description: 'Description 9',
    followers: 100,
  },
  {
    id: '10',
    order: 10,
    image: 'uifaces-popular-image (1).jpg',
    title: 'Playlist 2',
    description: 'Description 2',
    followers: 100,
  },
];

// Định nghĩa component `Home` là một React component.
// Component này trả về giao diện chứa danh sách các playlist.
export default function Home(): React.ReactNode {
  return (
    // Một div cha có class `flex flex-col px-3`, giúp các phần tử con hiển thị theo chiều dọc (cột) và có padding ngang.
    <div className="flex flex-col px-3">
      {/* Gọi component `PlaylistCardsContainer` để hiển thị các playlist theo danh sách có tiêu đề */}
      <PlaylistCardsContainer title="First Playlist Bundle" items={Playlists} />
      <PlaylistCardsContainer title="Second Playlist Bundle" items={Playlists} />
      <PlaylistCardsContainer title="Second Playlist Bundle" items={Playlists} />
      <PlaylistCardsContainer title="Second Playlist Bundle" items={Playlists} />
      <PlaylistCardsContainer title="Second Playlist Bundle" items={Playlists} />
    </div>
  );
}
