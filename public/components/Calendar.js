
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import { getStatusColor, getStatusTextColor } from '../utils/StatusUtils.js';

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

export default Calendar;