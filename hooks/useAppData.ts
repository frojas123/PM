
import { useState, useEffect } from 'react';
import { Client, Training, DashboardStats, AppData, SettingsData, ChecklistCategory } from '../types';

const mockClients: Client[] = [
    { id: 'C001', legalName: 'Tech Solutions S.A.', fantasyName: 'TechSolve', status: 'Activo', industry: 'Tecnología', registrationDate: '2023-01-15', expectedGoLiveDate: '2023-03-01', actualGoLiveDate: '2023-02-25', licenses: 50, connectionType: 'API', contractType: 'Anual', databaseName: 'db_techsolve', emissionModel: 'El comprobante electrónico siempre como boleta electrónica', observations: 'Cliente estratégico, requiere seguimiento especial.', clientEmail: 'contacto@techsolve.com', email2: 'soporte@techsolve.com', email3: '', asanaLink: '#', crmLink: '#', freezeDate: null, freezeReason: null, freezeDetails: null, checklistState: { tecnico: ['tec_01', 'tec_02', 'tec_03', 'tec_04', 'tec_05', 'tec_06', 'tec_07', 'tec_08', 'tec_09', 'tec_10', 'tec_11', 'tec_12', 'tec_13', 'tec_14', 'tec_15', 'tec_16', 'tec_17', 'tec_18', 'tec_19', 'tec_20'], pm: ['pm_01', 'pm_02', 'pm_03', 'pm_04', 'pm_05', 'pm_06', 'pm_07', 'pm_08', 'pm_09', 'pm_10'], general: ['gen_01', 'gen_02', 'gen_03', 'gen_04', 'gen_05', 'gen_06', 'gen_07'], validacion: ['val_01', 'val_02', 'val_03', 'val_04', 'val_05'], seguimiento: ['seg_01'] }, appPedidoDetails: { licenses: 20, imeis: ['IMEI12345678901', 'IMEI12345678902', 'IMEI12345678903'] } },
    { id: 'C002', legalName: 'Gourmet Foods Ltda.', fantasyName: 'Gourmet Market', status: 'Implementación', industry: 'Alimentos', registrationDate: '2023-05-20', expectedGoLiveDate: '2023-08-01', actualGoLiveDate: null, licenses: 25, connectionType: 'FTP', contractType: 'Mensual', databaseName: 'db_gourmet', emissionModel: 'Las boletas electrónicas son válidas para todo evento', observations: '', clientEmail: 'admin@gourmet.cl', email2: '', email3: '', asanaLink: '#', crmLink: '#', freezeDate: null, freezeReason: null, freezeDetails: null, checklistState: { tecnico: ['tec_01', 'tec_02', 'tec_05', 'tec_06'], pm: ['pm_01', 'pm_02'], general: [], validacion: [], seguimiento: [] }, ecommerceDetails: { host: 'Shopify', configStatus: 'En Progreso', url: 'https://gourmetmarket.shop', hostingStatus: 'Contratado', hostingManagedBy: 'Nosotros' } },
    { id: 'C003', legalName: 'Constructora del Sur', fantasyName: 'ConSur', status: 'Activo', industry: 'Construcción', registrationDate: '2022-11-10', expectedGoLiveDate: '2023-01-15', actualGoLiveDate: '2023-01-20', licenses: 100, connectionType: 'Web Service', contractType: 'Anual', databaseName: 'db_consur', emissionModel: 'El comprobante electrónico siempre como boleta electrónica', observations: 'Utilizan módulo de reportes avanzado.', clientEmail: 'gerencia@consur.com', email2: '', email3: '', asanaLink: '#', crmLink: '#', freezeDate: null, freezeReason: null, freezeDetails: null, checklistState: { tecnico: Array.from({length: 20}, (_, i) => `tec_${String(i + 1).padStart(2, '0')}`), pm: Array.from({length: 10}, (_, i) => `pm_${String(i + 1).padStart(2, '0')}`), general: Array.from({length: 7}, (_, i) => `gen_${String(i + 1).padStart(2, '0')}`), validacion: Array.from({length: 10}, (_, i) => `val_${String(i + 1).padStart(2, '0')}`), seguimiento: Array.from({length: 6}, (_, i) => `seg_${String(i + 1).padStart(2, '0')}`) } },
    { id: 'C004', legalName: 'Moda Rápida Inc.', fantasyName: 'FastFashion', status: 'En Pausa', industry: 'Retail', registrationDate: '2023-03-01', expectedGoLiveDate: '2023-05-01', actualGoLiveDate: null, licenses: 75, connectionType: 'API', contractType: 'Semestral', databaseName: 'db_ffashion', emissionModel: 'Las boletas electrónicas son válidas para todo evento', observations: '', clientEmail: 'ti@fastfashion.com', email2: 'ceo@fastfashion.com', email3: '', asanaLink: '#', crmLink: '#', freezeDate: '2023-04-10', freezeReason: 'Reestructuración interna', freezeDetails: 'El cliente está redefiniendo sus procesos internos y pausó la implementación.', checklistState: { tecnico: ['tec_01', 'tec_02', 'tec_05', 'tec_06', 'tec_07', 'tec_08', 'tec_09'], pm: ['pm_01', 'pm_02', 'pm_03'], general: ['gen_01'], validacion: [], seguimiento: [] }, ecommerceDetails: { host: 'WooCommerce', configStatus: 'Pendiente', url: 'https://fastfashion.com', hostingStatus: 'Pendiente', hostingManagedBy: 'Cliente' } },
    { id: 'C005', legalName: 'Clínica Dental Sonrisa', fantasyName: 'Clínica Sonrisa', status: 'Activo', industry: 'Salud', registrationDate: '2023-02-01', expectedGoLiveDate: '2023-04-01', actualGoLiveDate: '2023-04-05', licenses: 15, connectionType: 'API', contractType: 'Anual', databaseName: 'db_sonrisa', emissionModel: 'El comprobante electrónico siempre como boleta electrónica', observations: '', clientEmail: 'admin@sonrisa.com', email2: '', email3: '', asanaLink: '#', crmLink: '#', freezeDate: null, freezeReason: null, freezeDetails: null, checklistState: { tecnico: Array.from({length: 20}, (_, i) => `tec_${String(i + 1).padStart(2, '0')}`), pm: Array.from({length: 10}, (_, i) => `pm_${String(i + 1).padStart(2, '0')}`), general: Array.from({length: 7}, (_, i) => `gen_${String(i + 1).padStart(2, '0')}`), validacion: [], seguimiento: [] }, kosDetails: { specialty: 'Odontología', licenses: 5 } },
];

const mockTrainings: Training[] = [
    { id: 'T001', clientId: 'C002', clientFantasyName: 'Gourmet Market', type: 'PM', service: 'General', topic: 'Capacitación ventas', responsible: 'Ana Pérez', dateTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(), duration: 180, notes: 'Capacitación inicial para el equipo de ventas y caja.', status: 'AGENDADA' },
    { id: 'T002', clientId: 'C001', clientFantasyName: 'TechSolve', type: 'General', service: 'App Pedido', topic: 'Configuración de la App', responsible: 'Juan Díaz', dateTime: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(), duration: 60, notes: 'Refuerzo para nuevos empleados.', status: 'AGENDADA' },
    { id: 'T003', clientId: 'C003', clientFantasyName: 'ConSur', type: 'PM', service: 'General', topic: 'Capacitación Inventario', responsible: 'Ana Pérez', dateTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), duration: 120, notes: 'Equipo de bodega capacitado.', status: 'COMPLETADA' },
    { id: 'T004', clientId: 'C001', clientFantasyName: 'TechSolve', type: 'PM', service: 'General', topic: 'Introducción al sistema y parámetros de producto', responsible: 'Juan Díaz', dateTime: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), duration: 120, notes: 'Se canceló por problemas de agenda del cliente.', status: 'CANCELADA' },
    { id: 'T005', clientId: 'C005', clientFantasyName: 'Clínica Sonrisa', type: 'General', service: 'KOS', topic: 'Gestión de Fichas de Pacientes', responsible: 'María Rodriguez', dateTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), duration: 90, notes: 'Capacitación para el personal médico.', status: 'AGENDADA' },
    { id: 'T006', clientId: 'C004', clientFantasyName: 'FastFashion', type: 'General', service: 'Ecommerce', topic: 'Carga Masiva de Productos', responsible: 'Juan Díaz', dateTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(), duration: 75, notes: 'Capacitación para el equipo de e-commerce.', status: 'AGENDADA' },
];

const mockDashboardStats: DashboardStats = {
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

const mockChecklistData: ChecklistCategory[] = [
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

const mockSettings: SettingsData = {
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
    trainingTopicsPM: [
        { id: 'tpm1', name: 'Introducción al sistema y parámetros de producto' }, { id: 'tpm2', name: 'Capacitación Parametrización usuarios' },
        { id: 'tpm3', name: 'Capacitación ventas' }, { id: 'tpm4', name: 'Capacitación Inventario' }, { id: 'tpm5', name: 'Capacitación Caja' },
        { id: 'tpm6', name: 'Capacitación Descarga folio' }, { id: 'tpm7', name: 'Capacitación Envío DTE' }, { id: 'tpm8', name: 'Capacitación Envío Boleta' },
        { id: 'tpm9', name: 'Cierre de Caja' }, { id: 'tpm10', name: 'Capacitación Comparativa DTE con Sistema Denarium' }
    ],
    trainingTopicsGeneral: [
        { id: 'tge1', name: 'Uso Básico del Sistema' }, { id: 'tge2', name: 'Gestión de Ventas' }, { id: 'tge3', name: 'Inventario y Stock' },
        { id: 'tge4', name: 'Facturación Electrónica' }, { id: 'tge5', name: 'Gestión de Clientes' }, { id: 'tge6', name: 'Gestión de Proveedores' },
        { id: 'tge7', name: 'Generación de Reportes' }
    ],
     trainingTopicsEcommerce: [
        { id: 'eco1', name: 'Configuración de Pasarelas de Pago' },
        { id: 'eco2', name: 'Carga Masiva de Productos' },
        { id: 'eco3', name: 'Gestión de Órdenes y Envíos' },
    ],
    trainingTopicsAppPedido: [
        { id: 'app1', name: 'Configuración de la App' },
        { id: 'app2', name: 'Gestión de Menú Digital' },
        { id: 'app3', name: 'Reportes de Ventas Móviles' },
    ],
    trainingTopicsKOS: [
        { id: 'kos1', name: 'Gestión de Fichas de Pacientes' },
        { id: 'kos2', name: 'Facturación de Prestaciones' },
        { id: 'kos3', name: 'Gestión de Agendas Médicas' },
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

const useAppData = (): { data: AppData | null, loading: boolean } => {
    const [data, setData] = useState<AppData | null>(null);
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

export default useAppData;