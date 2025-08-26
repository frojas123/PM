
import React from 'react';
import { navItems } from '../constants.js';

const Sidebar = ({ isCollapsed, activeView, setActiveView }) => {
    return (
        <aside className={`fixed top-0 left-0 h-full bg-primary text-light flex flex-col shadow-lg transition-all duration-300 ease-in-out ${isCollapsed ? 'w-[60px]' : 'w-64'}`}>
            <div className="flex items-center justify-center h-20 border-b border-secondary">
                <i className={`fas fa-tasks text-accent text-2xl ${isCollapsed ? '' : 'mr-3'}`}></i>
                <h1 className={`text-xl font-bold transition-opacity duration-200 ${isCollapsed ? 'opacity-0 w-0' : 'opacity-100'}`}>PM Gestor</h1>
            </div>
            <nav className="flex-1 overflow-y-auto">
                <ul>
                    {navItems.map(item => (
                        <li key={item.id} className="my-2">
                            <a
                                href="#"
                                onClick={(e) => { e.preventDefault(); setActiveView(item.id); }}
                                className={`flex items-center py-3 transition-colors duration-200 group ${isCollapsed ? 'px-[18px]' : 'px-6'} ${activeView === item.id ? 'bg-accent text-white' : 'hover:bg-secondary'}`}
                            >
                                <span className={`text-lg w-6 text-center ${activeView === item.id ? 'text-white' : 'text-slate-400 group-hover:text-light'}`}>
                                  {item.icon}
                                </span>
                                <span className={`ml-4 font-medium whitespace-nowrap transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                                    {item.label}
                                </span>
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
            <div className="p-4 border-t border-secondary">
                 <div className="flex items-center">
                    <img src={`https://picsum.photos/seed/user/40/40`} alt="User Avatar" className="w-10 h-10 rounded-full" />
                    <div className={`ml-3 transition-opacity duration-200 ${isCollapsed ? 'opacity-0' : 'opacity-100'}`}>
                        <p className="text-sm font-semibold">Admin</p>
                        <p className="text-xs text-slate-400">Project Manager</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;