// Configuración escalable para el sistema de capacitaciones
// Este archivo permite configurar fácilmente nuevos tipos, servicios y temas de capacitación

export const TRAINING_CONFIG = {
    // Configuración de tipos de capacitación
    types: {
        PM: {
            name: 'PM',
            description: 'Capacitaciones de Project Manager',
            color: 'bg-blue-500',
            defaultDuration: 120,
            icon: 'fa-project-diagram'
        },
        GENERAL: {
            name: 'General',
            description: 'Capacitaciones generales del sistema',
            color: 'bg-green-500',
            defaultDuration: 90,
            icon: 'fa-desktop'
        },
        TECNICO: {
            name: 'Técnico',
            description: 'Capacitaciones técnicas especializadas',
            color: 'bg-purple-500',
            defaultDuration: 180,
            icon: 'fa-cogs'
        },
        SEGUIMIENTO: {
            name: 'Seguimiento',
            description: 'Sesiones de seguimiento post-implementación',
            color: 'bg-orange-500',
            defaultDuration: 60,
            icon: 'fa-chart-line'
        }
    },

    // Configuración de servicios
    services: {
        GENERAL: {
            name: 'General',
            description: 'Servicios generales del sistema',
            icon: 'fa-desktop',
            color: 'text-blue-500'
        },
        ECOMMERCE: {
            name: 'Ecommerce',
            description: 'Servicios de comercio electrónico',
            icon: 'fa-shopping-cart',
            color: 'text-green-500'
        },
        APP_PEDIDO: {
            name: 'App Pedido',
            description: 'Aplicación de pedidos móviles',
            icon: 'fa-mobile-alt',
            color: 'text-purple-500'
        },
        KOS: {
            name: 'KOS',
            description: 'Sistema de gestión clínica',
            icon: 'fa-laptop-medical',
            color: 'text-red-500'
        },
        PM: {
            name: 'PM',
            description: 'Capacitaciones de Project Manager',
            icon: 'fa-project-diagram',
            color: 'text-orange-500'
        }
    },

    // Configuración de estados
    statuses: {
        AGENDADA: {
            name: 'AGENDADA',
            description: 'Capacitación programada',
            color: 'bg-yellow-500',
            textColor: 'text-yellow-100',
            icon: 'fa-calendar-check'
        },
        EN_PROCESO: {
            name: 'EN PROCESO',
            description: 'Capacitación en curso',
            color: 'bg-blue-500',
            textColor: 'text-blue-100',
            icon: 'fa-spinner fa-spin'
        },
        REAGENDADA: {
            name: 'REAGENDADA',
            description: 'Capacitación reprogramada',
            color: 'bg-orange-500',
            textColor: 'text-orange-100',
            icon: 'fa-history'
        },
        CANCELADA: {
            name: 'CANCELADA',
            description: 'Capacitación cancelada',
            color: 'bg-red-500',
            textColor: 'text-red-100',
            icon: 'fa-times-circle'
        },
        COMPLETADA: {
            name: 'COMPLETADA',
            description: 'Capacitación finalizada',
            color: 'bg-green-500',
            textColor: 'text-green-100',
            icon: 'fa-check-circle'
        }
    },

    // Configuración de prioridades
    priorities: {
        ALTA: {
            name: 'Alta',
            description: 'Capacitación crítica',
            color: 'text-red-500',
            weight: 3
        },
        MEDIA: {
            name: 'Media',
            description: 'Capacitación importante',
            color: 'text-yellow-500',
            weight: 2
        },
        BAJA: {
            name: 'Baja',
            description: 'Capacitación opcional',
            color: 'text-green-500',
            weight: 1
        }
    },

    // Plantillas de temas por servicio
    topicTemplates: {
        PM: [
            {
                name: 'Introducción al sistema y parámetros de producto',
                duration: 120,
                priority: 'Alta',
                description: 'Capacitación inicial sobre el sistema y configuración de productos'
            },
            {
                name: 'Capacitación Parametrización usuarios',
                duration: 60,
                priority: 'Media',
                description: 'Configuración de usuarios y permisos del sistema'
            },
            {
                name: 'Capacitación ventas',
                duration: 180,
                priority: 'Alta',
                description: 'Proceso completo de ventas en el sistema'
            },
            {
                name: 'Capacitación Inventario',
                duration: 120,
                priority: 'Alta',
                description: 'Gestión de inventario y control de stock'
            },
            {
                name: 'Capacitación Caja',
                duration: 120,
                priority: 'Alta',
                description: 'Operación de caja y cierre diario'
            }
        ],
        GENERAL: [
            {
                name: 'Uso Básico del Sistema',
                duration: 90,
                priority: 'Alta',
                description: 'Navegación básica y funciones principales'
            },
            {
                name: 'Gestión de Ventas',
                duration: 120,
                priority: 'Alta',
                description: 'Proceso de ventas y facturación'
            },
            {
                name: 'Inventario y Stock',
                duration: 90,
                priority: 'Media',
                description: 'Control de inventario y movimientos de stock'
            }
        ],
        ECOMMERCE: [
            {
                name: 'Configuración de Pasarelas de Pago',
                duration: 90,
                priority: 'Alta',
                description: 'Configuración de métodos de pago online'
            },
            {
                name: 'Carga Masiva de Productos',
                duration: 75,
                priority: 'Media',
                description: 'Importación y gestión masiva de productos'
            }
        ],
        APP_PEDIDO: [
            {
                name: 'Configuración de la App',
                duration: 60,
                priority: 'Alta',
                description: 'Configuración inicial de la aplicación móvil'
            },
            {
                name: 'Gestión de Menú Digital',
                duration: 90,
                priority: 'Media',
                description: 'Administración del menú digital'
            }
        ],
        KOS: [
            {
                name: 'Gestión de Fichas de Pacientes',
                duration: 90,
                priority: 'Alta',
                description: 'Manejo de historias clínicas y fichas de pacientes'
            },
            {
                name: 'Facturación de Prestaciones',
                duration: 120,
                priority: 'Alta',
                description: 'Facturación de servicios médicos'
            }
        ]
    },

    // Configuración de notificaciones
    notifications: {
        reminderDays: [7, 3, 1], // Días antes para recordatorios
        followUpDays: [1, 7, 30], // Días después para seguimiento
        escalationHours: 24 // Horas para escalación si no hay respuesta
    },

    // Configuración de reportes
    reports: {
        defaultPeriods: ['7d', '30d', '90d', '1y'],
        metrics: [
            'totalTrainings',
            'completionRate',
            'averageDuration',
            'clientSatisfaction',
            'trainerEfficiency'
        ]
    }
};

// Funciones utilitarias para trabajar con la configuración
export const getTrainingTypeConfig = (typeName) => {
    return Object.values(TRAINING_CONFIG.types).find(type => type.name === typeName);
};

export const getServiceConfig = (serviceName) => {
    return Object.values(TRAINING_CONFIG.services).find(service => service.name === serviceName);
};

export const getStatusConfig = (statusName) => {
    return Object.values(TRAINING_CONFIG.statuses).find(status => status.name === statusName);
};

export const getPriorityConfig = (priorityName) => {
    return Object.values(TRAINING_CONFIG.priorities).find(priority => priority.name === priorityName);
};

export const getTopicTemplates = (serviceName) => {
    return TRAINING_CONFIG.topicTemplates[serviceName] || [];
};

// Función para generar configuración dinámica basada en los datos existentes
export const generateDynamicConfig = (existingData) => {
    const config = { ...TRAINING_CONFIG };
    
    // Agregar servicios dinámicos basados en datos existentes
    if (existingData?.trainings) {
        const uniqueServices = [...new Set(existingData.trainings.map(t => t.service))];
        uniqueServices.forEach(service => {
            if (!config.services[service.toUpperCase().replace(' ', '_')]) {
                config.services[service.toUpperCase().replace(' ', '_')] = {
                    name: service,
                    description: `Servicio ${service}`,
                    icon: 'fa-cog',
                    color: 'text-gray-500'
                };
            }
        });
    }
    
    return config;
};

export default TRAINING_CONFIG;