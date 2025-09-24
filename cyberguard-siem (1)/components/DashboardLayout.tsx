import React, { useState, useEffect, useRef } from 'react';
import { Page } from '../types';
import { 
    CyberguardIcon, ChartBarIcon, SearchIcon, BookOpenIcon, 
    BellIcon, ExclamationTriangleIcon, InformationCircleIcon, FireIcon,
    ThreatIntelligenceIcon, ExpandIcon, RefreshIcon, MenuIcon
} from './icons';
import { initialNotifications } from '../data/notifications';

interface DashboardLayoutProps {
  activePage: Page;
  setActivePage: (page: Page) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

const NavItem: React.FC<{ icon: React.ReactNode; label: Page; activePage: Page; onClick: () => void; }> = ({ icon, label, activePage, onClick }) => (
  <li>
    <a
      href="#"
      onClick={(e) => { e.preventDefault(); onClick(); }}
      className={`flex items-center p-3 text-base font-normal rounded-lg transition-all duration-200 ${
        activePage === label ? 'bg-blue-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700'
      }`}
    >
      {icon}
      <span className="ml-3">{label}</span>
    </a>
  </li>
);

export type Notification = {
    id: number;
    type: 'Critical' | 'High' | 'System';
    message: string;
    timestamp: string;
    isRead: boolean;
};

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ activePage, setActivePage, onLogout, children }) => {
    const navItems = [
        { icon: <ChartBarIcon className="h-6 w-6"/>, label: Page.Dashboard },
        { icon: <SearchIcon className="h-6 w-6"/>, label: Page.OsintTools },
        { icon: <ThreatIntelligenceIcon className="h-6 w-6"/>, label: Page.ThreatIntelligence },
        { icon: <BookOpenIcon className="h-6 w-6"/>, label: Page.SecurityResources },
    ];

    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
    const notificationsRef = useRef<HTMLDivElement>(null);

    const hasUnread = notifications.some(n => !n.isRead);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
                setIsNotificationsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    const toggleNotifications = () => {
        setIsNotificationsOpen(!isNotificationsOpen);
    };

    const markAllAsRead = () => {
        setNotifications(notifications.map(n => ({ ...n, isRead: true })));
    };

    const getNotificationStyle = (type: Notification['type']) => {
        switch (type) {
            case 'Critical': return { icon: <FireIcon className="h-5 w-5 text-red-400" />, title: 'Critical Alert', titleColor: 'text-red-400' };
            case 'High': return { icon: <ExclamationTriangleIcon className="h-5 w-5 text-orange-400" />, title: 'High Alert', titleColor: 'text-orange-400' };
            case 'System': return { icon: <InformationCircleIcon className="h-5 w-5 text-blue-400" />, title: 'System Update', titleColor: 'text-blue-400' };
        }
    };
  
    return (
    <div className="relative min-h-screen lg:flex bg-gray-900 bg-grid-gray-700/[0.2]">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800/80 backdrop-blur-sm border-r border-gray-700 flex flex-col transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${ isSidebarOpen ? 'translate-x-0' : '-translate-x-full' }`}>
        <div className="h-20 flex items-center justify-center px-4 border-b border-gray-700">
          <CyberguardIcon className="h-8 w-8 text-blue-500"/>
          <span className="ml-2 text-2xl font-bold text-white">Cyberguard</span>
        </div>
        <nav className="flex-1 px-4 py-6">
          <ul className="space-y-2">
            {navItems.map(item => (
                <NavItem 
                    key={item.label} 
                    icon={item.icon} 
                    label={item.label} 
                    activePage={activePage} 
                    onClick={() => {
                        setActivePage(item.label);
                        setIsSidebarOpen(false);
                    }} 
                />
            ))}
          </ul>
        </nav>
      </aside>

      {/* Backdrop */}
      {isSidebarOpen && <div className="fixed inset-0 bg-black/60 z-20 lg:hidden" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* Main Content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <header className="h-20 bg-gray-800/80 backdrop-blur-sm border-b border-gray-700 flex items-center justify-between px-4 sm:px-8">
            <button
                onClick={() => setIsSidebarOpen(true)}
                className="text-gray-400 hover:text-white transition-colors lg:hidden"
                aria-label="Open sidebar"
            >
                <MenuIcon className="h-6 w-6" />
            </button>
            <div className="hidden lg:block"></div> {/* Spacer for desktop */}
            <div className="flex items-center space-x-4 sm:space-x-6">

                <div className="relative" ref={notificationsRef}>
                    <button onClick={toggleNotifications} className="relative text-gray-400 hover:text-white transition-colors" aria-label="Toggle notifications">
                        <BellIcon className="h-6 w-6"/>
                        {hasUnread && <span className="absolute top-0 right-0 h-2.5 w-2.5 border-2 border-gray-800 bg-red-500 rounded-full"></span>}
                    </button>
                    {isNotificationsOpen && (
                        <div className="absolute right-0 mt-3 w-80 bg-gray-800 border border-gray-600 rounded-lg shadow-xl z-20 origin-top-right animate-fade-in-down">
                            <div className="p-3 border-b border-gray-700 flex justify-between items-center">
                                <h3 className="font-semibold text-gray-200">Notifications</h3>
                                <button onClick={markAllAsRead} disabled={!hasUnread} className="text-xs text-blue-400 hover:underline disabled:text-gray-500 disabled:no-underline">Mark all as read</button>
                            </div>
                            <ul className="py-1 max-h-80 overflow-y-auto">
                                {notifications.length > 0 ? notifications.map(notification => {
                                    const { icon, title, titleColor } = getNotificationStyle(notification.type);
                                    return (
                                        <li key={notification.id} className={`flex gap-3 px-4 py-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700/50 ${!notification.isRead ? 'bg-blue-900/20' : ''}`}>
                                            <div className="flex-shrink-0 mt-1">{icon}</div>
                                            <div>
                                                <p className={`text-sm font-semibold ${titleColor}`}>{title}</p>
                                                <p className="text-xs text-gray-400">{notification.message}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.timestamp}</p>
                                            </div>
                                            {!notification.isRead && <div className="ml-auto flex-shrink-0 self-center h-2 w-2 bg-blue-500 rounded-full"></div>}
                                        </li>
                                    );
                                }) : (
                                    <li className="px-4 py-6 text-center text-sm text-gray-500">No new notifications.</li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>
                
                <button onClick={() => {}} className="text-gray-400 hover:text-white transition-colors" aria-label="Toggle fullscreen">
                    <ExpandIcon className="h-6 w-6"/>
                </button>

                <button onClick={() => window.location.reload()} className="text-gray-400 hover:text-white transition-colors" aria-label="Refresh data">
                    <RefreshIcon className="h-6 w-6"/>
                </button>
            </div>
        </header>
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};