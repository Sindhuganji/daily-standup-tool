import { Outlet } from 'react-router-dom';

import Sidebar from './Sidebar';

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 text-white flex">
      <Sidebar />
      <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}