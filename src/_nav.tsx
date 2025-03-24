import React from 'react';
import CIcon from '@coreui/icons-react';
import {
  cilSpeedometer,
  cilStar,
  cilMusicNote, // Icon cho Song
  cilList, // Icon thay thế cho PlayList (nếu không có cilPlaylistAdd)
  cilAlbum, // Icon cho Album (nếu không có thì có thể thay bằng cilMediaPlay)
  cilUser, // Icon cho Artist
  cilTag, // Icon cho TypeSong
} from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react';

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: 'dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'User',
    to: 'user',
    icon: <CIcon icon={cilStar} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Song',
    to: 'song',
    icon: <CIcon icon={cilMusicNote} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'PlayList',
    to: 'playlist',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />, // Thay thế nếu không có cilPlaylistAdd
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Album',
    to: 'album',
    icon: <CIcon icon={cilAlbum} customClassName="nav-icon" />, // Thay thế nếu không có cilAlbum
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'Artist',
    to: 'artist',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
  {
    component: CNavItem,
    name: 'TypeSong',
    to: 'typesong',
    icon: <CIcon icon={cilTag} customClassName="nav-icon" />,
    badge: {
      color: 'info',
      text: 'NEW',
    },
  },
];

export default _nav;