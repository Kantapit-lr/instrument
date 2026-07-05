import SearchBar from './SearchBar';
import UserProfile from './UserProfile';

export default function Topbar() {
  return (
    <header className="h-20 flex items-center justify-between px-6 bg-transparent">
      {/* ฝั่งซ้าย: ช่องค้นหา */}
      <SearchBar />

      {/* ฝั่งขวา: ข้อมูลผู้ใช้งาน */}
      <UserProfile />
    </header>
  );
}