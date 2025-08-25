import React from 'react';

export type View = 'dashboard' | 'clients' | 'trainings' | 'calendar' | 'checklists' | 'ecommerce' | 'app_pedido' | 'kos' | 'settings';

export const navItems: { id: View; label: string; icon: React.ReactNode }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <i className="fas fa-chart-pie"></i> },
    { id: 'clients', label: 'Clientes', icon: <i className="fas fa-users"></i> },
    { id: 'trainings', label: 'Capacitaciones', icon: <i className="fas fa-chalkboard-teacher"></i> },
    { id: 'calendar', label: 'Calendario', icon: <i className="fas fa-calendar-alt"></i> },
    { id: 'checklists', label: 'Checklists', icon: <i className="fas fa-tasks"></i> },
    { id: 'ecommerce', label: 'Ecommerce', icon: <i className="fas fa-shopping-cart"></i> },
    { id: 'app_pedido', label: 'App Pedido', icon: <i className="fas fa-mobile-alt"></i> },
    { id: 'kos', label: 'KOS', icon: <i className="fas fa-laptop-medical"></i> },
    { id: 'settings', label: 'Configuración', icon: <i className="fas fa-cogs"></i> },
];
