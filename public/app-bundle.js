// PM Gestor Pro - Bundle completo para GitHub Pages
const { useState, useCallback, useContext, createContext, useEffect } = React;
const { createRoot } = ReactDOM;

// Constants
const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: React.createElement('i', { className: 'fas fa-chart-pie' }) },
    { id: 'clients', label: 'Clientes', icon: React.createElement('i', { className: 'fas fa-users' }) },
    { id: 'trainings', label: 'Capacitaciones', icon: React.createElement('i', { className: 'fas fa-chalkboard-teacher' }) },
    { id: 'calendar', label: 'Calendario', icon: React.createElement('i', { className: 'fas fa-calendar-alt' }) },
    { id: 'checklists', label: 'Checklists', icon: React.createElement('i', { className: 'fas fa-tasks' }) },
    { id: 'ecommerce', label: 'Ecommerce', icon: React.createElement('i', { className: 'fas fa-shopping-cart' }) },
    { id: 'app_pedido', label: 'App Pedido', icon: React.createElement('i', { className: 'fas fa-mobile-alt' }) },
    { id: 'kos', label: 'KOS', icon: React.createElement('i', { className: 'fas fa-laptop-medical' }) },
    { id: 'settings', label: 'Configuración', icon: React.createElement('i', { className: 'fas fa-cogs' }) },
];

// Spinner Component
const Spinner = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
    );
};

// Simple Dashboard Component
const Dashboard = () => {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-light">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-secondary/20 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-light mb-2">Clientes Activos</h3>
                    <p className="text-3xl font-bold text-accent">12</p>
                </div>
                <div className="bg-secondary/20 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-light mb-2">Proyectos</h3>
                    <p className="text-3xl font-bold text-accent">8</p>
                </div>
                <div className="bg-secondary/20 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-light mb-2">Capacitaciones</h3>
                    <p className="text-3xl font-bold text-accent">15</p>
                </div>
            </div>
        </div>
    );
};

// Simple placeholder components
const Clients = () => <div className="text-light"><h1 className="text-2xl font-bold mb-4">Clientes</h1><p>Gestión de clientes en desarrollo...</p></div>;
const Trainings = () => <div className="text-light"><h1 className="text-2xl font-bold mb-4">Capacitaciones</h1><p>Módulo de capacitaciones en desarrollo...</p></div>;
const Calendar = () => <div className="text-light"><h1 className="text-2xl font-bold mb-4">Calendario</h1><p>Calendario de eventos en desarrollo...</p></div>;
const Checklists = () => <div className="text-light"><h1 className="text-2xl font-bold mb-4">Checklists</h1><p>Sistema de checklists en desarrollo...</p></div>;
const Ecommerce = () => <div className="text-light"><h1 className="text-2xl font-bold mb-4">Ecommerce</h1><p>Módulo de ecommerce en desarrollo...</p></div>;
const AppPedido = () => <div className="text-light"><h1 className="text-2xl font-bold mb-4">App Pedido</h1><p>Aplicación de pedidos en desarrollo...</p></div>;
const Kos = () => <div className="text-light"><h1 className="text-2xl font-bold mb-4">KOS</h1><p>Sistema KOS en desarrollo...</p></div>;
const Settings = () => <div className="text-light"><h1 className="text-2xl font-bold mb-4">Configuración</h1><p>Configuraciones del sistema en desarrollo...</p></div>;

// Sidebar Component
const Sidebar = ({ isCollapsed, activeView, setActiveView }) => {
    return (
        <div className={`fixed left-0 top-0 h-full bg-secondary transition-all duration-300 ease-in-out z-50 ${isCollapsed ? 'w-[60px]' : 'w-64'}`}>
            <div className="p-4">
                <div className="flex items-center space-x-3 mb-8">
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
                        <i className="fas fa-project-diagram text-primary"></i>
                    </div>
                    {!isCollapsed && <h1 className="text-xl font-bold text-light">PM Gestor Pro</h1>}
                </div>
                
                <nav className="space-y-2">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveView(item.id)}
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
                                activeView === item.id 
                                    ? 'bg-accent text-primary' 
                                    : 'text-light hover:bg-primary/20'
                            }`}
                        >
                            <span className="w-5 h-5 flex items-center justify-center">
                                {item.icon}
                            </span>
                            {!isCollapsed && <span>{item.label}</span>}
                        </button>
                    ))}
                </nav>
            </div>
        </div>
    );
};

// Header Component
const Header = ({ toggleSidebar, isSidebarCollapsed, title }) => {
    return (
        <header className="bg-secondary/30 border-b border-secondary/50 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <button
                    onClick={toggleSidebar}
                    className="p-2 rounded-lg hover:bg-primary/20 transition-colors text-light"
                >
                    <i className="fas fa-bars"></i>
                </button>
                <h2 className="text-lg font-semibold text-light">{title}</h2>
            </div>
            <div className="flex items-center space-x-4">
                <span className="text-sm text-light/70">PM Gestor Pro v1.0</span>
            </div>
        </header>
    );
};

// Simple hook for app data
const useAppData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate loading
        setTimeout(() => {
            setData({ initialized: true });
            setLoading(false);
        }, 1000);
    }, []);

    return { data, loading };
};

// Simple context
const AppContext = createContext();
const AppProvider = ({ children, initialData }) => {
    const [appData, setAppData] = useState(initialData);
    
    return React.createElement(AppContext.Provider, {
        value: { appData, setAppData }
    }, children);
};

// Main App Components
const AppContent = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed(prevState => !prevState);
    }, []);

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard': return <Dashboard />;
            case 'clients': return <Clients />;
            case 'trainings': return <Trainings />;
            case 'calendar': return <Calendar />;
            case 'checklists': return <Checklists />;
            case 'ecommerce': return <Ecommerce />;
            case 'app_pedido': return <AppPedido />;
            case 'kos': return <Kos />;
            case 'settings': return <Settings />;
            default: return <Dashboard />;
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
        );
    }

    return (
        <AppProvider initialData={data}>
            <AppContent />
        </AppProvider>
    );
};

// Initialize the app
const rootElement = document.getElementById('root');
if (!rootElement) {
    throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
    React.createElement(React.StrictMode, null,
        React.createElement(App)
    )
);