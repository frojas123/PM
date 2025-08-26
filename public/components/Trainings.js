
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import TrainingEditModal from './TrainingEditModal.js';

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

export default Trainings;