import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';
import React from 'react';

// Import từ file đầu
import Layout from '../layouts/layout';
import Feed from '../pages/feed';
import Home from '../pages/home/home';
import Lyrics from '../pages/lyrics';
import Queue from '../pages/queue';
import Search from '../pages/search';
import UserPage from '../pages/user/user-page';
import Login from '@/pages/login';
import PlayList from '@/pages/playlist';
import Track from '@/pages/track';
import Register from '@/pages/register';
import ForgotPassword from '@/pages/forgot-password';
import ResetPassword from '@/pages/reset-password';
import Premium from '@/pages/premium';

// Import từ file thứ hai (chỉ lấy phần admin)
import LayoutDefaultAdmin from '../layout/DefaultLayoutAdmin';
import Chat from '@/components/chat';

// Lazy-loaded components từ file thứ hai (chỉ lấy phần admin)
const Dashboard = React.lazy(() => import('../views/dashboard/Dashboard'));
const User = React.lazy(() => import('../views/user/User'));
const Song = React.lazy(() => import('../views/song/Song')); // Thêm Song
const PlayListAdmin = React.lazy(() => import('../views/playList/PlayList')); // Thêm PlayList (đặt tên PlayListAdmin để tránh xung đột với PlayList từ file đầu)
const Album = React.lazy(() => import('../views/album/Album')); // Thêm Album
const Artist = React.lazy(() => import('../views/artist/Artist')); // Thêm Artist
const TypeSong = React.lazy(() => import('../views/typeSong/TypeSong')); // Thêm TypeSong

// Định nghĩa kiểu cho route
interface Route {
  path: string;
  exact?: boolean;
  name?: string;
  element?: React.ReactNode; // Đảm bảo element có thể là một React component hoặc Lazy-loaded component
}

export const routes: Route[] = [
  { path: '/', exact: true, name: 'Dashboard', element: <Dashboard /> },
  { path: '/dashboard', name: 'Dashboard', element: <Dashboard /> },
  { path: '/user', name: 'User', element: <User /> },
  { path: '/song', name: 'Song', element: <Song /> }, // Thêm route cho Song
  { path: '/playlist', name: 'PlayList', element: <PlayListAdmin /> }, // Thêm route cho PlayList
  { path: '/album', name: 'Album', element: <Album /> }, // Thêm route cho Album
  { path: '/artist', name: 'Artist', element: <Artist /> }, // Thêm route cho Artist
  { path: '/typesong', name: 'TypeSong', element: <TypeSong /> }, // Thêm route cho TypeSong
];

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Routes từ file đầu */}
      <Route element={<Layout />} path="/">
        <Route element={<Home />} index />
        <Route element={<Search />} path="search" />
        <Route element={<Lyrics />} path="lyrics" />
        <Route element={<Queue />} path="queue" />
        <Route element={<Feed />} path="feed" />
        <Route element={<PlayList />} path="playlist" />
        <Route element={<Track />} path="track/:id" />
        <Route element={<Premium />} path="premium" />
        <Route path="user">
          <Route element={<UserPage />} path="profile" />
        </Route>
      </Route>
      <Route element={<Login />} path="login" />
      <Route element={<Register />} path="register" />
      <Route element={<ForgotPassword />} path="forgot-password" />
      <Route element={<ResetPassword />} path="reset-password/:uid/:token" />
      <Route path= "chat" element={<Chat/>}/>

      {/* Routes admin từ file thứ hai */}
      <Route path="/admin" element={<LayoutDefaultAdmin />}>
        <Route index element={<Dashboard />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="user" element={<User />} />
        <Route path="song" element={<Song />} /> {/* Thêm route cho Song */}
        <Route path="playlist" element={<PlayListAdmin />} /> {/* Thêm route cho PlayList */}
        <Route path="album" element={<Album />} /> {/* Thêm route cho Album */}
        <Route path="artist" element={<Artist />} /> {/* Thêm route cho Artist */}
        <Route path="typesong" element={<TypeSong />} /> {/* Thêm route cho TypeSong */}
      </Route>

      {/* Catch-all route từ file đầu */}
      <Route element={<div>Not Found</div>} path="*" />
    </>
  )
);