// PM Gestor Pro - Bundle completo para GitHub Pages
const { useState, useCallback, useContext, createContext, useEffect, useMemo } = React;
const { createRoot } = ReactDOM;

// Add global styles for better contrast
const addGlobalStyles = () => {
    if (document.getElementById('pm-global-styles')) return;

    const style = document.createElement('style');
    style.id = 'pm-global-styles';
    style.textContent = `
        /* Force better contrast for all select elements with highest specificity */
        body select,
        div select,
        form select {
            background-color: #FFFFFF !important;
            color: #1F2937 !important;
            border: 2px solid #6B7280 !important;
            -webkit-appearance: none !important;
            -moz-appearance: none !important;
            appearance: none !important;
        }
        
        body select:focus,
        div select:focus,
        form select:focus {
            background-color: #F3F4F6 !important;
            border-color: #10B981 !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
        }
        
        /* Ensure option elements have proper styling with highest specificity */
        body select option,
        div select option,
        form select option {
            background-color: #FFFFFF !important;
            color: #1F2937 !important;
            padding: 8px 12px !important;
            border: none !important;
        }
        
        body select option:hover,
        body select option:focus,
        body select option:checked,
        body select option[selected] {
            background-color: #10B981 !important;
            color: #FFFFFF !important;
        }
        
        /* Input styling improvements with highest specificity */
        body input[type="text"], 
        body input[type="email"], 
        body input[type="number"], 
        body input[type="date"], 
        body input[type="datetime-local"], 
        body textarea,
        div input[type="text"], 
        div input[type="email"], 
        div input[type="number"], 
        div input[type="date"], 
        div input[type="datetime-local"], 
        div textarea {
            background-color: #FFFFFF !important;
            color: #1F2937 !important;
            border: 2px solid #6B7280 !important;
        }
        
        body input::placeholder, 
        body textarea::placeholder,
        div input::placeholder, 
        div textarea::placeholder {
            color: #6B7280 !important;
            opacity: 1 !important;
        }
        
        body input:focus, 
        body textarea:focus,
        div input:focus, 
        div textarea:focus {
            background-color: #F9FAFB !important;
            border-color: #10B981 !important;
            outline: none !important;
            box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1) !important;
        }
        
        /* Additional styling for better visibility */
        .pm-select-wrapper {
            position: relative;
        }
        
        .pm-select-wrapper::after {
            content: '▼';
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #374151;
            pointer-events: none;
            font-size: 12px;
        }
        
        /* Additional fallback for stubborn browsers */
        select * {
            background-color: #FFFFFF !important;
            color: #1F2937 !important;
        }
    `;
    document.head.appendChild(style);
};

// Apply styles when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addGlobalStyles);
} else {
    addGlobalStyles();
}

// Check if Recharts is available
const isRechartsAvailable = () => {
    return typeof window !== 'undefined' && typeof window.Recharts !== 'undefined';
};

// Get Recharts components safely
const getRechartsComponent = (componentName) => {
    if (isRechartsAvailable()) {
        return window.Recharts[componentName];
    }
    return null;
};

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

// Sample Data
const initialClients = [
    {
        id: 1,
        legalName: "TechSolve Ltda.",
        fantasyName: "TechSolve",
        status: "Activo",
        industry: "Tecnología",
        connectionType: "VPN",
        contractType: "Mensual",
        registrationDate: "2023-01-15",
        expectedGoLiveDate: "2023-03-01",
        actualGoLiveDate: "2023-02-28",
        licenses: 20,
        databaseName: "techsolve_db",
        emissionModel: "Boleta Electrónica",
        clientEmail: "contacto@techsolve.cl",
        clientEmail2: "admin@techsolve.cl",
        clientEmail3: "",
        asanaLink: "https://app.asana.com/project/techsolve",
        crmLink: "https://crm.company.com/techsolve",
        observations: "Cliente muy activo, requiere soporte técnico frecuente"
    },
    {
        id: 2,
        legalName: "Gourmet Foods Ltda.",
        fantasyName: "Gourmet Market",
        status: "Implementación",
        industry: "Alimentos",
        connectionType: "Internet",
        contractType: "Anual",
        registrationDate: "2023-05-20",
        expectedGoLiveDate: "2023-08-01",
        actualGoLiveDate: null,
        licenses: 15,
        databaseName: "gourmet_db",
        emissionModel: "Factura Electrónica",
        clientEmail: "gerencia@gourmetmarket.cl",
        clientEmail2: "sistemas@gourmetmarket.cl",
        clientEmail3: "ventas@gourmetmarket.cl",
        asanaLink: "https://app.asana.com/project/gourmet",
        crmLink: "https://crm.company.com/gourmet",
        observations: "Implementación compleja, múltiples sucursales"
    },
    {
        id: 3,
        legalName: "Constructora ConSur S.A.",
        fantasyName: "ConSur",
        status: "Activo",
        industry: "Construcción",
        connectionType: "VPN",
        contractType: "Anual",
        registrationDate: "2022-11-10",
        expectedGoLiveDate: "2023-01-15",
        actualGoLiveDate: "2023-01-12",
        licenses: 25,
        databaseName: "consur_db",
        emissionModel: "Factura Electrónica",
        clientEmail: "admin@consur.cl",
        clientEmail2: "contabilidad@consur.cl",
        clientEmail3: "",
        asanaLink: "https://app.asana.com/project/consur",
        crmLink: "https://crm.company.com/consur",
        observations: "Cliente estable, pagos puntuales"
    },
    {
        id: 4,
        legalName: "FastFashion SpA",
        fantasyName: "FastFashion",
        status: "En Pausa",
        industry: "Retail",
        connectionType: "Internet",
        contractType: "Mensual",
        registrationDate: "2023-03-05",
        expectedGoLiveDate: "2023-06-01",
        actualGoLiveDate: null,
        licenses: 10,
        databaseName: "fastfashion_db",
        emissionModel: "Boleta Electrónica",
        clientEmail: "ti@fastfashion.cl",
        clientEmail2: "",
        clientEmail3: "",
        asanaLink: "https://app.asana.com/project/fastfashion",
        crmLink: "https://crm.company.com/fastfashion",
        freezeDate: "2023-04-15",
        freezeReason: "Reestructuración interna",
        freezeDetails: "Cliente solicitó pausa por cambios organizacionales",
        observations: "Pendiente reactivación post-reestructuración"
    },
    {
        id: 5,
        legalName: "Clínica Dental Sonrisa Ltda.",
        fantasyName: "Clínica Sonrisa",
        status: "Activo",
        industry: "Salud",
        connectionType: "Internet",
        contractType: "Anual",
        registrationDate: "2023-02-20",
        expectedGoLiveDate: "2023-04-01",
        actualGoLiveDate: "2023-03-28",
        licenses: 8,
        databaseName: "sonrisa_db",
        emissionModel: "Boleta Electrónica",
        clientEmail: "administracion@clinicasonrisa.cl",
        clientEmail2: "recepcion@clinicasonrisa.cl",
        clientEmail3: "",
        asanaLink: "https://app.asana.com/project/sonrisa",
        crmLink: "https://crm.company.com/sonrisa",
        observations: "Cliente satisfecho, posible expansión"
    }
];

const initialTrainings = [
    {
        id: 1,
        clientId: 2,
        type: "PM",
        topic: "Configuración Inicial del Sistema",
        responsible: "Juan Pérez",
        dateTime: "2023-12-15T10:00:00",
        status: "AGENDADA",
        observations: "Primera capacitación técnica"
    },
    {
        id: 2,
        clientId: 2,
        type: "General",
        topic: "Uso Básico del Sistema",
        responsible: "María González",
        dateTime: "2023-12-20T14:00:00",
        status: "AGENDADA",
        observations: "Capacitación para usuarios finales"
    },
    {
        id: 3,
        clientId: 1,
        type: "PM",
        topic: "Reportes y Analytics",
        responsible: "Carlos Silva",
        dateTime: "2023-11-28T09:00:00",
        status: "COMPLETADA",
        observations: "Capacitación completada exitosamente"
    },
    {
        id: 4,
        clientId: 3,
        type: "General",
        topic: "Gestión de Ventas",
        responsible: "Ana Martínez",
        dateTime: "2023-12-01T11:00:00",
        status: "COMPLETADA",
        observations: "Cliente muy receptivo"
    },
    {
        id: 5,
        clientId: 5,
        type: "PM",
        topic: "Gestión de Usuarios y Permisos",
        responsible: "Juan Pérez",
        dateTime: "2023-12-25T15:00:00",
        status: "REAGENDADA",
        observations: "Reagendada por feriados"
    }
];

// Configuration options
const configOptions = {
    clientStatuses: ["Activo", "Implementación", "En Pausa", "Cancelado"],
    industries: ["Tecnología", "Alimentos", "Construcción", "Retail", "Salud", "Educación", "Finanzas"],
    connectionTypes: ["Internet", "VPN", "Dedicada"],
    contractTypes: ["Mensual", "Anual", "Por Proyecto"],
    emissionModels: ["Boleta Electrónica", "Factura Electrónica", "Mixto"],
    freezeReasons: ["Reestructuración interna", "Problemas financieros", "Cambio de prioridades", "Otros"],
    pmTopics: ["Configuración Inicial del Sistema", "Gestión de Usuarios y Permisos", "Reportes y Analytics", "Parametrización Avanzada"],
    generalTopics: ["Uso Básico del Sistema", "Gestión de Ventas", "Inventario y Stock", "Facturación Electrónica"],
    responsibles: ["Juan Pérez", "María González", "Carlos Silva", "Ana Martínez", "Luis Rodriguez"],
    trainingStatuses: ["AGENDADA", "EN PROCESO", "REAGENDADA", "CANCELADA", "COMPLETADA"]
};

// Spinner Component
const Spinner = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent"></div>
        </div>
    );
};

// Dashboard Component with comprehensive analytics
const Dashboard = () => {
    const { appData, getStatistics } = useContext(AppContext);
    const [selectedPeriod, setSelectedPeriod] = useState('month');
    const [refreshKey, setRefreshKey] = useState(0);

    const stats = useMemo(() => getStatistics(), [getStatistics, refreshKey]);

    const clients = appData?.clients || [];
    const trainings = appData?.trainings || [];

    // Calculate metrics with trends
    const totalClients = clients.length;
    const activeClients = clients.filter(c => c.status === 'Activo').length;
    const implementationClients = clients.filter(c => c.status === 'Implementación').length;
    const pausedClients = clients.filter(c => c.status === 'En Pausa').length;

    // Training metrics
    const completedTrainings = trainings.filter(t => t.status === 'COMPLETADA').length;
    const scheduledTrainings = trainings.filter(t => t.status === 'AGENDADA').length;
    const pmTrainings = trainings.filter(t => t.type === 'PM').length;
    const generalTrainings = trainings.filter(t => t.type === 'General').length;

    // Recent activity
    const recentClients = useMemo(() => {
        return clients
            .sort((a, b) => new Date(b.registrationDate) - new Date(a.registrationDate))
            .slice(0, 5);
    }, [clients]);

    const upcomingTrainings = useMemo(() => {
        const now = new Date();
        return trainings
            .filter(t => new Date(t.dateTime) > now && t.status === 'AGENDADA')
            .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
            .slice(0, 5);
    }, [trainings]);

    // Data for charts
    const statusData = useMemo(() => {
        const statusCount = {};
        clients.forEach(client => {
            statusCount[client.status] = (statusCount[client.status] || 0) + 1;
        });
        return Object.entries(statusCount).map(([status, count]) => ({
            name: status,
            value: count,
            percentage: ((count / totalClients) * 100).toFixed(1)
        }));
    }, [clients, totalClients]);

    const industryData = useMemo(() => {
        const industryCount = {};
        clients.forEach(client => {
            if (client.industry) {
                industryCount[client.industry] = (industryCount[client.industry] || 0) + 1;
            }
        });
        return Object.entries(industryCount)
            .map(([industry, count]) => ({
                name: industry,
                value: count,
                percentage: ((count / totalClients) * 100).toFixed(1)
            }))
            .sort((a, b) => b.value - a.value);
    }, [clients, totalClients]);

    const trainingTrendData = useMemo(() => {
        const last6Months = [];
        const now = new Date();

        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('es-ES', { month: 'short' });
            const monthTrainings = trainings.filter(t => {
                const trainingDate = new Date(t.dateTime);
                return trainingDate.getMonth() === date.getMonth() &&
                    trainingDate.getFullYear() === date.getFullYear();
            });

            last6Months.push({
                month: monthName,
                completed: monthTrainings.filter(t => t.status === 'COMPLETADA').length,
                scheduled: monthTrainings.filter(t => t.status === 'AGENDADA').length,
                total: monthTrainings.length
            });
        }

        return last6Months;
    }, [trainings]);

    const COLORS = ['#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#F97316'];

    const refreshData = () => {
        setRefreshKey(prev => prev + 1);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-light">Dashboard Ejecutivo</h1>
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedPeriod}
                        onChange={(e) => setSelectedPeriod(e.target.value)}
                        className="px-3 py-2 bg-secondary/80 border border-secondary/50 rounded-lg text-light text-sm focus:outline-none focus:border-accent focus:bg-secondary"
                        style={{ backgroundColor: '#374151', color: '#F9FAFB' }}
                    >
                        <option value="week" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>Esta Semana</option>
                        <option value="month" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>Este Mes</option>
                        <option value="quarter" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>Este Trimestre</option>
                        <option value="year" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>Este Año</option>
                    </select>
                    <button
                        onClick={refreshData}
                        className="p-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-colors"
                        title="Actualizar datos"
                    >
                        <i className="fas fa-sync-alt"></i>
                    </button>
                </div>
            </div>

            {/* Key Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-light/70">Total Clientes</h3>
                            <p className="text-3xl font-bold text-light">{totalClients}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-xs text-green-400">
                                    +{stats.clients.thisMonth} este mes
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-blue-500/20 rounded-full">
                            <i className="fas fa-users text-blue-400 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-light/70">Clientes Activos</h3>
                            <p className="text-3xl font-bold text-green-400">{activeClients}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-xs text-light/50">
                                    {((activeClients / totalClients) * 100).toFixed(1)}% del total
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-green-500/20 rounded-full">
                            <i className="fas fa-check-circle text-green-400 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-light/70">En Implementación</h3>
                            <p className="text-3xl font-bold text-yellow-400">{implementationClients}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-xs text-light/50">
                                    {pausedClients} en pausa
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-yellow-500/20 rounded-full">
                            <i className="fas fa-cog text-yellow-400 text-xl"></i>
                        </div>
                    </div>
                </div>

                <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30 hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-sm font-medium text-light/70">Capacitaciones</h3>
                            <p className="text-3xl font-bold text-purple-400">{completedTrainings}</p>
                            <div className="flex items-center mt-2">
                                <span className="text-xs text-light/50">
                                    {scheduledTrainings} programadas
                                </span>
                            </div>
                        </div>
                        <div className="p-3 bg-purple-500/20 rounded-full">
                            <i className="fas fa-chalkboard-teacher text-purple-400 text-xl"></i>
                        </div>
                    </div>
                </div>
            </div>

            {/* Charts and Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Chart */}
                <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30">
                    <h3 className="text-lg font-semibold text-light mb-4">Estado de Clientes</h3>
                    {isRechartsAvailable() ? (
                        React.createElement(getRechartsComponent('ResponsiveContainer'), { width: "100%", height: 250 },
                            React.createElement(getRechartsComponent('PieChart'), {},
                                React.createElement(getRechartsComponent('Pie'), {
                                    data: statusData,
                                    cx: "50%",
                                    cy: "50%",
                                    labelLine: false,
                                    label: ({ name, percentage }) => `${name} ${percentage}%`,
                                    outerRadius: 80,
                                    fill: "#8884d8",
                                    dataKey: "value"
                                }, statusData.map((entry, index) =>
                                    React.createElement(getRechartsComponent('Cell'), {
                                        key: `cell-${index}`,
                                        fill: COLORS[index % COLORS.length]
                                    })
                                )),
                                React.createElement(getRechartsComponent('Tooltip'), {})
                            )
                        )
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-light/50">
                            <div className="text-center">
                                <i className="fas fa-chart-pie text-4xl mb-2"></i>
                                <div className="space-y-2">
                                    {statusData.map((item, index) => (
                                        <div key={index} className="text-sm flex justify-between">
                                            <span>{item.name}:</span>
                                            <span>{item.value} ({item.percentage}%)</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Industry Distribution */}
                <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30">
                    <h3 className="text-lg font-semibold text-light mb-4">Distribución por Rubro</h3>
                    <div className="space-y-3">
                        {industryData.map((item, index) => (
                            <div key={item.name} className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                    ></div>
                                    <span className="text-sm text-light">{item.name}</span>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm font-medium text-light">{item.value}</div>
                                    <div className="text-xs text-light/50">{item.percentage}%</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Training Trends */}
                <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30">
                    <h3 className="text-lg font-semibold text-light mb-4">Tendencia de Capacitaciones</h3>
                    {isRechartsAvailable() ? (
                        React.createElement(getRechartsComponent('ResponsiveContainer'), { width: "100%", height: 250 },
                            React.createElement(getRechartsComponent('BarChart'), { data: trainingTrendData },
                                React.createElement(getRechartsComponent('CartesianGrid'), { strokeDasharray: "3 3", stroke: "#374151" }),
                                React.createElement(getRechartsComponent('XAxis'), { dataKey: "month", stroke: "#9CA3AF" }),
                                React.createElement(getRechartsComponent('YAxis'), { stroke: "#9CA3AF" }),
                                React.createElement(getRechartsComponent('Tooltip'), {
                                    contentStyle: {
                                        backgroundColor: '#1F2937',
                                        border: '1px solid #374151',
                                        borderRadius: '8px'
                                    }
                                }),
                                React.createElement(getRechartsComponent('Bar'), { dataKey: "completed", fill: "#10B981", name: "Completadas" }),
                                React.createElement(getRechartsComponent('Bar'), { dataKey: "scheduled", fill: "#F59E0B", name: "Programadas" })
                            )
                        )
                    ) : (
                        <div className="h-[250px] flex items-center justify-center text-light/50">
                            <div className="text-center">
                                <i className="fas fa-chart-line text-4xl mb-2"></i>
                                <p>Tendencia de capacitaciones</p>
                                <div className="text-sm mt-2">
                                    <div>PM: {pmTrainings} | General: {generalTrainings}</div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Clients */}
                <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30">
                    <h3 className="text-lg font-semibold text-light mb-4">Clientes Recientes</h3>
                    <div className="space-y-3">
                        {recentClients.length === 0 ? (
                            <p className="text-light/50 text-sm">No hay clientes recientes</p>
                        ) : (
                            recentClients.map(client => (
                                <div key={client.id} className="flex items-center justify-between p-3 bg-primary/20 rounded-lg">
                                    <div>
                                        <div className="text-sm font-medium text-light">{client.legalName}</div>
                                        <div className="text-xs text-light/70">{client.industry}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className={`text-xs px-2 py-1 rounded-full ${client.status === 'Activo' ? 'bg-green-400/20 text-green-400' :
                                            client.status === 'Implementación' ? 'bg-yellow-400/20 text-yellow-400' :
                                                'bg-gray-400/20 text-gray-400'
                                            }`}>
                                            {client.status}
                                        </div>
                                        <div className="text-xs text-light/50 mt-1">
                                            {new Date(client.registrationDate).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Upcoming Trainings */}
                <div className="bg-secondary/20 p-6 rounded-lg border border-secondary/30">
                    <h3 className="text-lg font-semibold text-light mb-4">Próximas Capacitaciones</h3>
                    <div className="space-y-3">
                        {upcomingTrainings.length === 0 ? (
                            <p className="text-light/50 text-sm">No hay capacitaciones programadas</p>
                        ) : (
                            upcomingTrainings.map(training => {
                                const client = clients.find(c => c.id === training.clientId);
                                return (
                                    <div key={training.id} className="flex items-center justify-between p-3 bg-primary/20 rounded-lg">
                                        <div>
                                            <div className="text-sm font-medium text-light">{training.topic}</div>
                                            <div className="text-xs text-light/70">
                                                {client ? client.legalName : 'Cliente no encontrado'}
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className={`text-xs px-2 py-1 rounded-full ${training.type === 'PM' ? 'bg-purple-400/20 text-purple-400' : 'bg-cyan-400/20 text-cyan-400'
                                                }`}>
                                                {training.type}
                                            </div>
                                            <div className="text-xs text-light/50 mt-1">
                                                {new Date(training.dateTime).toLocaleDateString()} {new Date(training.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Modal Component
const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    if (!isOpen) return null;

    const sizeClasses = {
        sm: 'max-w-md',
        md: 'max-w-2xl',
        lg: 'max-w-4xl',
        xl: 'max-w-6xl'
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className={`bg-secondary rounded-lg ${sizeClasses[size]} w-full max-h-[90vh] overflow-y-auto`}>
                <div className="flex items-center justify-between p-6 border-b border-secondary/50">
                    <h2 className="text-xl font-semibold text-light">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-primary/20 rounded-lg transition-colors text-light"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
                <div className="p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// Client Form Component with Training History
const ClientForm = ({ client, onSave, onCancel }) => {
    const { appData } = useContext(AppContext);
    const [activeTab, setActiveTab] = useState('details');
    const [formData, setFormData] = useState(client || {
        legalName: '',
        fantasyName: '',
        status: 'Activo',
        industry: '',
        connectionType: 'Internet',
        contractType: 'Mensual',
        registrationDate: new Date().toISOString().split('T')[0],
        expectedGoLiveDate: '',
        actualGoLiveDate: '',
        licenses: 1,
        databaseName: '',
        emissionModel: 'Boleta Electrónica',
        clientEmail: '',
        clientEmail2: '',
        clientEmail3: '',
        asanaLink: '',
        crmLink: '',
        observations: ''
    });

    // Get client trainings
    const clientTrainings = useMemo(() => {
        if (!client) return [];
        return appData.trainings
            .filter(training => training.clientId === client.id)
            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));
    }, [appData.trainings, client]);

    // Get client activity summary
    const clientSummary = useMemo(() => {
        if (!client) return null;
        const trainings = clientTrainings;
        return {
            totalTrainings: trainings.length,
            completedTrainings: trainings.filter(t => t.status === 'COMPLETADA').length,
            scheduledTrainings: trainings.filter(t => t.status === 'AGENDADA').length,
            lastTraining: trainings.length > 0 ? trainings[0] : null,
            pmTrainings: trainings.filter(t => t.type === 'PM').length,
            generalTrainings: trainings.filter(t => t.type === 'General').length
        };
    }, [clientTrainings, client]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className="space-y-4">
            {/* Tabs */}
            <div className="flex border-b border-secondary/30">
                <button
                    type="button"
                    onClick={() => setActiveTab('details')}
                    className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'details'
                        ? 'border-accent text-accent'
                        : 'border-transparent text-light/70 hover:text-light'
                        }`}
                >
                    Detalles del Cliente
                </button>
                {client && (
                    <button
                        type="button"
                        onClick={() => setActiveTab('history')}
                        className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors ${activeTab === 'history'
                            ? 'border-accent text-accent'
                            : 'border-transparent text-light/70 hover:text-light'
                            }`}
                    >
                        Historial de Capacitaciones ({clientTrainings.length})
                    </button>
                )}
            </div>

            {activeTab === 'details' ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Client Summary Card */}
                    {client && clientSummary && (
                        <div className="bg-primary/30 p-4 rounded-lg border border-secondary/30">
                            <h4 className="text-sm font-semibold text-light mb-3">Resumen del Cliente</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-accent">{clientSummary.totalTrainings}</div>
                                    <div className="text-light/70">Total Capacitaciones</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-green-400">{clientSummary.completedTrainings}</div>
                                    <div className="text-light/70">Completadas</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-blue-400">{clientSummary.scheduledTrainings}</div>
                                    <div className="text-light/70">Programadas</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-2xl font-bold text-purple-400">{clientSummary.pmTrainings}</div>
                                    <div className="text-light/70">PM / {clientSummary.generalTrainings} General</div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Razón Social *</label>
                            <input
                                type="text"
                                value={formData.legalName}
                                onChange={(e) => handleChange('legalName', e.target.value)}
                                className="w-full px-3 py-2 bg-secondary/80 border border-secondary/50 rounded-lg text-light focus:outline-none focus:border-accent focus:bg-secondary"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Nombre de Fantasía</label>
                            <input
                                type="text"
                                value={formData.fantasyName}
                                onChange={(e) => handleChange('fantasyName', e.target.value)}
                                className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Estado</label>
                            <select
                                value={formData.status}
                                onChange={(e) => handleChange('status', e.target.value)}
                                className="w-full px-3 py-2 bg-secondary border border-secondary/50 rounded-lg text-light focus:outline-none focus:border-accent focus:bg-secondary/80"
                                style={{ backgroundColor: '#374151', color: '#F9FAFB' }}
                            >
                                {appData.config.clientStatuses.map(status => (
                                    <option key={status} value={status} style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>{status}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Rubro</label>
                            <select
                                value={formData.industry}
                                onChange={(e) => handleChange('industry', e.target.value)}
                                className="w-full px-3 py-2 bg-secondary border border-secondary/50 rounded-lg text-light focus:outline-none focus:border-accent focus:bg-secondary/80"
                                style={{ backgroundColor: '#374151', color: '#F9FAFB' }}
                            >
                                <option value="" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>Seleccionar rubro</option>
                                {appData.config.industries.map(industry => (
                                    <option key={industry} value={industry} style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>{industry}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Tipo de Conexión</label>
                            <select
                                value={formData.connectionType}
                                onChange={(e) => handleChange('connectionType', e.target.value)}
                                className="w-full px-3 py-2 bg-secondary border border-secondary/50 rounded-lg text-light focus:outline-none focus:border-accent focus:bg-secondary/80"
                                style={{ backgroundColor: '#374151', color: '#F9FAFB' }}
                            >
                                {appData.config.connectionTypes.map(type => (
                                    <option key={type} value={type} style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Tipo de Contrato</label>
                            <select
                                value={formData.contractType}
                                onChange={(e) => handleChange('contractType', e.target.value)}
                                className="w-full px-3 py-2 bg-secondary border border-secondary/50 rounded-lg text-light focus:outline-none focus:border-accent focus:bg-secondary/80"
                                style={{ backgroundColor: '#374151', color: '#F9FAFB' }}
                            >
                                {appData.config.contractTypes.map(type => (
                                    <option key={type} value={type} style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>{type}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Fecha de Registro</label>
                            <input
                                type="date"
                                value={formData.registrationDate}
                                onChange={(e) => handleChange('registrationDate', e.target.value)}
                                className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Licencias</label>
                            <input
                                type="number"
                                value={formData.licenses}
                                onChange={(e) => handleChange('licenses', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                                min="1"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Email Principal *</label>
                            <input
                                type="email"
                                value={formData.clientEmail}
                                onChange={(e) => handleChange('clientEmail', e.target.value)}
                                className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-light/70 mb-2">Email Secundario</label>
                            <input
                                type="email"
                                value={formData.clientEmail2}
                                onChange={(e) => handleChange('clientEmail2', e.target.value)}
                                className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-light/70 mb-2">Observaciones</label>
                        <textarea
                            value={formData.observations}
                            onChange={(e) => handleChange('observations', e.target.value)}
                            rows={3}
                            className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                        />
                    </div>

                    <div className="flex justify-end space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-light/70 hover:text-light transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors font-medium"
                        >
                            {client ? 'Actualizar' : 'Crear'} Cliente
                        </button>
                    </div>
                </form>
            ) : (
                /* Training History Tab */
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h4 className="text-lg font-semibold text-light">Historial de Capacitaciones</h4>
                        <div className="text-sm text-light/70">
                            {clientSummary.lastTraining && (
                                <span>Última: {new Date(clientSummary.lastTraining.dateTime).toLocaleDateString()}</span>
                            )}
                        </div>
                    </div>

                    {clientTrainings.length === 0 ? (
                        <div className="text-center py-8 text-light/50">
                            <i className="fas fa-chalkboard-teacher text-4xl mb-4"></i>
                            <p>No hay capacitaciones registradas para este cliente</p>
                        </div>
                    ) : (
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {clientTrainings.map(training => (
                                <div key={training.id} className="bg-primary/30 p-4 rounded-lg border border-secondary/30">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex-1">
                                            <h5 className="font-medium text-light">{training.topic}</h5>
                                            <div className="flex items-center space-x-4 mt-1 text-sm text-light/70">
                                                <span className={`px-2 py-1 rounded-full text-xs ${training.type === 'PM' ? 'bg-purple-400/20 text-purple-400' : 'bg-cyan-400/20 text-cyan-400'
                                                    }`}>
                                                    {training.type}
                                                </span>
                                                <span>Responsable: {training.responsible}</span>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${training.status === 'COMPLETADA' ? 'bg-green-400/20 text-green-400' :
                                                training.status === 'AGENDADA' ? 'bg-blue-400/20 text-blue-400' :
                                                    training.status === 'EN PROCESO' ? 'bg-yellow-400/20 text-yellow-400' :
                                                        training.status === 'REAGENDADA' ? 'bg-orange-400/20 text-orange-400' :
                                                            'bg-red-400/20 text-red-400'
                                                }`}>
                                                {training.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-sm text-light/70">
                                        <div className="flex justify-between items-center">
                                            <span>
                                                {new Date(training.dateTime).toLocaleDateString()} - {new Date(training.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                        {training.observations && (
                                            <div className="mt-2 p-2 bg-secondary/20 rounded text-xs">
                                                <strong>Observaciones:</strong> {training.observations}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-4 border-t border-secondary/30">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="px-4 py-2 text-light/70 hover:text-light transition-colors"
                        >
                            Cerrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// Clients Component with full functionality
const Clients = () => {
    const { appData, addClient, updateClient, deleteClient } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingClient, setEditingClient] = useState(null);

    const filteredClients = useMemo(() => {
        return appData.clients.filter(client => {
            const matchesSearch = client.legalName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                client.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = !statusFilter || client.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [appData.clients, searchTerm, statusFilter]);

    const handleSaveClient = (clientData) => {
        if (editingClient) {
            updateClient(editingClient.id, clientData);
        } else {
            addClient(clientData);
        }
        setShowModal(false);
        setEditingClient(null);
    };

    const handleEditClient = (client) => {
        setEditingClient(client);
        setShowModal(true);
    };

    const handleDeleteClient = (clientId) => {
        if (confirm('¿Está seguro de que desea eliminar este cliente?')) {
            deleteClient(clientId);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Activo': return 'text-green-400 bg-green-400/20';
            case 'Implementación': return 'text-yellow-400 bg-yellow-400/20';
            case 'En Pausa': return 'text-orange-400 bg-orange-400/20';
            case 'Cancelado': return 'text-red-400 bg-red-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-light">Gestión de Clientes</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Nuevo Cliente
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Buscar clientes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-secondary/80 border border-secondary/50 rounded-lg text-light placeholder-light/70 focus:outline-none focus:border-accent focus:bg-secondary"
                    />
                </div>
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-secondary/80 border border-secondary/50 rounded-lg text-light focus:outline-none focus:border-accent focus:bg-secondary"
                        style={{ backgroundColor: '#374151', color: '#F9FAFB' }}
                    >
                        <option value="" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>Todos los estados</option>
                        {appData.config.clientStatuses.map(status => (
                            <option key={status} value={status} style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Clients Table */}
            <div className="bg-secondary/20 rounded-lg border border-secondary/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/30">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Rubro</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Licencias</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Registro</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-light/70 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/30">
                            {filteredClients.map((client) => (
                                <tr key={client.id} className="hover:bg-secondary/10">
                                    <td className="px-6 py-4">
                                        <div>
                                            <div className="text-sm font-medium text-light">{client.legalName}</div>
                                            <div className="text-sm text-light/70">{client.fantasyName}</div>
                                            <div className="text-xs text-light/50">{client.clientEmail}</div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(client.status)}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-light">{client.industry || '-'}</td>
                                    <td className="px-6 py-4 text-sm text-light">{client.licenses}</td>
                                    <td className="px-6 py-4 text-sm text-light">{new Date(client.registrationDate).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEditClient(client)}
                                            className="text-accent hover:text-accent/80 mr-3"
                                        >
                                            <i className="fas fa-edit"></i>
                                        </button>
                                        <button
                                            onClick={() => handleDeleteClient(client.id)}
                                            className="text-red-400 hover:text-red-300"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingClient(null);
                }}
                title={editingClient ? 'Editar Cliente' : 'Nuevo Cliente'}
                size="lg"
            >
                <ClientForm
                    client={editingClient}
                    onSave={handleSaveClient}
                    onCancel={() => {
                        setShowModal(false);
                        setEditingClient(null);
                    }}
                />
            </Modal>
        </div>
    );
};

// Training Form Component
const TrainingForm = ({ training, onSave, onCancel }) => {
    const { appData } = useContext(AppContext);
    const [formData, setFormData] = useState(training || {
        clientId: '',
        type: 'General',
        topic: '',
        responsible: '',
        dateTime: '',
        status: 'AGENDADA',
        observations: ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const availableTopics = formData.type === 'PM' ? appData.config.pmTopics : appData.config.generalTopics;

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">Cliente *</label>
                    <select
                        value={formData.clientId}
                        onChange={(e) => handleChange('clientId', parseInt(e.target.value))}
                        className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                        required
                    >
                        <option value="">Seleccionar cliente</option>
                        {appData.clients.map(client => (
                            <option key={client.id} value={client.id}>{client.legalName}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">Tipo *</label>
                    <select
                        value={formData.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                        className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                        required
                    >
                        <option value="General">General</option>
                        <option value="PM">PM</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">Tema *</label>
                    <select
                        value={formData.topic}
                        onChange={(e) => handleChange('topic', e.target.value)}
                        className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                        required
                    >
                        <option value="">Seleccionar tema</option>
                        {availableTopics.map(topic => (
                            <option key={topic} value={topic}>{topic}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">Responsable *</label>
                    <select
                        value={formData.responsible}
                        onChange={(e) => handleChange('responsible', e.target.value)}
                        className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                        required
                    >
                        <option value="">Seleccionar responsable</option>
                        {appData.config.responsibles.map(responsible => (
                            <option key={responsible} value={responsible}>{responsible}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">Fecha y Hora *</label>
                    <input
                        type="datetime-local"
                        value={formData.dateTime}
                        onChange={(e) => handleChange('dateTime', e.target.value)}
                        className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-light/70 mb-2">Estado</label>
                    <select
                        value={formData.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                        className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                    >
                        {appData.config.trainingStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-light/70 mb-2">Observaciones</label>
                <textarea
                    value={formData.observations}
                    onChange={(e) => handleChange('observations', e.target.value)}
                    rows={3}
                    className="w-full px-3 py-2 bg-primary border border-secondary/30 rounded-lg text-light focus:outline-none focus:border-accent"
                />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-light/70 hover:text-light transition-colors"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                    {training ? 'Actualizar' : 'Crear'} Capacitación
                </button>
            </div>
        </form>
    );
};

// Trainings Component with full functionality
const Trainings = () => {
    const { appData, addTraining, updateTraining, deleteTraining } = useContext(AppContext);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [typeFilter, setTypeFilter] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [editingTraining, setEditingTraining] = useState(null);

    const filteredTrainings = useMemo(() => {
        return appData.trainings.filter(training => {
            const client = appData.clients.find(c => c.id === training.clientId);
            const matchesSearch = training.topic.toLowerCase().includes(searchTerm.toLowerCase()) ||
                training.responsible.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (client && client.legalName.toLowerCase().includes(searchTerm.toLowerCase()));
            const matchesStatus = !statusFilter || training.status === statusFilter;
            const matchesType = !typeFilter || training.type === typeFilter;
            return matchesSearch && matchesStatus && matchesType;
        });
    }, [appData.trainings, appData.clients, searchTerm, statusFilter, typeFilter]);

    const handleSaveTraining = (trainingData) => {
        if (editingTraining) {
            updateTraining(editingTraining.id, trainingData);
        } else {
            addTraining(trainingData);
        }
        setShowModal(false);
        setEditingTraining(null);
    };

    const handleEditTraining = (training) => {
        setEditingTraining(training);
        setShowModal(true);
    };

    const handleDeleteTraining = (trainingId) => {
        if (confirm('¿Está seguro de que desea eliminar esta capacitación?')) {
            deleteTraining(trainingId);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'COMPLETADA': return 'text-green-400 bg-green-400/20';
            case 'AGENDADA': return 'text-blue-400 bg-blue-400/20';
            case 'EN PROCESO': return 'text-yellow-400 bg-yellow-400/20';
            case 'REAGENDADA': return 'text-orange-400 bg-orange-400/20';
            case 'CANCELADA': return 'text-red-400 bg-red-400/20';
            default: return 'text-gray-400 bg-gray-400/20';
        }
    };

    const getTypeColor = (type) => {
        return type === 'PM' ? 'text-purple-400 bg-purple-400/20' : 'text-cyan-400 bg-cyan-400/20';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-light">Gestión de Capacitaciones</h1>
                <button
                    onClick={() => setShowModal(true)}
                    className="px-4 py-2 bg-accent text-primary rounded-lg hover:bg-accent/90 transition-colors font-medium"
                >
                    <i className="fas fa-plus mr-2"></i>
                    Nueva Capacitación
                </button>
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <input
                        type="text"
                        placeholder="Buscar capacitaciones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full px-4 py-2 bg-secondary/80 border border-secondary/50 rounded-lg text-light placeholder-light/70 focus:outline-none focus:border-accent focus:bg-secondary"
                    />
                </div>
                <div>
                    <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="px-4 py-2 bg-secondary/80 border border-secondary/50 rounded-lg text-light focus:outline-none focus:border-accent focus:bg-secondary"
                        style={{ backgroundColor: '#374151', color: '#F9FAFB' }}
                    >
                        <option value="" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>Todos los tipos</option>
                        <option value="General" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>General</option>
                        <option value="PM" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>PM</option>
                    </select>
                </div>
                <div>
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="px-4 py-2 bg-secondary/80 border border-secondary/50 rounded-lg text-light focus:outline-none focus:border-accent focus:bg-secondary"
                        style={{ backgroundColor: '#374151', color: '#F9FAFB' }}
                    >
                        <option value="" style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>Todos los estados</option>
                        {appData.config.trainingStatuses.map(status => (
                            <option key={status} value={status} style={{ backgroundColor: '#374151', color: '#F9FAFB' }}>{status}</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Trainings Table */}
            <div className="bg-secondary/20 rounded-lg border border-secondary/30 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-secondary/30">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Cliente</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Tipo</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Tema</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Responsable</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Fecha</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-light/70 uppercase tracking-wider">Estado</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-light/70 uppercase tracking-wider">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-secondary/30">
                            {filteredTrainings.map((training) => {
                                const client = appData.clients.find(c => c.id === training.clientId);
                                return (
                                    <tr key={training.id} className="hover:bg-secondary/10">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-light">
                                                {client ? client.legalName : 'Cliente no encontrado'}
                                            </div>
                                            <div className="text-sm text-light/70">
                                                {client ? client.fantasyName : ''}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getTypeColor(training.type)}`}>
                                                {training.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-light">{training.topic}</td>
                                        <td className="px-6 py-4 text-sm text-light">{training.responsible}</td>
                                        <td className="px-6 py-4 text-sm text-light">
                                            {new Date(training.dateTime).toLocaleDateString()} {new Date(training.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(training.status)}`}>
                                                {training.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditTraining(training)}
                                                className="text-accent hover:text-accent/80 mr-3"
                                            >
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <button
                                                onClick={() => handleDeleteTraining(training.id)}
                                                className="text-red-400 hover:text-red-300"
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            <Modal
                isOpen={showModal}
                onClose={() => {
                    setShowModal(false);
                    setEditingTraining(null);
                }}
                title={editingTraining ? 'Editar Capacitación' : 'Nueva Capacitación'}
                size="lg"
            >
                <TrainingForm
                    training={editingTraining}
                    onSave={handleSaveTraining}
                    onCancel={() => {
                        setShowModal(false);
                        setEditingTraining(null);
                    }}
                />
            </Modal>
        </div>
    );
};

// Calendar Component with events
const Calendar = () => {
    const { appData } = useContext(AppContext);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    const trainingsThisMonth = useMemo(() => {
        return appData.trainings.filter(training => {
            const trainingDate = new Date(training.dateTime);
            return trainingDate.getMonth() === currentDate.getMonth() &&
                trainingDate.getFullYear() === currentDate.getFullYear();
        });
    }, [appData.trainings, currentDate]);

    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();

        const days = [];

        // Add empty cells for days before the first day of the month
        for (let i = 0; i < startingDayOfWeek; i++) {
            days.push(null);
        }

        // Add days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    };

    const getTrainingsForDay = (day) => {
        if (!day) return [];
        const dayDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return trainingsThisMonth.filter(training => {
            const trainingDate = new Date(training.dateTime);
            return trainingDate.toDateString() === dayDate.toDateString();
        });
    };

    const navigateMonth = (direction) => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(prev.getMonth() + direction);
            return newDate;
        });
    };

    const days = getDaysInMonth(currentDate);
    const monthNames = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    const dayNames = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-light">Calendario de Capacitaciones</h1>
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigateMonth(-1)}
                        className="p-2 hover:bg-secondary/20 rounded-lg transition-colors text-light"
                    >
                        <i className="fas fa-chevron-left"></i>
                    </button>
                    <h2 className="text-xl font-semibold text-light min-w-[200px] text-center">
                        {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                    </h2>
                    <button
                        onClick={() => navigateMonth(1)}
                        className="p-2 hover:bg-secondary/20 rounded-lg transition-colors text-light"
                    >
                        <i className="fas fa-chevron-right"></i>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Calendar Grid */}
                <div className="lg:col-span-2">
                    <div className="bg-secondary/20 rounded-lg border border-secondary/30 p-6">
                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-1 mb-4">
                            {dayNames.map(day => (
                                <div key={day} className="p-2 text-center text-sm font-medium text-light/70">
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-1">
                            {days.map((day, index) => {
                                const trainings = getTrainingsForDay(day);
                                const isToday = day &&
                                    new Date().toDateString() ===
                                    new Date(currentDate.getFullYear(), currentDate.getMonth(), day).toDateString();

                                return (
                                    <div
                                        key={index}
                                        className={`min-h-[80px] p-2 border border-secondary/20 rounded-lg cursor-pointer hover:bg-secondary/10 transition-colors ${isToday ? 'bg-accent/20 border-accent/50' : ''
                                            } ${!day ? 'cursor-default hover:bg-transparent' : ''}`}
                                        onClick={() => day && setSelectedDate(day)}
                                    >
                                        {day && (
                                            <>
                                                <div className={`text-sm font-medium mb-1 ${isToday ? 'text-accent' : 'text-light'}`}>
                                                    {day}
                                                </div>
                                                <div className="space-y-1">
                                                    {trainings.slice(0, 2).map(training => (
                                                        <div
                                                            key={training.id}
                                                            className="text-xs p-1 bg-accent/20 text-accent rounded truncate"
                                                            title={training.topic}
                                                        >
                                                            {training.topic}
                                                        </div>
                                                    ))}
                                                    {trainings.length > 2 && (
                                                        <div className="text-xs text-light/50">
                                                            +{trainings.length - 2} más
                                                        </div>
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Events sidebar */}
                <div className="space-y-4">
                    <div className="bg-secondary/20 rounded-lg border border-secondary/30 p-6">
                        <h3 className="text-lg font-semibold text-light mb-4">
                            Capacitaciones del Mes
                        </h3>
                        <div className="space-y-3 max-h-[400px] overflow-y-auto">
                            {trainingsThisMonth.length === 0 ? (
                                <p className="text-light/50 text-sm">No hay capacitaciones programadas</p>
                            ) : (
                                trainingsThisMonth.map(training => {
                                    const client = appData.clients.find(c => c.id === training.clientId);
                                    return (
                                        <div key={training.id} className="p-3 bg-primary/30 rounded-lg">
                                            <div className="flex justify-between items-start mb-2">
                                                <h4 className="text-sm font-medium text-light">{training.topic}</h4>
                                                <span className={`text-xs px-2 py-1 rounded-full ${training.status === 'COMPLETADA' ? 'bg-green-400/20 text-green-400' :
                                                    training.status === 'AGENDADA' ? 'bg-blue-400/20 text-blue-400' :
                                                        'bg-yellow-400/20 text-yellow-400'
                                                    }`}>
                                                    {training.status}
                                                </span>
                                            </div>
                                            <p className="text-xs text-light/70 mb-1">
                                                Cliente: {client ? client.legalName : 'N/A'}
                                            </p>
                                            <p className="text-xs text-light/70 mb-1">
                                                Responsable: {training.responsible}
                                            </p>
                                            <p className="text-xs text-light/50">
                                                {new Date(training.dateTime).toLocaleDateString()} - {new Date(training.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Placeholder components for other modules
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
                            className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${activeView === item.id
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

// App Context with comprehensive data management
const AppContext = createContext();
const AppProvider = ({ children, initialData }) => {
    const [appData, setAppData] = useState({
        clients: initialClients,
        trainings: initialTrainings,
        config: configOptions,
        projects: [],
        tasks: [],
        notifications: [],
        settings: {
            theme: 'dark',
            language: 'es',
            notifications: true,
            autoSave: true
        },
        ...initialData
    });

    // Client management
    const updateClient = useCallback((clientId, updatedClient) => {
        setAppData(prev => ({
            ...prev,
            clients: prev.clients.map(client =>
                client.id === clientId ? { ...client, ...updatedClient } : client
            )
        }));
    }, []);

    const addClient = useCallback((newClient) => {
        const id = Math.max(...appData.clients.map(c => c.id), 0) + 1;
        const clientWithId = { ...newClient, id, createdAt: new Date().toISOString() };
        setAppData(prev => ({
            ...prev,
            clients: [...prev.clients, clientWithId]
        }));
        return clientWithId;
    }, [appData.clients]);

    const deleteClient = useCallback((clientId) => {
        setAppData(prev => ({
            ...prev,
            clients: prev.clients.filter(client => client.id !== clientId),
            trainings: prev.trainings.filter(training => training.clientId !== clientId)
        }));
    }, []);

    // Training management
    const updateTraining = useCallback((trainingId, updatedTraining) => {
        setAppData(prev => ({
            ...prev,
            trainings: prev.trainings.map(training =>
                training.id === trainingId ? { ...training, ...updatedTraining } : training
            )
        }));
    }, []);

    const addTraining = useCallback((newTraining) => {
        const id = Math.max(...appData.trainings.map(t => t.id), 0) + 1;
        const trainingWithId = { ...newTraining, id, createdAt: new Date().toISOString() };
        setAppData(prev => ({
            ...prev,
            trainings: [...prev.trainings, trainingWithId]
        }));
        return trainingWithId;
    }, [appData.trainings]);

    const deleteTraining = useCallback((trainingId) => {
        setAppData(prev => ({
            ...prev,
            trainings: prev.trainings.filter(training => training.id !== trainingId)
        }));
    }, []);

    // Project management
    const addProject = useCallback((newProject) => {
        const id = Math.max(...appData.projects.map(p => p.id), 0) + 1;
        const projectWithId = { ...newProject, id, createdAt: new Date().toISOString() };
        setAppData(prev => ({
            ...prev,
            projects: [...prev.projects, projectWithId]
        }));
        return projectWithId;
    }, [appData.projects]);

    const updateProject = useCallback((projectId, updatedProject) => {
        setAppData(prev => ({
            ...prev,
            projects: prev.projects.map(project =>
                project.id === projectId ? { ...project, ...updatedProject } : project
            )
        }));
    }, []);

    const deleteProject = useCallback((projectId) => {
        setAppData(prev => ({
            ...prev,
            projects: prev.projects.filter(project => project.id !== projectId),
            tasks: prev.tasks.filter(task => task.projectId !== projectId)
        }));
    }, []);

    // Task management
    const addTask = useCallback((newTask) => {
        const id = Math.max(...appData.tasks.map(t => t.id), 0) + 1;
        const taskWithId = { ...newTask, id, createdAt: new Date().toISOString() };
        setAppData(prev => ({
            ...prev,
            tasks: [...prev.tasks, taskWithId]
        }));
        return taskWithId;
    }, [appData.tasks]);

    const updateTask = useCallback((taskId, updatedTask) => {
        setAppData(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId ? { ...task, ...updatedTask } : task
            )
        }));
    }, []);

    const deleteTask = useCallback((taskId) => {
        setAppData(prev => ({
            ...prev,
            tasks: prev.tasks.filter(task => task.id !== taskId)
        }));
    }, []);

    // Notification management
    const addNotification = useCallback((notification) => {
        const id = Math.max(...appData.notifications.map(n => n.id), 0) + 1;
        const notificationWithId = {
            ...notification,
            id,
            createdAt: new Date().toISOString(),
            read: false
        };
        setAppData(prev => ({
            ...prev,
            notifications: [notificationWithId, ...prev.notifications]
        }));
    }, [appData.notifications]);

    const markNotificationAsRead = useCallback((notificationId) => {
        setAppData(prev => ({
            ...prev,
            notifications: prev.notifications.map(notification =>
                notification.id === notificationId ? { ...notification, read: true } : notification
            )
        }));
    }, []);

    // Settings management
    const updateSettings = useCallback((newSettings) => {
        setAppData(prev => ({
            ...prev,
            settings: { ...prev.settings, ...newSettings }
        }));
    }, []);

    // Data export/import
    const exportData = useCallback(() => {
        const dataToExport = {
            clients: appData.clients,
            trainings: appData.trainings,
            projects: appData.projects,
            tasks: appData.tasks,
            exportDate: new Date().toISOString()
        };
        return JSON.stringify(dataToExport, null, 2);
    }, [appData]);

    const importData = useCallback((jsonData) => {
        try {
            const importedData = JSON.parse(jsonData);
            setAppData(prev => ({
                ...prev,
                ...importedData,
                config: prev.config, // Keep existing config
                settings: prev.settings // Keep existing settings
            }));
            return true;
        } catch (error) {
            console.error('Error importing data:', error);
            return false;
        }
    }, []);

    // Statistics and analytics
    const getStatistics = useCallback(() => {
        const now = new Date();
        const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);

        return {
            clients: {
                total: appData.clients.length,
                active: appData.clients.filter(c => c.status === 'Activo').length,
                implementation: appData.clients.filter(c => c.status === 'Implementación').length,
                paused: appData.clients.filter(c => c.status === 'En Pausa').length,
                thisMonth: appData.clients.filter(c => new Date(c.registrationDate) >= thisMonth).length,
                lastMonth: appData.clients.filter(c => {
                    const regDate = new Date(c.registrationDate);
                    return regDate >= lastMonth && regDate < thisMonth;
                }).length
            },
            trainings: {
                total: appData.trainings.length,
                completed: appData.trainings.filter(t => t.status === 'COMPLETADA').length,
                scheduled: appData.trainings.filter(t => t.status === 'AGENDADA').length,
                thisMonth: appData.trainings.filter(t => {
                    const trainingDate = new Date(t.dateTime);
                    return trainingDate >= thisMonth;
                }).length,
                byType: {
                    PM: appData.trainings.filter(t => t.type === 'PM').length,
                    General: appData.trainings.filter(t => t.type === 'General').length
                }
            },
            projects: {
                total: appData.projects.length,
                active: appData.projects.filter(p => p.status === 'in-progress').length,
                completed: appData.projects.filter(p => p.status === 'completed').length,
                planning: appData.projects.filter(p => p.status === 'planning').length
            }
        };
    }, [appData]);

    const value = {
        appData,
        setAppData,
        // Client methods
        updateClient,
        addClient,
        deleteClient,
        // Training methods
        updateTraining,
        addTraining,
        deleteTraining,
        // Project methods
        addProject,
        updateProject,
        deleteProject,
        // Task methods
        addTask,
        updateTask,
        deleteTask,
        // Notification methods
        addNotification,
        markNotificationAsRead,
        // Settings methods
        updateSettings,
        // Data methods
        exportData,
        importData,
        // Analytics
        getStatistics
    };

    return React.createElement(AppContext.Provider, { value }, children);
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