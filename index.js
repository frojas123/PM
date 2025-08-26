
// Importar React desde el CDN
const { useState, useCallback, useContext, createContext, useEffect } = React;
const { createRoot } = ReactDOM;

// Importar componentes y utilidades (se cargarán como scripts)
// Los componentes se definirán globalmente

const AppContent = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed(prevState => !prevState);
    }, []);

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard':
                return React.createElement(Dashboard);
            case 'clients':
                return React.createElement(Clients);
            case 'trainings':
                return React.createElement(Trainings);
            case 'calendar':
                return React.createElement(Calendar);
            case 'checklists':
                return React.createElement(Checklists);
            case 'ecommerce':
                return React.createElement(Ecommerce);
            case 'app_pedido':
                return React.createElement(AppPedido);
            case 'kos':
                return React.createElement(Kos);
            case 'settings':
                return React.createElement(Settings);
            default:
                return React.createElement(Dashboard);
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

// Inicializar la aplicación
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);