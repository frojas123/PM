
import React from 'react';

const Header = ({ toggleSidebar, isSidebarCollapsed, title }) => {
    return (
        <header className="flex-shrink-0 h-20 bg-primary flex items-center justify-between px-4 md:px-6 shadow-md z-10">
            <div className="flex items-center">
                <button 
                    onClick={toggleSidebar} 
                    className="p-2 rounded-full text-slate-400 hover:bg-secondary hover:text-light focus:outline-none focus:ring-2 focus:ring-accent"
                >
                    <i className={`fas ${isSidebarCollapsed ? 'fa-bars' : 'fa-times'}`}></i>
                </button>
                <h1 className="ml-4 text-xl md:text-2xl font-semibold text-light">{title}</h1>
            </div>
            <div className="flex items-center space-x-4">
                <button className="p-2 rounded-full text-slate-400 hover:bg-secondary hover:text-light">
                    <i className="fas fa-bell"></i>
                </button>
                <button className="p-2 rounded-full text-slate-400 hover:bg-secondary hover:text-light">
                    <i className="fas fa-envelope"></i>
                </button>
            </div>
        </header>
    );
};

export default Header;