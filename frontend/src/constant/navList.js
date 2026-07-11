import { MdHome, MdAgriculture, MdAdd, MdMenuBook, MdHistory } from 'react-icons/md';

export const navLinks = [
  { key: 'home', label: 'Home', icon: MdHome, path: '/dashboard' },
  { key: 'farm', label: 'Farm', icon: MdAgriculture, path: '/farm' },
];

export const navLinksRight = [
  { key: 'journal', label: 'Journal', icon: MdMenuBook, path: '/journal' },
  { key: 'history', label: 'History', icon: MdHistory, path: '/scan/history' },
];
