import React, { useState, useCallback } from 'react';
import Sidebar from './components/Sidebar.js';
import Header from './components/Header.js';
import Dashboard from './components/Dashboard.js';
import Clients from './components/Clients.js';
import Trainings from './components/Trainings.js';
import Settings from './components/Settings.js';
import Calendar from './components/Calendar.js';
import Checklists from './components/Checklists.js';
import Ecommerce from './components/Ecommerce.js';
import AppPedido from './components/AppPedido.js';
import Kos from './components/Kos.js';
import { navItems } from './constants.js';
import { AppProvider } from './contexts/AppContext.js';
import useAppData from './hooks/useAppData.js';
import Spinner from './components/shared/Spinner.js';

const AppContent = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed(prevState => !prevState);
    }, []);

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard':
                return <Dashboard />;
            case 'clients':
                return <Clients />;
            case 'trainings':
                return <Trainings />;
            case 'calendar':
                return <Calendar />;
            case 'checklists':
                 return <Checklists />;
            case 'ecommerce':
                return <Ecommerce />;
            case 'app_pedido':
                return <AppPedido />;
            case 'kos':
                return <Kos />;
            case 'settings':
                return <Settings />;
            default:
                return <Dashboard />;
        }
    };

    const currentViewTitle = navItems.find(item => item.id === activeView)?.label || 'Dashboard';

    return (
        <div className="flex h-screen bg-primary text-light overflow-hidden">
            <Sidebar 
                isCollapsed={isSidebarCollapsed} 
                activeView={activeView} 
                setActiveView={setActiveView} 
            />
            <div className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-[60px]' : 'ml-64'}`}>
                <Header 
                    toggleSidebar={toggleSidebar} 
                    isSidebarCollapsed={isSidebarCollapsed}
                    title={currentViewTitle}
                />
                <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-dark/50">
                    {renderActiveView()}
                </main>
            </div>
        </div>
    );
};


const App = () => {
    const { data, loading } = useAppData();

    if (loading || !data) {
        return (
            <div className="flex h-screen justify-center items-center bg-primary">
                <Spinner />
            </div>
        )
    }

    return (
        <AppProvider initialData={data}>
            <AppContent />
        </AppProvider>
    );
};


export default App;