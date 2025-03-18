import { createBrowserRouter, createRoutesFromElements, Route } from 'react-router-dom';

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

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route element={<Layout />} path="/">
        <Route element={<Home />} index />
        <Route element={<Search />} path="search" />
        <Route element={<Lyrics />} path="lyrics" />
        <Route element={<Queue />} path="queue" />
        <Route element={<Feed />} path="feed" />
        <Route element={<PlayList />} path="playlist/:id" />
        <Route element={<Track />} path="track/:id" />
        <Route path="user">
          <Route element={<UserPage />} path="trknell" />
        </Route>
      </Route>
      <Route element={<Login />} path="login" />
      <Route element={<Register />} path="register" />
      <Route element={<ForgotPassword />} path="forgot-password" />
      <Route element={<ResetPassword />} path="reset-password/:uid/:token" />
      <Route element={<div>Not Found</div>} path="*" />
    </>,
  ),
);
