
export interface EcommerceDetails {
    host: string;
    configStatus: 'Pendiente' | 'En Progreso' | 'Completado';
    url: string;
    hostingStatus: 'Pendiente' | 'Contratado' | 'Activo';
    hostingManagedBy: 'Cliente' | 'Nosotros';
}

export interface AppPedidoDetails {
    licenses: number;
    imeis: string[];
}

export interface KosDetails {
    specialty: string; // e.g., 'Odontología', 'Medicina General'
    licenses: number;
}


export interface Client {
    id: string;
    legalName: string; // Razón Social
    fantasyName: string; // Nombre de Fantasía
    status: 'Activo' | 'Inactivo' | 'En Pausa' | 'Implementación'; // Estado del Cliente
    industry: string; // Rubro
    connectionType: string; // Tipo de Conexión
    contractType: string; // Tipo de Contrato
    registrationDate: string; // Fecha de Registro
    expectedGoLiveDate: string; // Salida a Producción Esperada
    actualGoLiveDate: string | null; // Salida a Producción Real
    licenses: number; // Licencias
    databaseName: string; // Nombre Base Datos
    emissionModel: string; // Modelo de Emisión
    observations: string; // Observaciones
    clientEmail: string; // Correo Cliente
    email2: string; // Correo 2
    email3: string; // Correo 3
    asanaLink: string; // Link Asana
    crmLink: string; // Link CRM
    freezeDate: string | null; // Fecha de Congelación
    freezeReason: string | null; // Motivo de Congelación
    freezeDetails: string | null; // Detalles adicionales
    checklistState: { [key: string]: string[] }; // e.g., { tecnico: ['tec_01', 'tec_02'], pm: ['pm_01'] }
    ecommerceDetails?: EcommerceDetails;
    appPedidoDetails?: AppPedidoDetails;
    kosDetails?: KosDetails;
}

export type TrainingStatus = 'AGENDADA' | 'EN PROCESO' | 'REAGENDADA' | 'CANCELADA' | 'COMPLETADA';

export type TrainingService = 'General' | 'Ecommerce' | 'App Pedido' | 'KOS';

export interface Training {
    id: string;
    clientId: string;
    clientFantasyName: string;
    type: 'PM' | 'General'; // Tipo de Capacitación
    service: TrainingService;
    topic: string; // Tema
    responsible: string; // Responsable
    dateTime: string; // Fecha y Hora
    duration: number; // in minutes
    notes: string; // Observaciones
    status: TrainingStatus; // Estado
}

export interface DashboardStats {
    totalClients: number;
    activeClients: number;
    pendingInstallations: number;
    trainingsThisMonth: number;
    clientsByStatus: { name: string; value: number }[];
    clientsByIndustry: { name: string; value: number }[];
}

export interface ConfigOption {
    id: string;
    name: string;
    description?: string;
}

export interface ChecklistItem {
    id: string;
    label: string;
}

export interface ChecklistCategory {
    id: string;
    title: string;
    items: ChecklistItem[];
}

export interface SettingsData {
    clientStatuses: ConfigOption[];
    industries: ConfigOption[];
    connectionTypes: ConfigOption[];
    contractTypes: ConfigOption[];
    emissionModels: ConfigOption[];
    freezeReasons: ConfigOption[];
    trainingTopicsPM: ConfigOption[];
    trainingTopicsGeneral: ConfigOption[];
    trainingTopicsEcommerce: ConfigOption[];
    trainingTopicsAppPedido: ConfigOption[];
    trainingTopicsKOS: ConfigOption[];
    systemModules: ConfigOption[];
    users: ConfigOption[]; // Responsables
    checklistData: ChecklistCategory[];
}


export interface AppData {
    clients: Client[];
    trainings: Training[];
    dashboardStats: DashboardStats;
    settings: SettingsData;
}