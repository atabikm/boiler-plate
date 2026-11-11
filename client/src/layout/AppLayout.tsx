import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

export default function AppLayout(){
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            <Sidebar collapsed={sidebarCollapsed}/>
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <Header onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}/>
                <main className="flex-1 overflow-y-auto p-6">
                    <Outlet/>
                </main>
            </div>
        </div>
    )
}