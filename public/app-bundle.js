// PM Gestor Pro - Bundle
// Generated automatically - Do not edit manually

// React hooks destructuring
const { useState, useCallback, useContext, createContext, useEffect, useMemo } = React;
const { createRoot } = ReactDOM;


// === public/constants.js ===
// Definir navItems como variable global
const navItems = [
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

// === public/contexts/AppContext.js ===
const AppContext = createContext(undefined);

const AppProvider = ({ children, initialData }) => {
    const [data, setData] = useState(initialData);

    const recalculateDashboardStats = (clients, trainings) => {
        const activeClients = clients.filter(c => c.status === 'Activo').length;
        const pendingInstallations = clients.filter(c => c.status === 'Implementación').length;
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const trainingsThisMonth = trainings.filter(t => {
            const trainingDate = new Date(t.dateTime);
            return trainingDate >= firstDayOfMonth && trainingDate <= lastDayOfMonth;
        }).length;

        return {
            totalClients: clients.length,
            activeClients,
            pendingInstallations,
            trainingsThisMonth,
            clientsByStatus: [
                { name: 'Activo', value: activeClients },
                { name: 'Implementación', value: pendingInstallations },
                { name: 'En Pausa', value: clients.filter(c => c.status === 'En Pausa').length },
                { name: 'Inactivo', value: clients.filter(c => c.status === 'Inactivo').length },
            ],
            clientsByIndustry: [...new Set(clients.map(c => c.industry))].map(ind => ({ name: ind, value: clients.filter(c => c.industry === ind).length})),
        };
    };

    const saveClient = useCallback((clientToSave) => {
        setData(prevData => {
            const clientIndex = prevData.clients.findIndex(c => c.id === clientToSave.id);
            let newClients;
            if (clientIndex > -1) {
                newClients = [...prevData.clients];
                newClients[clientIndex] = clientToSave;
            } else {
                newClients = [...prevData.clients, clientToSave];
            }
            const newDashboardStats = recalculateDashboardStats(newClients, prevData.trainings);
            return { ...prevData, clients: newClients, dashboardStats: newDashboardStats };
        });
    }, []);

    const saveTraining = useCallback((trainingToSave) => {
        setData(prevData => {
            const trainingIndex = prevData.trainings.findIndex(t => t.id === trainingToSave.id);
            let newTrainings;
            if (trainingIndex > -1) {
                newTrainings = [...prevData.trainings];
                newTrainings[trainingIndex] = trainingToSave;
            } else {
                newTrainings = [...prevData.trainings, trainingToSave];
            }
            const newDashboardStats = recalculateDashboardStats(prevData.clients, newTrainings);
            return { ...prevData, trainings: newTrainings, dashboardStats: newDashboardStats };
        });
    }, []);

    const updateSettings = useCallback((newSettings) => {
        setData(prevData => ({
            ...prevData,
            settings: newSettings,
        }));
    }, []);
    
    const updateChecklistState = useCallback((clientId, categoryId, itemId, isChecked) => {
        setData(prevData => {
            const newClients = prevData.clients.map(client => {
                if (client.id === clientId) {
                    const newChecklistState = { ...client.checklistState };
                    const categoryItems = newChecklistState[categoryId] ? [...newChecklistState[categoryId]] : [];
                    
                    if (isChecked) {
                        if (!categoryItems.includes(itemId)) categoryItems.push(itemId);
                    } else {
                        const index = categoryItems.indexOf(itemId);
                        if (index > -1) categoryItems.splice(index, 1);
                    }
                    newChecklistState[categoryId] = categoryItems;
                    return { ...client, checklistState: newChecklistState };
                }
                return client;
            });
            return { ...prevData, clients: newClients };
        });
    }, []);
    
    const saveEcommerceDetails = useCallback((clientId, details) => {
        setData(prevData => ({
            ...prevData,
            clients: prevData.clients.map(c => c.id === clientId ? { ...c, ecommerceDetails: details } : c)
        }));
    }, []);

    const saveAppPedidoDetails = useCallback((clientId, details) => {
        setData(prevData => ({
            ...prevData,
            clients: prevData.clients.map(c => c.id === clientId ? { ...c, appPedidoDetails: details } : c)
        }));
    }, []);

    const saveKosDetails = useCallback((clientId, details) => {
        setData(prevData => ({
            ...prevData,
            clients: prevData.clients.map(c => c.id === clientId ? { ...c, kosDetails: details } : c)
        }));
    }, []);


    const value = useMemo(() => ({
        data,
        saveClient,
        saveTraining,
        updateSettings,
        updateChecklistState,
        saveEcommerceDetails,
        saveAppPedidoDetails,
        saveKosDetails
    }), [data, saveClient, saveTraining, updateSettings, updateChecklistState, saveEcommerceDetails, saveAppPedidoDetails, saveKosDetails]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

const useAppContext = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};

// === public/hooks/useAppData.js ===
const mockClients = [
    { id: 'C001', legalName: 'Tech Solutions S.A.', fantasyName: 'TechSolve', status: 'Activo', industry: 'Tecnología', registrationDate: '2023-01-15', expectedGoLiveDate: '2023-03-01', actualGoLiveDate: '2023-02-25', licenses: 50, connectionType: 'API', contractType: 'Anual', databaseName: 'db_techsolve', emissionModel: 'El comprobante electrónico siempre como boleta electrónica', observations: 'Cliente estratégico, requiere seguimiento especial.', clientEmail: 'contacto@techsolve.com', email2: 'soporte@techsolve.com', email3: '', asanaLink: '#', crmLink: '#', freezeDate: null, freezeReason: null, freezeDetails: null, checklistState: { tecnico: ['tec_01', 'tec_02', 'tec_03', 'tec_04', 'tec_05', 'tec_06', 'tec_07', 'tec_08', 'tec_09', 'tec_10', 'tec_11', 'tec_12', 'tec_13', 'tec_14', 'tec_15', 'tec_16', 'tec_17', 'tec_18', 'tec_19', 'tec_20'], pm: ['pm_01', 'pm_02', 'pm_03', 'pm_04', 'pm_05', 'pm_06', 'pm_07', 'pm_08', 'pm_09', 'pm_10'], general: ['gen_01', 'gen_02', 'gen_03', 'gen_04', 'gen_05', 'gen_06', 'gen_07'], validacion: ['val_01', 'val_02', 'val_03', 'val_04', 'val_05'], seguimiento: ['seg_01'] }, appPedidoDetails: { licenses: 20, imeis: ['IMEI12345678901', 'IMEI12345678902', 'IMEI12345678903'] } },
    { id: 'C002', legalName: 'Gourmet Foods Ltda.', fantasyName: 'Gourmet Market', status: 'Implementación', industry: 'Alimentos', registrationDate: '2023-05-20', expectedGoLiveDate: '2023-08-01', actualGoLiveDate: null, licenses: 25, connectionType: 'FTP', contractType: 'Mensual', databaseName: 'db_gourmet', emissionModel: 'Las boletas electrónicas son válidas para todo evento', observations: '', clientEmail: 'admin@gourmet.cl', email2: '', email3: '', asanaLink: '#', crmLink: '#', freezeDate: null, freezeReason: null, freezeDetails: null, checklistState: { tecnico: ['tec_01', 'tec_02', 'tec_05', 'tec_06'], pm: ['pm_01', 'pm_02'], general: [], validacion: [], seguimiento: [] }, ecommerceDetails: { host: 'Shopify', configStatus: 'En Progreso', url: 'https://gourmetmarket.shop', hostingStatus: 'Contratado', hostingManagedBy: 'Nosotros' } },
    { id: 'C003', legalName: 'Constructora del Sur', fantasyName: 'ConSur', status: 'Activo', industry: 'Construcción', registrationDate: '2022-11-10', expectedGoLiveDate: '2023-01-15', actualGoLiveDate: '2023-01-20', licenses: 100, connectionType: 'Web Service', contractType: 'Anual', databaseName: 'db_consur', emissionModel: 'El comprobante electrónico siempre como boleta electrónica', observations: 'Utilizan módulo de reportes avanzado.', clientEmail: 'gerencia@consur.com', email2: '', email3: '', asanaLink: '#', crmLink: '#', freezeDate: null, freezeReason: null, freezeDetails: null, checklistState: { tecnico: Array.from({length: 20}, (_, i) => `tec_${String(i + 1).padStart(2, '0')}`), pm: Array.from({length: 10}, (_, i) => `pm_${String(i + 1).padStart(2, '0')}`), general: Array.from({length: 7}, (_, i) => `gen_${String(i + 1).padStart(2, '0')}`), validacion: Array.from({length: 10}, (_, i) => `val_${String(i + 1).padStart(2, '0')}`), seguimiento: Array.from({length: 6}, (_, i) => `seg_${String(i + 1).padStart(2, '0')}`) } },
    { id: 'C004', legalName: 'Moda Rápida Inc.', fantasyName: 'FastFashion', status: 'En Pausa', industry: 'Retail', registrationDate: '2023-03-01', expectedGoLiveDate: '2023-05-01', actualGoLiveDate: null, licenses: 75, connectionType: 'API', contractType: 'Semestral', databaseName: 'db_ffashion', emissionModel: 'Las boletas electrónicas son válidas para todo evento', observations: '', clientEmail: 'ti@fastfashion.com', email2: 'ceo@fastfashion.com', email3: '', asanaLink: '#', crmLink: '#', freezeDate: '2023-04-10', freezeReason: 'Reestructuración interna', freezeDetails: 'El cliente está redefiniendo sus procesos internos y pausó la implementación.', checklistState: { tecnico: ['tec_01', 'tec_02', 'tec_05', 'tec_06', 'tec_07', 'tec_08', 'tec_09'], pm: ['pm_01', 'pm_02', 'pm_03'], general: ['gen_01'], validacion: [], seguimiento: [] }, ecommerceDetails: { host: 'WooCommerce', configStatus: 'Pendiente', url: 'https://fastfashion.com', hostingStatus: 'Pendiente', hostingManagedBy: 'Cliente' } },
    { id: 'C005', legalName: 'Clínica Dental Sonrisa', fantasyName: 'Clínica Sonrisa', status: 'Activo', industry: 'Salud', registrationDate: '2023-02-01', expectedGoLiveDate: '2023-04-01', actualGoLiveDate: '2023-04-05', licenses: 15, connectionType: 'API', contractType: 'Anual', databaseName: 'db_sonrisa', emissionModel: 'El comprobante electrónico siempre como boleta electrónica', observations: '', clientEmail: 'admin@sonrisa.com', email2: '', email3: '', asanaLink: '#', crmLink: '#', freezeDate: null, freezeReason: null, freezeDetails: null, checklistState: { tecnico: Array.from({length: 20}, (_, i) => `tec_${String(i + 1).padStart(2, '0')}`), pm: Array.from({length: 10}, (_, i) => `pm_${String(i + 1).padStart(2, '0')}`), general: Array.from({length: 7}, (_, i) => `gen_${String(i + 1).padStart(2, '0')}`), validacion: [], seguimiento: [] }, kosDetails: { specialty: 'Odontología', licenses: 5 } },
];

const mockTrainings = [
    { id: 'T001', clientId: 'C002', clientFantasyName: 'Gourmet Market', type: 'PM', service: 'General', topic: 'Capacitación ventas', responsible: 'Ana Pérez', dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), duration: 180, notes: 'Capacitación inicial para el equipo de ventas y caja.', status: 'AGENDADA' },
    { id: 'T002', clientId: 'C001', clientFantasyName: 'TechSolve', type: 'General', service: 'App Pedido', topic: 'Configuración de la App', responsible: 'Juan Díaz', dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), duration: 60, notes: 'Refuerzo para nuevos empleados.', status: 'AGENDADA' },
    { id: 'T003', clientId: 'C003', clientFantasyName: 'ConSur', type: 'PM', service: 'General', topic: 'Capacitación Inventario', responsible: 'Ana Pérez', dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), duration: 120, notes: 'Equipo de bodega capacitado.', status: 'COMPLETADA' },
    { id: 'T004', clientId: 'C001', clientFantasyName: 'TechSolve', type: 'PM', service: 'General', topic: 'Introducción al sistema y parámetros de producto', responsible: 'Juan Díaz', dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), duration: 120, notes: 'Se canceló por problemas de agenda del cliente.', status: 'CANCELADA' },
    { id: 'T005', clientId: 'C005', clientFantasyName: 'Clínica Sonrisa', type: 'General', service: 'KOS', topic: 'Gestión de Fichas de Pacientes', responsible: 'María Rodriguez', dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), duration: 90, notes: 'Capacitación para el personal médico.', status: 'AGENDADA' },
    { id: 'T006', clientId: 'C004', clientFantasyName: 'FastFashion', type: 'General', service: 'Ecommerce', topic: 'Carga Masiva de Productos', responsible: 'Juan Díaz', dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), duration: 75, notes: 'Capacitación para el equipo de e-commerce.', status: 'AGENDADA' },
    { id: 'T007', clientId: 'C002', clientFantasyName: 'Gourmet Market', type: 'Técnico', service: 'General', topic: 'Uso Básico del Sistema', responsible: 'Carlos Soto', dateTime: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(), duration: 90, notes: 'Capacitación técnica inicial.', status: 'AGENDADA' },
    { id: 'T008', clientId: 'C003', clientFantasyName: 'ConSur', type: 'Seguimiento', service: 'General', topic: 'Generación de Reportes', responsible: 'María Rodriguez', dateTime: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), duration: 60, notes: 'Seguimiento post-implementación.', status: 'AGENDADA' },
];

const mockDashboardStats = {
    totalClients: mockClients.length,
    activeClients: mockClients.filter(c => c.status === 'Activo').length,
    pendingInstallations: mockClients.filter(c => c.status === 'Implementación').length,
    trainingsThisMonth: 5,
    clientsByStatus: [
        { name: 'Activo', value: mockClients.filter(c => c.status === 'Activo').length },
        { name: 'Implementación', value: mockClients.filter(c => c.status === 'Implementación').length },
        { name: 'En Pausa', value: mockClients.filter(c => c.status === 'En Pausa').length },
        { name: 'Inactivo', value: mockClients.filter(c => c.status === 'Inactivo').length },
    ],
    clientsByIndustry: [...new Set(mockClients.map(c => c.industry))].map(ind => ({ name: ind, value: mockClients.filter(c => c.industry === ind).length})),
};

const mockChecklistData = [
    {
        id: 'tecnico',
        title: 'A. Checklist Técnico de Implementación',
        items: [
            { id: 'tec_01', label: 'Datos Empresa' }, { id: 'tec_02', label: 'Certificado Digital' },
            { id: 'tec_03', label: 'Certificación Boleta' }, { id: 'tec_04', label: 'Certificación Factura' },
            { id: 'tec_05', label: 'Creación BD' }, { id: 'tec_06', label: 'Instalación Sistema' },
            { id: 'tec_07', label: 'Carga de Productos' }, { id: 'tec_08', label: 'Instalación Impresora' },
            { id: 'tec_09', label: 'Configuración Impresora' }, { id: 'tec_10', label: 'Carpeta SII' },
            { id: 'tec_11', label: 'Datos Empresa Config.' }, { id: 'tec_12', label: 'Crear/Config. Correo' },
            { id: 'tec_13', label: 'Logos' }, { id: 'tec_14', label: 'Config. Cert/Prod' },
            { id: 'tec_15', label: 'Decl. de Boleta Elec.' }, { id: 'tec_16', label: 'Decl. de Facturas Elec.' },
            { id: 'tec_17', label: 'Actualización Correos SII' }, { id: 'tec_18', label: 'Envío DTE al SII' },
            { id: 'tec_19', label: 'Manuales' }, { id: 'tec_20', label: 'Creación Grupo Wsp' }
        ]
    },
    {
        id: 'pm',
        title: 'B. Checklist de Capacitaciones PM',
        items: [
            { id: 'pm_01', label: 'Introducción al sistema y parámetros de producto (2 horas)' },
            { id: 'pm_02', label: 'Capacitación Parametrización usuarios (1 hora)' },
            { id: 'pm_03', label: 'Capacitación ventas (3 horas)' },
            { id: 'pm_04', label: 'Capacitación Inventario (2 horas)' },
            { id: 'pm_05', label: 'Capacitación Caja (2 horas)' },
            { id: 'pm_06', label: 'Capacitación Descarga folio (1 hora)' },
            { id: 'pm_07', label: 'Capacitación Envío DTE (2 horas)' },
            { id: 'pm_08', label: 'Capacitación Envío Boleta (2 horas)' },
            { id: 'pm_09', label: 'Cierre de Caja (1 hora)' },
            { id: 'pm_10', label: 'Capacitación Comparativa DTE con Sistema Denarium (2 horas)' }
        ]
    },
    {
        id: 'general',
        title: 'C. Checklist de Capacitaciones Generales',
        items: [
            { id: 'gen_01', label: 'Uso Básico del Sistema' }, { id: 'gen_02', label: 'Gestión de Ventas' },
            { id: 'gen_03', label: 'Inventario y Stock' }, { id: 'gen_04', label: 'Facturación Electrónica' },
            { id: 'gen_05', label: 'Gestión de Clientes' }, { id: 'gen_06', label: 'Gestión de Proveedores' },
            { id: 'gen_07', label: 'Generación de Reportes' }
        ]
    },
    {
        id: 'validacion',
        title: 'D. Checklist de Validación Post-Implementación',
        items: [
            { id: 'val_01', label: 'Conectividad SII' }, { id: 'val_02', label: 'Emisión de Documentos' },
            { id: 'val_03', label: 'Integración BD' }, { id: 'val_04', label: 'Backup y Seguridad' },
            { id: 'val_05', label: 'Performance Sistema' }, { id: 'val_06', label: 'Flujo Completo de Venta' },
            { id: 'val_07', label: 'Proceso de Inventario' }, { id: 'val_08', label: 'Cierre Contable' },
            { id: 'val_09', label: 'Reportería' }, { id: 'val_10', label: 'Soporte Usuario' }
        ]
    },
    {
        id: 'seguimiento',
        title: 'E. Checklist de Seguimiento Post-Capacitación',
        items: [
            { id: 'seg_01', label: 'Verificar aplicación de conocimientos (1-7 días)' },
            { id: 'seg_02', label: 'Resolver dudas de operación real (1-7 días)' },
            { id: 'seg_03', label: 'Evaluar adopción del sistema (1-4 semanas)' },
            { id: 'seg_04', label: 'Identificar necesidades de capacitación adicional (1-4 semanas)' },
            { id: 'seg_05', label: 'Evaluar ROI de la implementación (1-3 meses)' },
            { id: 'seg_06', label: 'Identificar oportunidades de mejora (1-3 meses)' }
        ]
    }
];

const mockSettings = {
    clientStatuses: [
        { id: 's1', name: 'Activo', description: 'Clientes con contrato vigente y servicio operativo.' },
        { id: 's2', name: 'Implementación', description: 'Clientes en proceso de puesta en marcha.' },
        { id: 's3', name: 'En Pausa', description: 'Clientes que han detenido temporalmente el proyecto.' },
        { id: 's4', name: 'Inactivo', description: 'Clientes que han finalizado su contrato.' },
    ],
    industries: [
        { id: 'i1', name: 'Tecnología' }, { id: 'i2', name: 'Alimentos' }, { id: 'i3', name: 'Construcción' }, { id: 'i4', name: 'Retail' }, { id: 'i5', name: 'Salud' }
    ],
    connectionTypes: [
        { id: 'ct1', name: 'API' }, { id: 'ct2', name: 'FTP' }, { id: 'ct3', name: 'Web Service' }
    ],
    contractTypes: [
        { id: 'cot1', name: 'Anual' }, { id: 'cot2', name: 'Mensual' }, { id: 'cot3', name: 'Semestral' }, { id: 'cot4', name: 'Por Proyecto' }
    ],
    emissionModels: [
        { id: 'em1', name: 'Las boletas electrónicas son válidas para todo evento' },
        { id: 'em2', name: 'El comprobante electrónico siempre como boleta electrónica' }
    ],
    freezeReasons: [
        { id: 'fr1', name: 'Reestructuración interna' }, { id: 'fr2', name: 'Problemas de presupuesto' }, { id: 'fr3', name: 'Falta de personal' }, { id: 'fr4', name: 'Cambio de prioridades' }
    ],
    trainingTypes: [
        { id: 'tt1', name: 'PM', description: 'Capacitaciones de Project Manager', color: 'bg-blue-500', defaultDuration: 120 },
        { id: 'tt2', name: 'General', description: 'Capacitaciones generales del sistema', color: 'bg-green-500', defaultDuration: 90 },
        { id: 'tt3', name: 'Técnico', description: 'Capacitaciones técnicas especializadas', color: 'bg-purple-500', defaultDuration: 180 },
        { id: 'tt4', name: 'Seguimiento', description: 'Sesiones de seguimiento post-implementación', color: 'bg-orange-500', defaultDuration: 60 }
    ],
    trainingServices: [
        { id: 'ts1', name: 'General', description: 'Servicios generales del sistema', topics: ['tge1', 'tge2', 'tge3', 'tge4', 'tge5', 'tge6', 'tge7'] },
        { id: 'ts2', name: 'Ecommerce', description: 'Servicios de comercio electrónico', topics: ['eco1', 'eco2', 'eco3'] },
        { id: 'ts3', name: 'App Pedido', description: 'Aplicación de pedidos móviles', topics: ['app1', 'app2', 'app3'] },
        { id: 'ts4', name: 'KOS', description: 'Sistema de gestión clínica', topics: ['kos1', 'kos2', 'kos3'] },
        { id: 'ts5', name: 'PM', description: 'Capacitaciones de Project Manager', topics: ['tpm1', 'tpm2', 'tpm3', 'tpm4', 'tpm5', 'tpm6', 'tpm7', 'tpm8', 'tpm9', 'tpm10'] }
    ],
    trainingTopics: [
        // PM Topics
        { id: 'tpm1', name: 'Introducción al sistema y parámetros de producto', service: 'PM', duration: 120, priority: 'Alta' },
        { id: 'tpm2', name: 'Capacitación Parametrización usuarios', service: 'PM', duration: 60, priority: 'Media' },
        { id: 'tpm3', name: 'Capacitación ventas', service: 'PM', duration: 180, priority: 'Alta' },
        { id: 'tpm4', name: 'Capacitación Inventario', service: 'PM', duration: 120, priority: 'Alta' },
        { id: 'tpm5', name: 'Capacitación Caja', service: 'PM', duration: 120, priority: 'Alta' },
        { id: 'tpm6', name: 'Capacitación Descarga folio', service: 'PM', duration: 60, priority: 'Media' },
        { id: 'tpm7', name: 'Capacitación Envío DTE', service: 'PM', duration: 120, priority: 'Alta' },
        { id: 'tpm8', name: 'Capacitación Envío Boleta', service: 'PM', duration: 120, priority: 'Alta' },
        { id: 'tpm9', name: 'Cierre de Caja', service: 'PM', duration: 60, priority: 'Media' },
        { id: 'tpm10', name: 'Capacitación Comparativa DTE con Sistema Denarium', service: 'PM', duration: 120, priority: 'Media' },
        
        // General Topics
        { id: 'tge1', name: 'Uso Básico del Sistema', service: 'General', duration: 90, priority: 'Alta' },
        { id: 'tge2', name: 'Gestión de Ventas', service: 'General', duration: 120, priority: 'Alta' },
        { id: 'tge3', name: 'Inventario y Stock', service: 'General', duration: 90, priority: 'Media' },
        { id: 'tge4', name: 'Facturación Electrónica', service: 'General', duration: 120, priority: 'Alta' },
        { id: 'tge5', name: 'Gestión de Clientes', service: 'General', duration: 60, priority: 'Media' },
        { id: 'tge6', name: 'Gestión de Proveedores', service: 'General', duration: 60, priority: 'Baja' },
        { id: 'tge7', name: 'Generación de Reportes', service: 'General', duration: 90, priority: 'Media' },
        
        // Ecommerce Topics
        { id: 'eco1', name: 'Configuración de Pasarelas de Pago', service: 'Ecommerce', duration: 90, priority: 'Alta' },
        { id: 'eco2', name: 'Carga Masiva de Productos', service: 'Ecommerce', duration: 75, priority: 'Media' },
        { id: 'eco3', name: 'Gestión de Órdenes y Envíos', service: 'Ecommerce', duration: 60, priority: 'Media' },
        
        // App Pedido Topics
        { id: 'app1', name: 'Configuración de la App', service: 'App Pedido', duration: 60, priority: 'Alta' },
        { id: 'app2', name: 'Gestión de Menú Digital', service: 'App Pedido', duration: 90, priority: 'Media' },
        { id: 'app3', name: 'Reportes de Ventas Móviles', service: 'App Pedido', duration: 45, priority: 'Baja' },
        
        // KOS Topics
        { id: 'kos1', name: 'Gestión de Fichas de Pacientes', service: 'KOS', duration: 90, priority: 'Alta' },
        { id: 'kos2', name: 'Facturación de Prestaciones', service: 'KOS', duration: 120, priority: 'Alta' },
        { id: 'kos3', name: 'Gestión de Agendas Médicas', service: 'KOS', duration: 75, priority: 'Media' }
    ],
    trainingStatuses: [
        { id: 'ts1', name: 'AGENDADA', description: 'Capacitación programada', color: 'bg-yellow-500', textColor: 'text-yellow-100' },
        { id: 'ts2', name: 'EN PROCESO', description: 'Capacitación en curso', color: 'bg-blue-500', textColor: 'text-blue-100' },
        { id: 'ts3', name: 'REAGENDADA', description: 'Capacitación reprogramada', color: 'bg-orange-500', textColor: 'text-orange-100' },
        { id: 'ts4', name: 'CANCELADA', description: 'Capacitación cancelada', color: 'bg-red-500', textColor: 'text-red-100' },
        { id: 'ts5', name: 'COMPLETADA', description: 'Capacitación finalizada', color: 'bg-green-500', textColor: 'text-green-100' }
    ],
    trainingPriorities: [
        { id: 'tp1', name: 'Alta', description: 'Capacitación crítica', color: 'text-red-500' },
        { id: 'tp2', name: 'Media', description: 'Capacitación importante', color: 'text-yellow-500' },
        { id: 'tp3', name: 'Baja', description: 'Capacitación opcional', color: 'text-green-500' }
    ],
    systemModules: [
        { id: 'mod1', name: 'Ventas y Caja' },
        { id: 'mod2', name: 'Inventario y Stock' },
        { id: 'mod3', name: 'Facturación Electrónica' },
        { id: 'mod4', name: 'Reportes y Estadísticas' },
    ],
    users: [
        { id: 'u1', name: 'Ana Pérez' },
        { id: 'u2', name: 'Juan Díaz' },
        { id: 'u3', name: 'María Rodriguez' },
        { id: 'u4', name: 'Carlos Soto' },
    ],
    checklistData: mockChecklistData,
};

const useAppData = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate fetching data
        const timer = setTimeout(() => {
            setData({
                clients: mockClients,
                trainings: mockTrainings,
                dashboardStats: mockDashboardStats,
                settings: mockSettings,
            });
            setLoading(false);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    return { data, loading };
};

useAppData;

// === public/components/shared/Spinner.js ===
const Spinner = () => {
    return (
        <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
        </div>
    );
};

Spinner;

// === public/components/shared/Modal.js ===
const Modal = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-secondary rounded-lg shadow-xl w-full max-w-2xl mx-4 transform transition-all animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 border-b border-primary flex justify-between items-center bg-gradient-to-r from-primary to-secondary rounded-t-lg">
                    <h3 className="text-xl font-semibold text-light">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-light">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div className="p-6 text-light">
                    {children}
                </div>
                {footer && (
                    <div className="p-4 bg-primary rounded-b-lg flex justify-end space-x-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

Modal;

// === public/components/shared/Card.js ===
const Card = ({ icon, title, value, subtitle }) => {
    return (
        <div className="bg-secondary p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-3 bg-primary rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-light">{value}</p>
                {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
};

Card;

// === public/components/TrainingSummary.js ===
const TrainingSummary = ({ clientId = null, compact = false }) => {
    const { data } = useAppContext();
    
    // Filtrar capacitaciones por cliente si se especifica
    const trainings = clientId 
        ? data.trainings.filter(t => t.clientId === clientId)
        : data.trainings;

    const now = new Date();
    
    // Calcular estadísticas
    const stats = {
        total: trainings.length,
        upcoming: trainings.filter(t => 
            new Date(t.dateTime) >= now && (t.status === 'AGENDADA' || t.status === 'REAGENDADA')
        ).length,
        completed: trainings.filter(t => t.status === 'COMPLETADA').length,
        cancelled: trainings.filter(t => t.status === 'CANCELADA').length,
        inProgress: trainings.filter(t => t.status === 'EN PROCESO').length,
        totalHours: Math.round(trainings.reduce((acc, t) => acc + (t.duration || 0), 0) / 60)
    };

    // Próximas capacitaciones (las 3 más cercanas)
    const upcomingTrainings = trainings
        .filter(t => new Date(t.dateTime) >= now && (t.status === 'AGENDADA' || t.status === 'REAGENDADA'))
        .sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime))
        .slice(0, 3);

    // Capacitaciones por prioridad
    const priorityStats = {
        alta: 0,
        media: 0,
        baja: 0
    };

    trainings.forEach(training => {
        const topicConfig = data.settings?.trainingTopics?.find(t => t.name === training.topic);
        if (topicConfig?.priority) {
            priorityStats[topicConfig.priority.toLowerCase()] += 1;
        }
    });

    if (compact) {
        return (
            <div className="bg-secondary p-4 rounded-lg">
                <h4 className="text-lg font-semibold text-light mb-3">
                    {clientId ? 'Capacitaciones del Cliente' : 'Resumen de Capacitaciones'}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-accent">{stats.total}</div>
                        <div className="text-slate-400">Total</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">{stats.upcoming}</div>
                        <div className="text-slate-400">Próximas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                        <div className="text-slate-400">Completadas</div>
                    </div>
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">{stats.totalHours}h</div>
                        <div className="text-slate-400">Total Horas</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-semibold text-light mb-4">
                {clientId ? 'Capacitaciones del Cliente' : 'Resumen de Capacitaciones'}
            </h3>
            
            {/* Estadísticas principales */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="text-center p-3 bg-primary rounded-lg">
                    <div className="text-2xl font-bold text-accent">{stats.total}</div>
                    <div className="text-sm text-slate-400">Total</div>
                </div>
                <div className="text-center p-3 bg-primary rounded-lg">
                    <div className="text-2xl font-bold text-yellow-400">{stats.upcoming}</div>
                    <div className="text-sm text-slate-400">Próximas</div>
                </div>
                <div className="text-center p-3 bg-primary rounded-lg">
                    <div className="text-2xl font-bold text-green-400">{stats.completed}</div>
                    <div className="text-sm text-slate-400">Completadas</div>
                </div>
                <div className="text-center p-3 bg-primary rounded-lg">
                    <div className="text-2xl font-bold text-blue-400">{stats.inProgress}</div>
                    <div className="text-sm text-slate-400">En Proceso</div>
                </div>
                <div className="text-center p-3 bg-primary rounded-lg">
                    <div className="text-2xl font-bold text-purple-400">{stats.totalHours}h</div>
                    <div className="text-sm text-slate-400">Total Horas</div>
                </div>
            </div>

            {/* Estadísticas por prioridad */}
            <div className="mb-6">
                <h4 className="text-lg font-semibold text-light mb-3">Por Prioridad</h4>
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-2 bg-primary rounded">
                        <div className="text-lg font-bold text-red-400">{priorityStats.alta}</div>
                        <div className="text-xs text-slate-400">Alta</div>
                    </div>
                    <div className="text-center p-2 bg-primary rounded">
                        <div className="text-lg font-bold text-yellow-400">{priorityStats.media}</div>
                        <div className="text-xs text-slate-400">Media</div>
                    </div>
                    <div className="text-center p-2 bg-primary rounded">
                        <div className="text-lg font-bold text-green-400">{priorityStats.baja}</div>
                        <div className="text-xs text-slate-400">Baja</div>
                    </div>
                </div>
            </div>

            {/* Próximas capacitaciones */}
            {upcomingTrainings.length > 0 && (
                <div>
                    <h4 className="text-lg font-semibold text-light mb-3">Próximas Capacitaciones</h4>
                    <div className="space-y-2">
                        {upcomingTrainings.map(training => {
                            const trainingDate = new Date(training.dateTime);
                            const topicConfig = data.settings?.trainingTopics?.find(t => t.name === training.topic);
                            const priorityColor = topicConfig?.priority === 'Alta' ? 'text-red-400' :
                                                 topicConfig?.priority === 'Media' ? 'text-yellow-400' : 'text-green-400';
                            
                            return (
                                <div key={training.id} className="flex justify-between items-center p-3 bg-primary rounded-lg">
                                    <div>
                                        <div className="font-semibold text-light">{training.topic}</div>
                                        <div className="text-sm text-slate-400">
                                            {!clientId && `${training.clientFantasyName} - `}
                                            {training.responsible} - {training.duration} min
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-semibold text-accent">
                                            {trainingDate.toLocaleDateString('es-ES')}
                                        </div>
                                        <div className="text-xs text-slate-400">
                                            {trainingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        </div>
                                        {topicConfig?.priority && (
                                            <div className={`text-xs font-semibold ${priorityColor}`}>
                                                {topicConfig.priority}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {stats.total === 0 && (
                <div className="text-center py-8 text-slate-400">
                    <i className="fas fa-chalkboard-teacher text-4xl mb-4"></i>
                    <p>No hay capacitaciones registradas</p>
                </div>
            )}
        </div>
    );
};

TrainingSummary;

// === public/components/Header.js ===
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

Header;

// === public/components/Sidebar.js ===
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

Sidebar;

// === public/components/Dashboard.js ===
const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];

const Dashboard = () => {
    const { data } = useAppContext();
    const { dashboardStats } = data;

    // Calcular estadísticas de capacitaciones
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const trainingsThisMonth = data.trainings.filter(t => {
        const trainingDate = new Date(t.dateTime);
        return trainingDate >= firstDayOfMonth && trainingDate <= lastDayOfMonth;
    });

    const upcomingTrainings = data.trainings.filter(t => 
        new Date(t.dateTime) >= now && (t.status === 'AGENDADA' || t.status === 'REAGENDADA')
    );

    const completedTrainings = data.trainings.filter(t => t.status === 'COMPLETADA');

    const trainingsByStatus = data.settings?.trainingStatuses?.map(status => ({
        name: status.name,
        value: data.trainings.filter(t => t.status === status.name).length,
        color: status.color
    })) || [];

    const trainingsByService = [...new Set(data.trainings.map(t => t.service))].map(service => ({
        name: service,
        value: data.trainings.filter(t => t.service === service).length
    }));

    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card icon={<i className="fas fa-users text-2xl text-accent"></i>} title="Total Clientes" value={dashboardStats.totalClients.toString()} />
                <Card icon={<i className="fas fa-user-check text-2xl text-green-500"></i>} title="Clientes Activos" value={dashboardStats.activeClients.toString()} />
                <Card icon={<i className="fas fa-cogs text-2xl text-yellow-500"></i>} title="Instalaciones Pendientes" value={dashboardStats.pendingInstallations.toString()} />
                <Card icon={<i className="fas fa-chalkboard-teacher text-2xl text-purple-500"></i>} title="Capacitaciones del Mes" value={trainingsThisMonth.length.toString()} />
            </div>

            {/* Estadísticas adicionales de capacitaciones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <Card 
                    icon={<i className="fas fa-calendar-check text-2xl text-blue-500"></i>} 
                    title="Próximas Capacitaciones" 
                    value={upcomingTrainings.length.toString()}
                    subtitle="Agendadas y reagendadas"
                />
                <Card 
                    icon={<i className="fas fa-check-circle text-2xl text-green-500"></i>} 
                    title="Completadas" 
                    value={completedTrainings.length.toString()}
                    subtitle="Total histórico"
                />
                <Card 
                    icon={<i className="fas fa-clock text-2xl text-orange-500"></i>} 
                    title="Horas Totales" 
                    value={Math.round(data.trainings.reduce((acc, t) => acc + (t.duration || 0), 0) / 60).toString()}
                    subtitle="Horas de capacitación"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-light">Estado de Clientes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dashboardStats.clientsByStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {dashboardStats.clientsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} clientes`, '']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-light">Clientes por Rubro</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardStats.clientsByIndustry} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                            <XAxis dataKey="name" stroke="#ecf0f1" />
                            <YAxis stroke="#ecf0f1" />
                            <Tooltip contentStyle={{ backgroundColor: '#2c3e50', border: 'none' }} cursor={{fill: '#34495e'}} />
                            <Legend />
                            <Bar dataKey="value" name="Nº Clientes" fill="#3498db" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Gráficos de capacitaciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-light">Capacitaciones por Estado</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={trainingsByStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {trainingsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} capacitaciones`, '']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-light">Capacitaciones por Servicio</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={trainingsByService} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                            <XAxis dataKey="name" stroke="#ecf0f1" />
                            <YAxis stroke="#ecf0f1" />
                            <Tooltip contentStyle={{ backgroundColor: '#2c3e50', border: 'none' }} cursor={{fill: '#34495e'}} />
                            <Legend />
                            <Bar dataKey="value" name="Nº Capacitaciones" fill="#9b59b6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

Dashboard;

// === public/components/Clients.js ===
const getStatusColor = (status) => {
    switch (status) {
        case 'Activo': return 'bg-green-500';
        case 'Implementación': return 'bg-yellow-500';
        case 'En Pausa': return 'bg-orange-500';
        case 'Inactivo': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
};

const Clients = () => {
    const { data, saveClient } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [industryFilter, setIndustryFilter] = useState('all');

    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const industries = useMemo(() => {
        if (!data) return [];
        return [...new Set(data.clients.map(c => c.industry))];
    }, [data]);

    const filteredClients = useMemo(() => {
        if (!data) return [];
        return data.clients.filter(client => {
            const matchesSearch = client.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  client.legalName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
            const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;
            return matchesSearch && matchesStatus && matchesIndustry;
        });
    }, [data, searchTerm, statusFilter, industryFilter]);
    
    const handleViewDetails = (client) => {
        setSelectedClient(client);
        setDetailModalOpen(true);
    };

    const handleEdit = (client) => {
        setSelectedClient(client);
        setEditModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedClient(null);
        setEditModalOpen(true);
    };

    const handleSaveClient = (client) => {
        saveClient(client);
        setEditModalOpen(false);
    };


    const calculateDaysInImplementation = (client) => {
        if (client.actualGoLiveDate) {
             const start = new Date(client.registrationDate);
             const end = new Date(client.actualGoLiveDate);
             return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }
        if(client.status === 'Implementación') {
            const start = new Date(client.registrationDate);
            const now = new Date();
            return Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }
        return 'N/A';
    };

    return (
        <>
            <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in h-full flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-4 text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-primary border border-slate-600 rounded-lg py-2 px-4 text-light focus:outline-none focus:ring-2 focus:ring-accent">
                            <option value="all">Todos los Estados</option>
                            <option value="Activo">Activo</option>
                            <option value="Implementación">Implementación</option>
                            <option value="En Pausa">En Pausa</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                         <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} className="bg-primary border border-slate-600 rounded-lg py-2 px-4 text-light focus:outline-none focus:ring-2 focus:ring-accent">
                            <option value="all">Todos los Rubros</option>
                            {industries.map(industry => <option key={industry} value={industry}>{industry}</option>)}
                        </select>
                         <button onClick={() => setAnalysisModalOpen(true)} className="bg-secondary text-accent border border-accent font-bold py-2 px-4 rounded-lg hover:bg-accent hover:text-white transition-colors shadow-md flex-shrink-0">
                            <i className="fas fa-magic mr-2"></i> Análisis General IA
                        </button>
                        <button onClick={handleAddNew} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors shadow-md flex-shrink-0">
                            <i className="fas fa-plus mr-2"></i> Nuevo Cliente
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-primary text-xs text-slate-400 uppercase tracking-wider">
                            <tr>
                                <th className="p-3">Nombre Fantasía</th>
                                <th className="p-3">Correo Cliente</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3">Días en P.M.</th>
                                <th className="p-3">Salida Producción</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                           {filteredClients.map(client => (
                                <tr key={client.id} className="hover:bg-primary transition-colors">
                                    <td className="p-3 font-medium text-light">{client.fantasyName}</td>
                                    <td className="p-3">{client.clientEmail}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(client.status)}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{calculateDaysInImplementation(client)}</td>
                                    <td className="p-3">{client.actualGoLiveDate ? new Date(client.actualGoLiveDate).toLocaleDateString() : 'Pendiente'}</td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleViewDetails(client)} className="text-accent hover:text-light transition-colors p-1" aria-label={`Ver detalles de ${client.fantasyName}`}><i className="fas fa-eye"></i></button>
                                        <button onClick={() => handleEdit(client)} className="text-accent hover:text-light transition-colors p-1 ml-2" aria-label={`Editar ${client.fantasyName}`}><i className="fas fa-edit"></i></button>
                                        <button className="text-accent hover:text-light transition-colors p-1 ml-2" aria-label="Más opciones"><i className="fas fa-ellipsis-h"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredClients.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <p>No se encontraron clientes con los filtros actuales.</p>
                        </div>
                    )}
                </div>
            </div>
            {isDetailModalOpen && selectedClient && (
                <ClientDetailModal 
                    isOpen={isDetailModalOpen} 
                    onClose={() => setDetailModalOpen(false)}
                    client={selectedClient}
                />
            )}
             {isEditModalOpen && (
                <ClientEditModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    clientToEdit={selectedClient}
                    onSave={handleSaveClient}
                />
            )}
             {isAnalysisModalOpen && (
                <GeneralAnalysisModal
                    isOpen={isAnalysisModalOpen}
                    onClose={() => setAnalysisModalOpen(false)}
                />
            )}
        </>
    );
};

Clients;

// === public/components/ClientDetailModal.js ===
const DetailItem = ({ label, value, isLink = false }) => (
    <div>
        <p className="text-xs text-slate-400">{label}</p>
        {isLink && value ? 
            <a href={value.toString()} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">{value}</a> :
            <p className="font-semibold text-light break-words">{value || 'N/A'}</p>
        }
    </div>
);

const ClientDetailModal = ({ isOpen, onClose, client }) => {
    const [summary, setSummary] = useState('');
    const [isSummaryLoading, setSummaryLoading] = useState(false);

    const handleGenerateSummary = async () => {
        setSummaryLoading(true);
        setSummary('');
        const result = await generateClientSummary(client);
        setSummary(result);
        setSummaryLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={client.fantasyName}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                
                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Resumen IA</h4>
                     <button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors shadow-md disabled:bg-slate-500 disabled:cursor-not-allowed">
                        <i className="fas fa-magic mr-2"></i> Generar Resumen
                    </button>
                    <div className="mt-4 p-4 bg-primary rounded-lg min-h-[80px]">
                        {isSummaryLoading && <Spinner />}
                        {!isSummaryLoading && summary && <p className="text-sm text-slate-300">{summary}</p>}
                        {!isSummaryLoading && !summary && <p className="text-sm text-slate-400">Haga clic en el botón para generar un resumen con IA.</p>}
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Información Básica</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        <DetailItem label="Razón Social" value={client.legalName} />
                        <DetailItem label="Estado" value={client.status} />
                        <DetailItem label="Rubro" value={client.industry} />
                    </div>
                </section>
                
                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Información de Contacto y Enlaces</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        <DetailItem label="Correo Principal" value={client.clientEmail} />
                        <DetailItem label="Correo 2" value={client.email2} />
                        <DetailItem label="Correo 3" value={client.email3} />
                        <DetailItem label="Link Asana" value={client.asanaLink} isLink={true} />
                        <DetailItem label="Link CRM" value={client.crmLink} isLink={true} />
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Información Técnica y Contrato</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        <DetailItem label="Licencias" value={client.licenses} />
                        <DetailItem label="Tipo Contrato" value={client.contractType} />
                        <DetailItem label="Tipo Conexión" value={client.connectionType} />
                        <DetailItem label="Nombre Base de Datos" value={client.databaseName} />
                        <DetailItem label="Modelo de Emisión" value={client.emissionModel} />
                    </div>
                </section>
                
                <section>
                     <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Fechas Clave</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                         <DetailItem label="Fecha Registro" value={new Date(client.registrationDate).toLocaleDateString()} />
                         <DetailItem label="Salida Producción (Esperada)" value={new Date(client.expectedGoLiveDate).toLocaleDateString()} />
                         <DetailItem label="Salida Producción (Real)" value={client.actualGoLiveDate ? new Date(client.actualGoLiveDate).toLocaleDateString() : 'Pendiente'} />
                    </div>
                </section>

                {client.freezeReason && (
                    <section>
                        <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Información de Congelación</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                            <DetailItem label="Fecha Congelación" value={client.freezeDate ? new Date(client.freezeDate).toLocaleDateString() : null} />
                            <DetailItem label="Motivo" value={client.freezeReason} />
                        </div>
                        <div className="mt-2">
                            <DetailItem label="Detalles" value={client.freezeDetails} />
                        </div>
                    </section>
                )}

                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Observaciones</h4>
                    <p className="text-sm text-slate-300 bg-primary p-3 rounded-md">{client.observations || 'Sin observaciones.'}</p>
                </section>
                
            </div>
        </Modal>
    );
};

ClientDetailModal;

// === public/components/ClientEditModal.js ===
const newClientTemplate = {
    legalName: '', fantasyName: '', status: 'Implementación', industry: '',
    connectionType: '', contractType: '', registrationDate: new Date().toISOString().split('T')[0],
    expectedGoLiveDate: '', actualGoLiveDate: null, licenses: 1, databaseName: '',
    emissionModel: '', observations: '', clientEmail: '', email2: '', email3: '',
    asanaLink: '', crmLink: '', freezeDate: null, freezeReason: null, freezeDetails: null,
    checklistState: {},
};

const FormInput = ({ label, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormSelect = ({ label, children, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent">
            {children}
        </select>
    </div>
);

const FormTextarea = ({ label, ...props }) => (
     <div className="col-span-1 md:col-span-2">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} rows={3} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);


const ClientEditModal = ({ isOpen, onClose, clientToEdit, onSave }) => {
    const [formData, setFormData] = useState(newClientTemplate);
    const { data: appData } = useAppContext(); // get settings data from context

    useEffect(() => {
        if (isOpen) {
             if (clientToEdit) {
                setFormData({
                    ...clientToEdit,
                    registrationDate: clientToEdit.registrationDate ? new Date(clientToEdit.registrationDate).toISOString().split('T')[0] : '',
                    expectedGoLiveDate: clientToEdit.expectedGoLiveDate ? new Date(clientToEdit.expectedGoLiveDate).toISOString().split('T')[0] : '',
                    actualGoLiveDate: clientToEdit.actualGoLiveDate ? new Date(clientToEdit.actualGoLiveDate).toISOString().split('T')[0] : null,
                    freezeDate: clientToEdit.freezeDate ? new Date(clientToEdit.freezeDate).toISOString().split('T')[0] : null,
                });
            } else {
                setFormData(newClientTemplate);
            }
        }
    }, [clientToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const clientData = {
            ...formData,
            id: clientToEdit?.id || `C${Date.now()}`,
        };
        onSave(clientData);
    };
    
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={clientToEdit ? `Editar ${clientToEdit.fantasyName}`: 'Crear Nuevo Cliente'}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar Cambios</button>
                </>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto p-1 pr-3">
                <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1">Información Básica</h4>
                <FormInput label="Nombre de Fantasía" name="fantasyName" value={formData.fantasyName} onChange={handleChange} required />
                <FormInput label="Razón Social" name="legalName" value={formData.legalName} onChange={handleChange} required />
                <FormSelect label="Estado" name="status" value={formData.status} onChange={handleChange}>
                   {appData.settings.clientStatuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </FormSelect>
                <FormSelect label="Rubro" name="industry" value={formData.industry} onChange={handleChange}>
                    <option value="">Seleccione un rubro</option>
                    {appData.settings.industries.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                </FormSelect>
                
                 <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Información de Contacto</h4>
                <FormInput label="Correo Principal" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleChange} />
                <FormInput label="Correo 2" name="email2" type="email" value={formData.email2} onChange={handleChange} />
                <FormInput label="Correo 3" name="email3" type="email" value={formData.email3} onChange={handleChange} />
                <FormInput label="Link Asana" name="asanaLink" type="url" value={formData.asanaLink} onChange={handleChange} />
                <FormInput label="Link CRM" name="crmLink" type="url" value={formData.crmLink} onChange={handleChange} />

                <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Detalles Técnicos y Contrato</h4>
                <FormInput label="Licencias" name="licenses" type="number" value={formData.licenses} onChange={handleChange} />
                <FormInput label="Nombre Base de Datos" name="databaseName" value={formData.databaseName} onChange={handleChange} />
                <FormSelect label="Tipo Contrato" name="contractType" value={formData.contractType} onChange={handleChange}>
                     <option value="">Seleccione tipo</option>
                    {appData.settings.contractTypes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </FormSelect>
                 <FormSelect label="Tipo Conexión" name="connectionType" value={formData.connectionType} onChange={handleChange}>
                     <option value="">Seleccione tipo</option>
                    {appData.settings.connectionTypes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </FormSelect>
                <FormSelect label="Modelo de Emisión" name="emissionModel" value={formData.emissionModel} onChange={handleChange} className="md:col-span-2">
                     <option value="">Seleccione modelo</option>
                    {appData.settings.emissionModels.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                </FormSelect>
                
                <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Fechas Clave</h4>
                <FormInput label="Fecha Registro" name="registrationDate" type="date" value={formData.registrationDate} onChange={handleChange} />
                <FormInput label="Salida a Producción (Esperada)" name="expectedGoLiveDate" type="date" value={formData.expectedGoLiveDate} onChange={handleChange} />
                <FormInput label="Salida a Producción (Real)" name="actualGoLiveDate" type="date" value={formData.actualGoLiveDate || ''} onChange={handleChange} />

                 <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Congelación (si aplica)</h4>
                <FormInput label="Fecha Congelación" name="freezeDate" type="date" value={formData.freezeDate || ''} onChange={handleChange} />
                <FormSelect label="Motivo Congelación" name="freezeReason" value={formData.freezeReason || ''} onChange={handleChange}>
                    <option value="">Seleccione motivo</option>
                    {appData.settings.freezeReasons.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </FormSelect>
                <FormTextarea label="Detalles de Congelación" name="freezeDetails" value={formData.freezeDetails || ''} onChange={handleChange} />

                <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Notas Adicionales</h4>
                <FormTextarea label="Observaciones" name="observations" value={formData.observations} onChange={handleChange} />
            </div>
        </Modal>
    );
};

ClientEditModal;

// === public/components/TrainingEditModal.js ===
const newTrainingTemplate = {
    clientId: '',
    type: 'General',
    service: 'General',
    topic: '',
    responsible: '',
    dateTime: new Date().toISOString().slice(0, 16),
    duration: 60,
    notes: '',
    status: 'AGENDADA',
    priority: 'Media'
};

const FormSelect = ({ label, children, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent">
            {children}
        </select>
    </div>
);

const FormInput = ({ label, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormTextarea = ({ label, ...props }) => (
     <div className="col-span-1 md:col-span-2">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} rows={3} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const TrainingEditModal = ({ isOpen, onClose, trainingToEdit, onSave }) => {
    const [formData, setFormData] = useState(newTrainingTemplate);
    const { data: appData } = useAppContext();

    useEffect(() => {
        if (isOpen) {
            if (trainingToEdit) {
                 setFormData({
                    ...trainingToEdit,
                    dateTime: new Date(trainingToEdit.dateTime).toISOString().slice(0, 16)
                });
            } else {
                setFormData(newTrainingTemplate);
            }
        }
    }, [trainingToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            
            // Resetear tema cuando cambia el servicio
            if (name === 'service') {
                newState.topic = '';
            }
            
            // Auto-completar duración cuando se selecciona un tema
            if (name === 'topic') {
                const selectedTopic = appData.settings?.trainingTopics?.find(t => t.name === value);
                if (selectedTopic && selectedTopic.duration) {
                    newState.duration = selectedTopic.duration;
                }
                if (selectedTopic && selectedTopic.priority) {
                    newState.priority = selectedTopic.priority;
                }
            }
            
            // Auto-completar duración por defecto cuando cambia el tipo
            if (name === 'type') {
                const selectedType = appData.settings?.trainingTypes?.find(t => t.name === value);
                if (selectedType && selectedType.defaultDuration) {
                    newState.duration = selectedType.defaultDuration;
                }
                newState.topic = '';
            }
            
            return newState;
        });
    };
    
    const handleSubmit = () => {
        const selectedClient = appData.clients.find(c => c.id === formData.clientId);
        const trainingData = {
            ...formData,
            id: trainingToEdit?.id || `T${Date.now()}`,
            clientFantasyName: selectedClient?.fantasyName || 'N/A',
            duration: Number(formData.duration),
        };
        onSave(trainingData);
    };

    const topicOptions = useMemo(() => {
        if (!appData?.settings?.trainingTopics) return [];
        
        // Filtrar temas por servicio seleccionado
        return appData.settings.trainingTopics.filter(topic => 
            topic.service === formData.service
        );
    }, [appData, formData.service]);

    const selectedTopic = useMemo(() => {
        return appData?.settings?.trainingTopics?.find(t => t.name === formData.topic);
    }, [appData, formData.topic]);

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={trainingToEdit ? 'Editar Capacitación' : 'Programar Nueva Capacitación'}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar</button>
                </>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect label="Cliente" name="clientId" value={formData.clientId} onChange={handleChange} className="md:col-span-2">
                    <option value="">Seleccione un cliente</option>
                    {appData.clients.map(c => <option key={c.id} value={c.id}>{c.fantasyName}</option>)}
                </FormSelect>
                
                <FormSelect label="Tipo de Capacitación" name="type" value={formData.type} onChange={handleChange}>
                    <option value="">Seleccione un tipo</option>
                    {appData.settings?.trainingTypes?.map(t => (
                        <option key={t.id} value={t.name}>{t.name} - {t.description}</option>
                    ))}
                </FormSelect>

                <FormSelect label="Servicio" name="service" value={formData.service} onChange={handleChange}>
                    <option value="">Seleccione un servicio</option>
                    {appData.settings?.trainingServices?.map(s => (
                        <option key={s.id} value={s.name}>{s.name} - {s.description}</option>
                    ))}
                </FormSelect>
                
                <div className="md:col-span-2">
                    <FormSelect label="Tema" name="topic" value={formData.topic} onChange={handleChange}>
                        <option value="">Seleccione un tema</option>
                        {topicOptions?.map(t => (
                            <option key={t.id} value={t.name}>
                                {t.name} ({t.duration} min - {t.priority})
                            </option>
                        ))}
                    </FormSelect>
                    {selectedTopic && (
                        <div className="mt-2 p-2 bg-primary rounded text-sm text-slate-300">
                            <div className="flex justify-between">
                                <span>Duración sugerida: <strong>{selectedTopic.duration} min</strong></span>
                                <span className={`font-semibold ${
                                    selectedTopic.priority === 'Alta' ? 'text-red-400' :
                                    selectedTopic.priority === 'Media' ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                    Prioridad: {selectedTopic.priority}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                
                <FormSelect label="Responsable" name="responsible" value={formData.responsible} onChange={handleChange}>
                     <option value="">Seleccione responsable</option>
                     {appData.settings?.users?.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                </FormSelect>

                <FormSelect label="Estado" name="status" value={formData.status} onChange={handleChange}>
                    <option value="">Seleccione un estado</option>
                    {appData.settings?.trainingStatuses?.map(s => (
                        <option key={s.id} value={s.name}>{s.name} - {s.description}</option>
                    ))}
                </FormSelect>

                <FormInput label="Fecha y Hora" name="dateTime" type="datetime-local" value={formData.dateTime} onChange={handleChange} />
                <FormInput label="Duración (minutos)" name="duration" type="number" value={formData.duration} onChange={handleChange} />

                <FormTextarea label="Observaciones" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
        </Modal>
    );
};

TrainingEditModal;

// === public/components/Trainings.js ===
const getStatusInfo = (status, settings) => {
    const statusConfig = settings?.trainingStatuses?.find(s => s.name === status);
    if (statusConfig) {
        const iconMap = {
            'AGENDADA': 'fa-calendar-check',
            'EN PROCESO': 'fa-spinner fa-spin',
            'REAGENDADA': 'fa-history',
            'CANCELADA': 'fa-times-circle',
            'COMPLETADA': 'fa-check-circle'
        };
        return { 
            color: statusConfig.color.replace('bg-', 'border-l-'), 
            icon: iconMap[status] || 'fa-question-circle',
            bgColor: statusConfig.color,
            textColor: statusConfig.textColor
        };
    }
    return { color: 'border-l-gray-500', icon: 'fa-question-circle', bgColor: 'bg-gray-500', textColor: 'text-white' };
};

const getPriorityInfo = (priority, settings) => {
    const priorityConfig = settings?.trainingPriorities?.find(p => p.name === priority);
    return priorityConfig ? priorityConfig.color : 'text-slate-400';
};

const TrainingCard = ({ training, onEdit, settings }) => {
    const { color, icon, bgColor, textColor } = getStatusInfo(training.status, settings);
    const trainingDate = new Date(training.dateTime);
    const topicConfig = settings?.trainingTopics?.find(t => t.name === training.topic);
    const priorityColor = getPriorityInfo(topicConfig?.priority, settings);

    return (
        <div 
            onClick={() => onEdit(training)}
            className={`bg-secondary p-4 rounded-lg shadow-md border-l-4 ${color} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xl hover:bg-slate-700 transition-all cursor-pointer`}
            role="button"
            aria-label={`Editar capacitación: ${training.topic}`}
        >
            <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                    <p className="text-xs text-slate-400">{training.clientFantasyName}</p>
                    {topicConfig?.priority && (
                        <span className={`text-xs font-semibold ${priorityColor}`}>
                            <i className="fas fa-exclamation-triangle mr-1"></i>
                            {topicConfig.priority}
                        </span>
                    )}
                </div>
                <h4 className="text-lg font-bold text-light">{training.topic}</h4>
                <div className="flex items-center text-sm text-slate-300 mt-2 gap-4 flex-wrap">
                    <span><i className="fas fa-user mr-2 text-accent"></i>{training.responsible}</span>
                    <span className="font-bold"><i className={`fas fa-tag mr-2 text-accent`}></i>{training.service}</span>
                    <span><i className="fas fa-clock mr-2 text-accent"></i>{training.duration} min</span>
                    {training.type && (
                        <span><i className="fas fa-layer-group mr-2 text-accent"></i>{training.type}</span>
                    )}
                </div>
                {training.notes && (
                    <p className="text-xs text-slate-400 mt-2 italic">{training.notes}</p>
                )}
            </div>
            <div className="text-right w-full sm:w-auto">
                <p className="font-semibold text-light">{trainingDate.toLocaleDateString('es-ES')}</p>
                <p className="text-sm text-slate-400">{trainingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <span className={`text-xs font-bold mt-2 inline-flex items-center gap-2 px-2 py-1 rounded ${bgColor} ${textColor}`}>
                    <i className={`fas ${icon}`}></i> {training.status}
                </span>
            </div>
        </div>
    );
};

const Trainings = () => {
    const { data, saveTraining } = useAppContext();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);
    const [filters, setFilters] = useState({
        status: 'all',
        service: 'all',
        responsible: 'all',
        priority: 'all',
        search: ''
    });
    const [viewMode, setViewMode] = useState('upcoming'); // 'upcoming', 'all', 'history'

    const handleAddNew = () => {
        setSelectedTraining(null);
        setEditModalOpen(true);
    };

    const handleEdit = (training) => {
        setSelectedTraining(training);
        setEditModalOpen(true);
    };

    const handleSaveTraining = (training) => {
        saveTraining(training);
        setEditModalOpen(false);
    };

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    // Filtrar capacitaciones
    const filteredTrainings = useMemo(() => {
        return data.trainings.filter(training => {
            // Filtro por búsqueda
            if (filters.search && !training.topic.toLowerCase().includes(filters.search.toLowerCase()) && 
                !training.clientFantasyName.toLowerCase().includes(filters.search.toLowerCase())) {
                return false;
            }
            
            // Filtros por categorías
            if (filters.status !== 'all' && training.status !== filters.status) return false;
            if (filters.service !== 'all' && training.service !== filters.service) return false;
            if (filters.responsible !== 'all' && training.responsible !== filters.responsible) return false;
            
            // Filtro por prioridad
            if (filters.priority !== 'all') {
                const topicConfig = data.settings?.trainingTopics?.find(t => t.name === training.topic);
                if (!topicConfig || topicConfig.priority !== filters.priority) return false;
            }
            
            return true;
        });
    }, [data.trainings, filters, data.settings]);
    
    const upcomingTrainings = filteredTrainings
        .filter(t => new Date(t.dateTime) >= new Date() && (t.status === 'AGENDADA' || t.status === 'REAGENDADA'))
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    const pastTrainings = filteredTrainings
        .filter(t => new Date(t.dateTime) < new Date() || (t.status !== 'AGENDADA' && t.status !== 'REAGENDADA'))
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

    const allTrainings = filteredTrainings
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

    // Obtener opciones únicas para los filtros
    const uniqueStatuses = [...new Set(data.trainings.map(t => t.status))];
    const uniqueServices = [...new Set(data.trainings.map(t => t.service))];
    const uniqueResponsibles = [...new Set(data.trainings.map(t => t.responsible))];
    const uniquePriorities = [...new Set(data.settings?.trainingTopics?.map(t => t.priority).filter(Boolean) || [])];

    const renderTrainings = () => {
        let trainingsToShow = [];
        let title = '';
        
        switch (viewMode) {
            case 'upcoming':
                trainingsToShow = upcomingTrainings;
                title = 'Próximas Capacitaciones';
                break;
            case 'history':
                trainingsToShow = pastTrainings.slice(0, 20);
                title = 'Historial de Capacitaciones';
                break;
            case 'all':
                trainingsToShow = allTrainings;
                title = 'Todas las Capacitaciones';
                break;
        }

        return (
            <div>
                <h3 className="text-xl font-semibold text-light mb-4 border-b-2 border-secondary pb-2">
                    {title} ({trainingsToShow.length})
                </h3>
                <div className="space-y-4">
                    {trainingsToShow.length > 0 ? (
                        trainingsToShow.map(t => <TrainingCard key={t.id} training={t} onEdit={handleEdit} settings={data.settings} />)
                    ) : (
                        <p className="text-slate-400 text-center py-8">
                            {viewMode === 'upcoming' ? 'No hay capacitaciones programadas.' : 'No se encontraron capacitaciones.'}
                        </p>
                    )}
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="animate-fade-in">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                    <h2 className="text-2xl font-bold text-light">Gestión de Capacitaciones</h2>
                    <button onClick={handleAddNew} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors shadow-md">
                        <i className="fas fa-plus mr-2"></i> Programar Capacitación
                    </button>
                </div>

                {/* Filtros y controles */}
                <div className="bg-primary p-4 rounded-lg mb-6 space-y-4">
                    {/* Barra de búsqueda */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                            <input
                                type="text"
                                placeholder="Buscar por tema o cliente..."
                                value={filters.search}
                                onChange={(e) => handleFilterChange('search', e.target.value)}
                                className="w-full bg-secondary text-light px-4 py-2 rounded border border-slate-600 focus:border-accent focus:outline-none"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setViewMode('upcoming')}
                                className={`px-4 py-2 rounded font-semibold transition-colors ${viewMode === 'upcoming' ? 'bg-accent text-white' : 'bg-secondary text-slate-300 hover:bg-slate-600'}`}
                            >
                                Próximas
                            </button>
                            <button
                                onClick={() => setViewMode('all')}
                                className={`px-4 py-2 rounded font-semibold transition-colors ${viewMode === 'all' ? 'bg-accent text-white' : 'bg-secondary text-slate-300 hover:bg-slate-600'}`}
                            >
                                Todas
                            </button>
                            <button
                                onClick={() => setViewMode('history')}
                                className={`px-4 py-2 rounded font-semibold transition-colors ${viewMode === 'history' ? 'bg-accent text-white' : 'bg-secondary text-slate-300 hover:bg-slate-600'}`}
                            >
                                Historial
                            </button>
                        </div>
                    </div>

                    {/* Filtros avanzados */}
                    <div className="flex flex-wrap gap-3">
                        <select 
                            value={filters.status} 
                            onChange={(e) => handleFilterChange('status', e.target.value)}
                            className="bg-secondary text-light px-3 py-2 rounded border border-slate-600 focus:border-accent text-sm"
                        >
                            <option value="all">Todos los estados</option>
                            {uniqueStatuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>

                        <select 
                            value={filters.service} 
                            onChange={(e) => handleFilterChange('service', e.target.value)}
                            className="bg-secondary text-light px-3 py-2 rounded border border-slate-600 focus:border-accent text-sm"
                        >
                            <option value="all">Todos los servicios</option>
                            {uniqueServices.map(service => (
                                <option key={service} value={service}>{service}</option>
                            ))}
                        </select>

                        <select 
                            value={filters.responsible} 
                            onChange={(e) => handleFilterChange('responsible', e.target.value)}
                            className="bg-secondary text-light px-3 py-2 rounded border border-slate-600 focus:border-accent text-sm"
                        >
                            <option value="all">Todos los responsables</option>
                            {uniqueResponsibles.map(responsible => (
                                <option key={responsible} value={responsible}>{responsible}</option>
                            ))}
                        </select>

                        <select 
                            value={filters.priority} 
                            onChange={(e) => handleFilterChange('priority', e.target.value)}
                            className="bg-secondary text-light px-3 py-2 rounded border border-slate-600 focus:border-accent text-sm"
                        >
                            <option value="all">Todas las prioridades</option>
                            {uniquePriorities.map(priority => (
                                <option key={priority} value={priority}>{priority}</option>
                            ))}
                        </select>

                        {(filters.search || filters.status !== 'all' || filters.service !== 'all' || filters.responsible !== 'all' || filters.priority !== 'all') && (
                            <button
                                onClick={() => setFilters({ status: 'all', service: 'all', responsible: 'all', priority: 'all', search: '' })}
                                className="px-3 py-2 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
                            >
                                <i className="fas fa-times mr-1"></i> Limpiar
                            </button>
                        )}
                    </div>

                    {/* Estadísticas rápidas */}
                    <div className="flex flex-wrap gap-4 text-sm text-slate-300">
                        <span>Total: <strong className="text-accent">{data.trainings.length}</strong></span>
                        <span>Próximas: <strong className="text-yellow-400">{upcomingTrainings.length}</strong></span>
                        <span>Completadas: <strong className="text-green-400">{data.trainings.filter(t => t.status === 'COMPLETADA').length}</strong></span>
                        <span>Filtradas: <strong className="text-blue-400">{filteredTrainings.length}</strong></span>
                    </div>
                </div>

                {/* Lista de capacitaciones */}
                {renderTrainings()}
            </div>
            
            {isEditModalOpen && (
                <TrainingEditModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    trainingToEdit={selectedTraining}
                    onSave={handleSaveTraining}
                />
            )}
        </>
    );
};

Trainings;

// === public/components/Calendar.js ===
const getStatusColor = (status, settings) => {
    const statusConfig = settings?.trainingStatuses?.find(s => s.name === status);
    return statusConfig ? statusConfig.color : 'bg-gray-500';
};

const getStatusTextColor = (status, settings) => {
    const statusConfig = settings?.trainingStatuses?.find(s => s.name === status);
    return statusConfig ? statusConfig.textColor : 'text-white';
};

const TrainingTooltip = ({ training, settings }) => {
    const statusConfig = settings?.trainingStatuses?.find(s => s.name === training.status);
    const topicConfig = settings?.trainingTopics?.find(t => t.name === training.topic);
    
    return (
        <div className="absolute z-50 bg-dark border border-primary rounded-lg p-3 shadow-xl min-w-64 -translate-x-1/2 left-1/2 bottom-full mb-2">
            <div className="text-sm space-y-2">
                <div className="font-bold text-accent">{training.clientFantasyName}</div>
                <div className="text-light">{training.topic}</div>
                <div className="flex justify-between text-xs text-slate-300">
                    <span>Responsable: {training.responsible}</span>
                    <span>{training.duration} min</span>
                </div>
                <div className="flex justify-between text-xs">
                    <span className="text-slate-400">Servicio: {training.service}</span>
                    <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(training.status, settings)} ${getStatusTextColor(training.status, settings)}`}>
                        {training.status}
                    </span>
                </div>
                {topicConfig?.priority && (
                    <div className="text-xs">
                        <span className="text-slate-400">Prioridad: </span>
                        <span className={settings?.trainingPriorities?.find(p => p.name === topicConfig.priority)?.color || 'text-white'}>
                            {topicConfig.priority}
                        </span>
                    </div>
                )}
                {training.notes && (
                    <div className="text-xs text-slate-300 border-t border-slate-600 pt-2">
                        {training.notes}
                    </div>
                )}
            </div>
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-dark"></div>
        </div>
    );
};

const Calendar = () => {
    const { data } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedFilters, setSelectedFilters] = useState({
        status: 'all',
        service: 'all',
        responsible: 'all'
    });
    const [hoveredTraining, setHoveredTraining] = useState(null);

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    // Filtrar capacitaciones según los filtros seleccionados
    const filteredTrainings = data.trainings.filter(training => {
        if (selectedFilters.status !== 'all' && training.status !== selectedFilters.status) return false;
        if (selectedFilters.service !== 'all' && training.service !== selectedFilters.service) return false;
        if (selectedFilters.responsible !== 'all' && training.responsible !== selectedFilters.responsible) return false;
        return true;
    });

    const trainingsByDate = {};
    filteredTrainings.forEach(t => {
        const dateKey = new Date(t.dateTime).toDateString();
        if (!trainingsByDate[dateKey]) {
            trainingsByDate[dateKey] = [];
        }
        trainingsByDate[dateKey].push(t);
    });

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const calendarDays = [];

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="border border-primary"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateKey = date.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();
        const dayTrainings = trainingsByDate[dateKey] || [];
        
        calendarDays.push(
            <div key={day} className={`border border-primary p-2 flex flex-col min-h-[120px] ${isToday ? 'bg-accent/20' : ''}`}>
                <span className={`font-bold text-sm ${isToday ? 'text-accent' : 'text-light'}`}>{day}</span>
                <div className="flex-1 overflow-y-auto mt-1 space-y-1">
                    {dayTrainings.slice(0, 3).map(t => {
                        const trainingTime = new Date(t.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                        return (
                            <div 
                                key={t.id} 
                                className={`text-xs p-1 rounded cursor-pointer transition-all hover:scale-105 relative ${getStatusColor(t.status, data.settings)} ${getStatusTextColor(t.status, data.settings)}`}
                                onMouseEnter={() => setHoveredTraining(t)}
                                onMouseLeave={() => setHoveredTraining(null)}
                                title={`${trainingTime} - ${t.clientFantasyName}: ${t.topic}`}
                            >
                                <div className="font-semibold truncate">{trainingTime}</div>
                                <div className="truncate">{t.clientFantasyName}</div>
                                {hoveredTraining?.id === t.id && (
                                    <TrainingTooltip training={t} settings={data.settings} />
                                )}
                            </div>
                        );
                    })}
                    {dayTrainings.length > 3 && (
                        <div className="text-xs text-slate-400 font-semibold">
                            +{dayTrainings.length - 3} más
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Obtener opciones únicas para los filtros
    const uniqueStatuses = [...new Set(data.trainings.map(t => t.status))];
    const uniqueServices = [...new Set(data.trainings.map(t => t.service))];
    const uniqueResponsibles = [...new Set(data.trainings.map(t => t.responsible))];

    const handleFilterChange = (filterType, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterType]: value
        }));
    };

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in h-full flex flex-col">
            {/* Header con navegación */}
            <div className="flex justify-between items-center mb-4">
                <button onClick={goToPreviousMonth} className="px-3 py-1 bg-primary rounded-lg hover:bg-accent transition-colors">
                    <i className="fas fa-chevron-left"></i>
                </button>
                <h2 className="text-xl font-bold text-light">
                    Calendario de Capacitaciones - {currentDate.toLocaleString('es-ES', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={goToNextMonth} className="px-3 py-1 bg-primary rounded-lg hover:bg-accent transition-colors">
                    <i className="fas fa-chevron-right"></i>
                </button>
            </div>

            {/* Filtros y controles */}
            <div className="mb-4 flex flex-wrap gap-4 items-center">
                <button onClick={goToToday} className="text-accent hover:underline text-sm font-semibold">
                    <i className="fas fa-calendar-day mr-1"></i> Ir a Hoy
                </button>
                
                <div className="flex flex-wrap gap-2">
                    <select 
                        value={selectedFilters.status} 
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                        className="bg-primary text-light text-sm px-3 py-1 rounded border border-slate-600 focus:border-accent"
                    >
                        <option value="all">Todos los estados</option>
                        {uniqueStatuses.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </select>

                    <select 
                        value={selectedFilters.service} 
                        onChange={(e) => handleFilterChange('service', e.target.value)}
                        className="bg-primary text-light text-sm px-3 py-1 rounded border border-slate-600 focus:border-accent"
                    >
                        <option value="all">Todos los servicios</option>
                        {uniqueServices.map(service => (
                            <option key={service} value={service}>{service}</option>
                        ))}
                    </select>

                    <select 
                        value={selectedFilters.responsible} 
                        onChange={(e) => handleFilterChange('responsible', e.target.value)}
                        className="bg-primary text-light text-sm px-3 py-1 rounded border border-slate-600 focus:border-accent"
                    >
                        <option value="all">Todos los responsables</option>
                        {uniqueResponsibles.map(responsible => (
                            <option key={responsible} value={responsible}>{responsible}</option>
                        ))}
                    </select>
                </div>

                <div className="text-sm text-slate-400">
                    Mostrando {filteredTrainings.length} de {data.trainings.length} capacitaciones
                </div>
            </div>

            {/* Calendario */}
            <div className="grid grid-cols-7 text-center font-bold text-slate-400 border-b border-primary">
                {days.map(day => <div key={day} className="p-3">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 flex-1 border-l border-primary">
                {calendarDays}
            </div>

            {/* Leyenda de estados */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
                <span className="text-slate-400 font-semibold">Estados:</span>
                {data.settings?.trainingStatuses?.map(status => (
                    <div key={status.id} className="flex items-center gap-1">
                        <div className={`w-3 h-3 rounded ${status.color}`}></div>
                        <span className="text-slate-300">{status.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

Calendar;

// === public/components/Checklists.js ===
const ChecklistDetailView = ({ client, onBack }) => {
    const { data, updateChecklistState } = useAppContext();
    const checklistData = data.settings.checklistData || [];
    const [openAccordion, setOpenAccordion] = useState('tecnico');

    const handleAccordionClick = (accordionId) => {
        setOpenAccordion(openAccordion === accordionId ? null : accordionId);
    };
    
    const handleCheckboxChange = (category, itemId, isChecked) => {
        updateChecklistState(client.id, category, itemId, isChecked);
    };

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="mr-4 p-2 rounded-full text-slate-400 hover:bg-primary hover:text-light">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h2 className="text-2xl font-bold text-light">Checklist: <span className="text-accent">{client.fantasyName}</span></h2>
            </div>

            <div className="rounded-lg overflow-hidden">
                {checklistData.map(({ id, title, items }) => {
                    const completedItems = client.checklistState[id]?.length || 0;
                    const progress = items.length > 0 ? (completedItems / items.length) * 100 : 0;

                    return (
                        <div key={id} className="border-b border-primary">
                            <button type="button" className="flex items-center justify-between w-full p-5 font-medium text-left text-light bg-secondary hover:bg-slate-700" onClick={() => handleAccordionClick(id)}>
                                <div className="flex-1">
                                    <span>{title}</span>
                                    <div className="w-full bg-primary rounded-full h-2.5 mt-2">
                                        <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                                <i className={`fas fa-chevron-down transition-transform duration-200 ml-4 ${openAccordion === id ? 'rotate-180' : ''}`}></i>
                            </button>
                            <div className={`p-5 bg-primary ${openAccordion === id ? '' : 'hidden'}`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {items.map((item) => (
                                        <label key={item.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-secondary cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="form-checkbox h-5 w-5 rounded bg-slate-600 border-slate-500 text-accent focus:ring-accent"
                                                checked={client.checklistState[id]?.includes(item.id) || false}
                                                onChange={(e) => handleCheckboxChange(id, item.id, e.target.checked)}
                                            />
                                            <span className="text-sm text-slate-300">{item.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};


const Checklists = () => {
    const { data } = useAppContext();
    const [selectedClient, setSelectedClient] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    const checklistData = data.settings.checklistData || [];
    const totalChecklistItems = useMemo(() => checklistData.reduce((acc, category) => acc + category.items.length, 0), [checklistData]);

    const filteredClients = useMemo(() => {
        return data.clients.filter(client =>
            client.fantasyName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data.clients, searchTerm]);

    const calculateOverallProgress = (client) => {
        if (totalChecklistItems === 0) return 0;
        const completedCount = Object.values(client.checklistState || {}).reduce((acc, items) => acc + items.length, 0);
        return (completedCount / totalChecklistItems) * 100;
    };


    if (selectedClient) {
        return <ChecklistDetailView client={selectedClient} onBack={() => setSelectedClient(null)} />;
    }

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in h-full flex flex-col">
            <h2 className="text-3xl font-bold text-light mb-6">Seleccionar Cliente para ver Checklist</h2>
            <div className="relative mb-4">
                <input
                    type="text"
                    placeholder="Buscar cliente..."
                    className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-4 text-light focus:outline-none focus:ring-2 focus:ring-accent"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                 <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
            </div>
            <div className="flex-1 overflow-y-auto">
                <ul className="space-y-3">
                    {filteredClients.map(client => {
                        const progress = calculateOverallProgress(client);
                        return (
                            <li key={client.id}>
                                <button onClick={() => setSelectedClient(client)} className="w-full text-left bg-primary p-4 rounded-lg shadow-md hover:bg-slate-700 transition-colors flex items-center justify-between">
                                    <div>
                                        <p className="font-bold text-lg text-light">{client.fantasyName}</p>
                                        <p className="text-sm text-slate-400">{client.legalName}</p>
                                    </div>
                                    <div className="w-1/3">
                                        <div className="w-full bg-secondary rounded-full h-2.5">
                                            <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                        </div>
                                        <p className="text-xs text-right text-slate-400 mt-1">{Math.round(progress)}%</p>
                                    </div>
                                </button>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};

Checklists;

// === public/components/Ecommerce.js ===
const getConfigStatusColor = (status) => {
    switch (status) {
        case 'Completado': return 'text-green-400';
        case 'En Progreso': return 'text-yellow-400';
        case 'Pendiente': return 'text-orange-400';
        default: return 'text-gray-400';
    }
};

const getHostingStatusColor = (status) => {
    switch (status) {
        case 'Activo': return 'text-green-400';
        case 'Contratado': return 'text-blue-400';
        case 'Pendiente': return 'text-orange-400';
        default: return 'text-gray-400';
    }
};

const Ecommerce = () => {
    const { data } = useAppContext();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const ecommerceClients = useMemo(() => {
        return data.clients.filter(c => c.ecommerceDetails);
    }, [data.clients]);

    const getTrainingsForClient = (clientId) => {
        return data.trainings.filter(t => t.clientId === clientId && t.service === 'Ecommerce');
    };

    const handleEdit = (client) => {
        setSelectedClient(client);
        setEditModalOpen(true);
    };

    return (
        <>
            <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in h-full flex flex-col">
                <div className="flex items-center mb-6 pb-4 border-b border-primary">
                    <i className="fas fa-shopping-cart text-3xl text-accent mr-4"></i>
                    <h2 className="text-3xl font-bold text-light">Seguimiento Ecommerce</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {ecommerceClients.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>No hay clientes con el servicio de Ecommerce contratado.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {ecommerceClients.map(client => (
                                <div key={client.id} className="bg-primary p-4 rounded-lg shadow-md relative">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-accent mb-3">{client.fantasyName}</h3>
                                        <button onClick={() => handleEdit(client)} className="text-slate-400 hover:text-accent transition-colors p-1" aria-label={`Editar detalles de ${client.fantasyName}`}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-slate-400 text-xs">Host / Plataforma</p>
                                            <p className="font-semibold">{client.ecommerceDetails?.host}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs">Estado Configuración</p>
                                            <p className={`font-semibold ${getConfigStatusColor(client.ecommerceDetails.configStatus)}`}>
                                                <i className="fas fa-circle text-xs mr-2"></i>{client.ecommerceDetails?.configStatus}
                                            </p>
                                        </div>
                                         <div>
                                            <p className="text-slate-400 text-xs">URL</p>
                                            <a href={client.ecommerceDetails?.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-light hover:text-accent truncate block">{client.ecommerceDetails?.url}</a>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs">Hosting</p>
                                            <p className={`font-semibold ${getHostingStatusColor(client.ecommerceDetails.hostingStatus)}`}>
                                                {client.ecommerceDetails?.hostingStatus} ({client.ecommerceDetails?.hostingManagedBy})
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-slate-400 text-xs">Capacitaciones</p>
                                        <ul className="text-xs mt-1 space-y-1">
                                            {getTrainingsForClient(client.id).map(t => (
                                                <li key={t.id} className="bg-secondary p-1 rounded-md">{t.topic} ({t.status})</li>
                                            ))}
                                            {getTrainingsForClient(client.id).length === 0 && <li className="text-slate-500">Sin capacitaciones</li>}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isEditModalOpen && selectedClient && (
                <EcommerceEditModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    client={selectedClient}
                />
            )}
        </>
    );
};

Ecommerce;

// === public/components/EcommerceEditModal.js ===
const FormInput = ({ label, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormSelect = ({ label, children, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent">
            {children}
        </select>
    </div>
);

const EcommerceEditModal = ({ isOpen, onClose, client }) => {
    const { saveEcommerceDetails } = useAppContext();
    const [formData, setFormData] = useState(client.ecommerceDetails);

    useEffect(() => {
        if (isOpen && client.ecommerceDetails) {
            setFormData(client.ecommerceDetails);
        }
    }, [client, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        saveEcommerceDetails(client.id, formData);
        onClose();
    };

    if (!formData) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Editar Ecommerce: ${client.fantasyName}`}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar Cambios</button>
                </>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Host / Plataforma" name="host" value={formData.host} onChange={handleChange} />
                <FormSelect label="Estado Configuración" name="configStatus" value={formData.configStatus} onChange={handleChange}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completado">Completado</option>
                </FormSelect>
                <FormInput label="URL Tienda" name="url" value={formData.url} onChange={handleChange} className="md:col-span-2" />
                <FormSelect label="Estado Hosting" name="hostingStatus" value={formData.hostingStatus} onChange={handleChange}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Contratado">Contratado</option>
                    <option value="Activo">Activo</option>
                </FormSelect>
                <FormSelect label="Hosting Administrado Por" name="hostingManagedBy" value={formData.hostingManagedBy} onChange={handleChange}>
                    <option value="Cliente">Cliente</option>
                    <option value="Nosotros">Nosotros</option>
                </FormSelect>
            </div>
        </Modal>
    );
};

EcommerceEditModal;

// === public/components/AppPedido.js ===
const AppPedido = () => {
    const { data } = useAppContext();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const appPedidoClients = useMemo(() => {
        return data.clients.filter(c => c.appPedidoDetails);
    }, [data.clients]);
    
    const getTrainingsForClient = (clientId) => {
        return data.trainings.filter(t => t.clientId === clientId && t.service === 'App Pedido');
    };

    const handleEdit = (client) => {
        setSelectedClient(client);
        setEditModalOpen(true);
    };

    return (
        <>
            <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in h-full flex flex-col">
                <div className="flex items-center mb-6 pb-4 border-b border-primary">
                    <i className="fas fa-mobile-alt text-3xl text-accent mr-4"></i>
                    <h2 className="text-3xl font-bold text-light">Gestión App Pedido</h2>
                </div>
                
                 <div className="flex-1 overflow-y-auto">
                    {appPedidoClients.length === 0 ? (
                        <div className="text-center py-10 text-slate-400">
                            <p>No hay clientes con la App de Pedido contratada.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {appPedidoClients.map(client => (
                                <div key={client.id} className="bg-primary p-4 rounded-lg shadow-md">
                                     <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-accent mb-3">{client.fantasyName}</h3>
                                        <button onClick={() => handleEdit(client)} className="text-slate-400 hover:text-accent transition-colors p-1" aria-label={`Editar detalles de ${client.fantasyName}`}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                                        <div>
                                            <p className="text-slate-400 text-xs">Licencias Contratadas</p>
                                            <p className="font-semibold text-2xl">{client.appPedidoDetails?.licenses}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs">IMEIs con Licencia</p>
                                            <div className="text-xs bg-secondary p-2 rounded-md max-h-20 overflow-y-auto">
                                                {client.appPedidoDetails?.imeis && client.appPedidoDetails.imeis.length > 0 ? (
                                                    client.appPedidoDetails.imeis.map(imei => <div key={imei}>{imei}</div>)
                                                ) : <p className="text-slate-500">Sin IMEIs</p>}
                                            </div>
                                        </div>
                                    </div>
                                     <div className="mt-4">
                                        <p className="text-slate-400 text-xs">Capacitaciones</p>
                                        <ul className="text-xs mt-1 space-y-1">
                                            {getTrainingsForClient(client.id).map(t => (
                                                <li key={t.id} className="bg-secondary p-1 rounded-md">{t.topic} ({t.status})</li>
                                            ))}
                                            {getTrainingsForClient(client.id).length === 0 && <li className="text-slate-500">Sin capacitaciones</li>}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            {isEditModalOpen && selectedClient && (
                <AppPedidoEditModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    client={selectedClient}
                />
            )}
        </>
    );
};

AppPedido;

// === public/components/AppPedidoEditModal.js ===
const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormTextarea = ({ label, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const AppPedidoEditModal = ({ isOpen, onClose, client }) => {
    const { saveAppPedidoDetails } = useAppContext();
    const [formData, setFormData] = useState(client.appPedidoDetails);
    const [imeiText, setImeiText] = useState('');

    useEffect(() => {
        if (isOpen && client.appPedidoDetails) {
            setFormData(client.appPedidoDetails);
            setImeiText(client.appPedidoDetails.imeis.join('\n'));
        }
    }, [client, isOpen]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleImeiChange = (e) => {
        setImeiText(e.target.value);
    };

    const handleSubmit = () => {
        const imeis = imeiText.split('\n').map(s => s.trim()).filter(Boolean);
        const finalData = { ...formData, imeis };
        saveAppPedidoDetails(client.id, finalData);
        onClose();
    };

    if (!formData) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Editar App Pedido: ${client.fantasyName}`}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar Cambios</button>
                </>
            }
        >
            <div className="space-y-4">
                <FormInput label="Licencias" name="licenses" type="number" value={formData.licenses} onChange={handleFormChange} />
                <FormTextarea label="IMEIs (uno por línea)" rows={5} value={imeiText} onChange={handleImeiChange} />
            </div>
        </Modal>
    );
};

AppPedidoEditModal;

// === public/components/Kos.js ===
const Kos = () => {
    const { data } = useAppContext();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);


    const kosClients = useMemo(() => {
        return data.clients.filter(c => c.kosDetails);
    }, [data.clients]);

    const getTrainingsForClient = (clientId) => {
        return data.trainings.filter(t => t.clientId === clientId && t.service === 'KOS');
    };
    
    const handleEdit = (client) => {
        setSelectedClient(client);
        setEditModalOpen(true);
    };

    return (
        <>
            <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in h-full flex flex-col">
                <div className="flex items-center mb-6 pb-4 border-b border-primary">
                    <i className="fas fa-laptop-medical text-3xl text-accent mr-4"></i>
                    <h2 className="text-3xl font-bold text-light">Seguimiento KOS (Sistemas Médicos)</h2>
                </div>
                
                <div className="flex-1 overflow-y-auto">
                    {kosClients.length === 0 ? (
                         <div className="text-center py-10 text-slate-400">
                            <p>No hay clientes con el servicio KOS contratado.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {kosClients.map(client => (
                                 <div key={client.id} className="bg-primary p-4 rounded-lg shadow-md">
                                    <div className="flex justify-between items-start">
                                        <h3 className="text-xl font-bold text-accent mb-3">{client.fantasyName}</h3>
                                        <button onClick={() => handleEdit(client)} className="text-slate-400 hover:text-accent transition-colors p-1" aria-label={`Editar detalles de ${client.fantasyName}`}>
                                            <i className="fas fa-edit"></i>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-sm">
                                        <div>
                                            <p className="text-slate-400 text-xs">Especialidad</p>
                                            <p className="font-semibold">{client.kosDetails?.specialty}</p>
                                        </div>
                                        <div>
                                            <p className="text-slate-400 text-xs">Licencias Contratadas</p>
                                            <p className="font-semibold text-2xl">{client.kosDetails?.licenses}</p>
                                        </div>
                                    </div>
                                    <div className="mt-4">
                                        <p className="text-slate-400 text-xs">Capacitaciones</p>
                                        <ul className="text-xs mt-1 space-y-1">
                                            {getTrainingsForClient(client.id).map(t => (
                                                <li key={t.id} className="bg-secondary p-1 rounded-md">{t.topic} ({t.status})</li>
                                            ))}
                                            {getTrainingsForClient(client.id).length === 0 && <li className="text-slate-500">Sin capacitaciones</li>}
                                        </ul>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
             {isEditModalOpen && selectedClient && (
                <KosEditModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    client={selectedClient}
                />
            )}
        </>
    );
};

Kos;

// === public/components/KosEditModal.js ===
const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);


const KosEditModal = ({ isOpen, onClose, client }) => {
    const { saveKosDetails } = useAppContext();
    const [formData, setFormData] = useState(client.kosDetails);

    useEffect(() => {
        if (isOpen && client.kosDetails) {
            setFormData(client.kosDetails);
        }
    }, [client, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'licenses' ? Number(value) : value }));
    };

    const handleSubmit = () => {
        saveKosDetails(client.id, formData);
        onClose();
    };

    if (!formData) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Editar KOS: ${client.fantasyName}`}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar Cambios</button>
                </>
            }
        >
            <div className="space-y-4">
                <FormInput label="Especialidad" name="specialty" value={formData.specialty} onChange={handleChange} />
                <FormInput label="Licencias" name="licenses" type="number" value={formData.licenses} onChange={handleChange} />
            </div>
        </Modal>
    );
};

KosEditModal;

// === public/components/ConfigOptionEditModal.js ===
const newOptionTemplate = {
    name: '',
    description: '',
};

const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormTextarea = ({ label, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} rows={3} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);


const ConfigOptionEditModal = ({ isOpen, onClose, optionToEdit, onSave, title }) => {
    const [formData, setFormData] = useState(newOptionTemplate);

    useEffect(() => {
        if (isOpen) {
            if (optionToEdit) {
                setFormData({
                    name: optionToEdit.name,
                    description: optionToEdit.description || '',
                });
            } else {
                setFormData(newOptionTemplate);
            }
        }
    }, [optionToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const optionData = {
            id: optionToEdit?.id || `new_${Date.now()}`,
            name: formData.name,
            description: formData.description,
        };
        onSave(optionData);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar</button>
                </>
            }
        >
           <div className="space-y-4">
                <FormInput 
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <FormTextarea
                    label="Descripción (Opcional)"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
           </div>
        </Modal>
    );
};

ConfigOptionEditModal;

// === public/components/Settings.js ===
const ConfigList = ({ title, items, onEdit, onAdd, onDelete }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-light">{title}</h3>
                <button onClick={onAdd} className="bg-accent text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">
                    <i className="fas fa-plus mr-2"></i> Añadir Nuevo
                </button>
            </div>
            <div className="bg-primary rounded-lg shadow-inner">
                <ul className="divide-y divide-slate-700">
                    {items.map(item => (
                        <li key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors">
                            <div>
                                <p className="font-medium text-light">{item.name}</p>
                                {item.description && <p className="text-xs text-slate-400 mt-1">{item.description}</p>}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => onEdit(item)} className="text-slate-400 hover:text-accent transition-colors p-1" aria-label={`Editar ${item.name}`}><i className="fas fa-edit"></i></button>
                                <button onClick={() => onDelete(item)} className="text-slate-400 hover:text-red-500 transition-colors p-1" aria-label={`Eliminar ${item.name}`}><i className="fas fa-trash"></i></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ChecklistConfig = ({ items, onUpdate }) => {
    // NOTE: Checklist editing still uses prompts for simplicity, could be upgraded to modals.
    const handleEditCategoryTitle = (categoryId, currentTitle) => {
        const newTitle = prompt("Nuevo título para la categoría:", currentTitle);
        if (newTitle) {
            onUpdate(items.map(cat => cat.id === categoryId ? { ...cat, title: newTitle } : cat));
        }
    };

    const handleEditItemLabel = (categoryId, itemId, currentLabel) => {
        const newLabel = prompt("Nuevo texto para la tarea:", currentLabel);
        if (newLabel) {
            onUpdate(items.map(cat => {
                if (cat.id === categoryId) {
                    return { ...cat, items: cat.items.map(it => it.id === itemId ? { ...it, label: newLabel } : it) };
                }
                return cat;
            }));
        }
    };
    
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-light">Parámetros del Checklist</h3>
            {items.map(category => (
                <div key={category.id} className="bg-primary p-4 rounded-lg shadow-inner">
                    <div className="flex justify-between items-center mb-3">
                         <h4 className="text-md font-bold text-accent">{category.title}</h4>
                         <div>
                            <button onClick={() => handleEditCategoryTitle(category.id, category.title)} className="text-slate-400 hover:text-accent transition-colors p-1 ml-2" aria-label={`Editar ${category.title}`}><i className="fas fa-edit"></i></button>
                         </div>
                    </div>
                    <ul className="divide-y divide-slate-700/50">
                        {category.items.map(item => (
                            <li key={item.id} className="py-2 px-2 flex justify-between items-center hover:bg-slate-700/50 rounded-md">
                                <p className="text-sm text-light">{item.label}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditItemLabel(category.id, item.id, item.label)} className="text-slate-500 hover:text-accent transition-colors p-1" aria-label={`Editar ${item.label}`}><i className="fas fa-edit text-xs"></i></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

const Settings = () => {
    const { data, updateSettings } = useAppContext();
    const [activeTab, setActiveTab] = useState('statuses');
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState(null);

    const handleOpenModal = (listKey, option = null) => {
        setEditingOption({ listKey, option });
        setModalOpen(true);
    };

    const handleSaveOption = (updatedOption) => {
        if (!editingOption) return;
        const { listKey } = editingOption;
        
        const list = data.settings[listKey];
        let updatedList;

        if (updatedOption.id.startsWith('new_')) {
            // It's a new item
            updatedList = [...list, { ...updatedOption, id: `opt_${Date.now()}` }];
        } else {
            // It's an existing item
            updatedList = list.map(item => item.id === updatedOption.id ? updatedOption : item);
        }

        const newSettings = { ...data.settings, [listKey]: updatedList };
        updateSettings(newSettings);
        setModalOpen(false);
        setEditingOption(null);
    };

    const handleDeleteOption = (listKey, optionToDelete) => {
         if (window.confirm(`¿Seguro que quieres eliminar "${optionToDelete.name}"?`)) {
            const list = data.settings[listKey];
            const updatedList = list.filter(item => item.id !== optionToDelete.id);
            const newSettings = { ...data.settings, [listKey]: updatedList };
            updateSettings(newSettings);
        }
    }

    const tabs = [
        { id: 'statuses', label: 'Estados Cliente' }, { id: 'industries', label: 'Rubros' },
        { id: 'connections', label: 'Tipos Conexión' }, { id: 'contracts', label: 'Tipos Contrato' },
        { id: 'emissionModels', label: 'Modelos Emisión' }, { id: 'freezeReasons', label: 'Motivos Congelación' },
        { id: 'trainingTypes', label: 'Tipos Capacitación' }, { id: 'trainingServices', label: 'Servicios Cap.' },
        { id: 'trainingTopics', label: 'Temas Capacitación' }, { id: 'trainingStatuses', label: 'Estados Cap.' },
        { id: 'trainingPriorities', label: 'Prioridades Cap.' }, { id: 'modules', label: 'Módulos Sistema' },
        { id: 'users', label: 'Responsables' }, { id: 'checklists', label: 'Checklists' },
    ];
    
    const renderConfigList = (listKey, title) => {
        const items = data.settings[listKey];
        return (
            <ConfigList 
                title={title}
                items={items}
                onAdd={() => handleOpenModal(listKey, null)}
                onEdit={(option) => handleOpenModal(listKey, option)}
                onDelete={(option) => handleDeleteOption(listKey, option)}
            />
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'statuses': return renderConfigList('clientStatuses', 'Estados de Cliente');
            case 'industries': return renderConfigList('industries', 'Rubros de Clientes');
            case 'connections': return renderConfigList('connectionTypes', 'Tipos de Conexión');
            case 'contracts': return renderConfigList('contractTypes', 'Tipos de Contrato');
            case 'emissionModels': return renderConfigList('emissionModels', 'Modelos de Emisión');
            case 'freezeReasons': return renderConfigList('freezeReasons', 'Motivos de Congelación');
            case 'trainingTypes': return renderConfigList('trainingTypes', 'Tipos de Capacitación');
            case 'trainingServices': return renderConfigList('trainingServices', 'Servicios de Capacitación');
            case 'trainingTopics': return renderConfigList('trainingTopics', 'Temas de Capacitación');
            case 'trainingStatuses': return renderConfigList('trainingStatuses', 'Estados de Capacitación');
            case 'trainingPriorities': return renderConfigList('trainingPriorities', 'Prioridades de Capacitación');
            case 'modules': return renderConfigList('systemModules', 'Módulos del Sistema');
            case 'users': return renderConfigList('users', 'Responsables / Usuarios');
            case 'checklists': return <ChecklistConfig items={data.settings.checklistData} onUpdate={(val) => updateSettings({ ...data.settings, checklistData: val })} />;
            default: return null;
        }
    };

    return (
        <>
            <div className="bg-secondary p-4 md:p-6 rounded-lg shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold text-light mb-6 border-b border-primary pb-4">Configuración del Sistema</h2>
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-1/4 lg:w-1/5">
                        <nav className="flex flex-col space-y-2">
                            {tabs.map(tab => (
                                 <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2.5 text-left font-semibold text-sm rounded-lg transition-colors ${activeTab === tab.id ? 'bg-accent text-white shadow-md' : 'text-slate-300 hover:bg-primary hover:text-light'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="w-full md:w-3/4 lg:w-4/5">
                        {renderContent()}
                    </main>
                </div>
            </div>

            {isModalOpen && editingOption && (
                <ConfigOptionEditModal 
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    optionToEdit={editingOption.option}
                    onSave={handleSaveOption}
                    title={editingOption.option ? 'Editar Opción' : 'Crear Nueva Opción'}
                />
            )}
        </>
    );
};

Settings;

// === public/components/GeneralAnalysisModal.js ===
const GeneralAnalysisModal = ({ isOpen, onClose }) => {
    const { data } = useAppContext();
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchAnalysis = async () => {
                setIsLoading(true);
                setAnalysis('');
                const result = await generateOverallClientAnalysis(data.clients);
                setAnalysis(result);
                setIsLoading(false);
            };
            fetchAnalysis();
        }
    }, [isOpen, data.clients]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Análisis General de Clientes (IA)">
            <div className="min-h-[250px] max-h-[60vh] overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full min-h-[250px]">
                        <Spinner />
                    </div>
                ) : (
                    <div className="text-sm text-slate-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong class="text-accent">$1</strong>').replace(/\n/g, '<br />') }} />
                )}
            </div>
        </Modal>
    );
};

GeneralAnalysisModal;

// === App Initialization ===
const AppContent = () => {
    const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [activeView, setActiveView] = useState('dashboard');

    const toggleSidebar = useCallback(() => {
        setSidebarCollapsed(prevState => !prevState);
    }, []);

    const renderActiveView = () => {
        switch (activeView) {
            case 'dashboard': return React.createElement(Dashboard);
            case 'clients': return React.createElement(Clients);
            case 'trainings': return React.createElement(Trainings);
            case 'calendar': return React.createElement(Calendar);
            case 'checklists': return React.createElement(Checklists);
            case 'ecommerce': return React.createElement(Ecommerce);
            case 'app_pedido': return React.createElement(AppPedido);
            case 'kos': return React.createElement(Kos);
            case 'settings': return React.createElement(Settings);
            default: return React.createElement(Dashboard);
        }
    };

    const currentViewTitle = navItems.find(item => item.id === activeView)?.label || 'Dashboard';

    return React.createElement('div', { className: 'flex h-screen bg-primary text-light overflow-hidden' },
        React.createElement(Sidebar, { 
            isCollapsed: isSidebarCollapsed, 
            activeView: activeView, 
            setActiveView: setActiveView 
        }),
        React.createElement('div', { 
            className: `flex-1 flex flex-col transition-all duration-300 ease-in-out ${isSidebarCollapsed ? 'ml-[60px]' : 'ml-64'}`
        },
            React.createElement(Header, { 
                toggleSidebar: toggleSidebar, 
                isSidebarCollapsed: isSidebarCollapsed,
                title: currentViewTitle
            }),
            React.createElement('main', { 
                className: 'flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto bg-dark/50'
            }, renderActiveView())
        )
    );
};

const App = () => {
    const { data, loading } = useAppData();

    if (loading || !data) {
        return React.createElement('div', { className: 'flex h-screen justify-center items-center bg-primary' },
            React.createElement(Spinner)
        );
    }

    return React.createElement(AppProvider, { initialData: data },
        React.createElement(AppContent)
    );
};

// Initialize the application
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
