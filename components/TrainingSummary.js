import React from 'react';
import { useAppContext } from '../contexts/AppContext.js';

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

export default TrainingSummary;