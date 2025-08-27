// Utilidades para manejar estados y colores

export const getStatusColor = (status, settings) => {
    // Si se proporcionan settings, buscar el color en la configuración
    if (settings?.trainingStatuses) {
        const statusConfig = settings.trainingStatuses.find(s => s.name === status);
        if (statusConfig) return statusConfig.color;
    }
    
    // Colores por defecto para estados comunes
    switch (status) {
        case 'Completado':
        case 'Activo':
            return 'bg-green-500';
        case 'Pendiente':
            return 'bg-yellow-500';
        case 'Cancelado':
            return 'bg-red-500';
        default:
            return 'bg-gray-500';
    }
};

export const getStatusTextColor = (status, settings) => {
    const statusConfig = settings?.trainingStatuses?.find(s => s.name === status);
    return statusConfig ? statusConfig.textColor : 'text-white';
};