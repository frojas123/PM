
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import TrainingEditModal from './TrainingEditModal.js';

const getStatusInfo = (status) => {
    switch (status) {
        case 'AGENDADA': return { color: 'border-l-yellow-400', icon: 'fa-calendar-check' };
        case 'EN PROCESO': return { color: 'border-l-blue-500', icon: 'fa-spinner fa-spin' };
        case 'REAGENDADA': return { color: 'border-l-orange-500', icon: 'fa-history' };
        case 'CANCELADA': return { color: 'border-l-red-500', icon: 'fa-times-circle' };
        case 'COMPLETADA': return { color: 'border-l-green-500', icon: 'fa-check-circle' };
        default: return { color: 'border-l-gray-500', icon: 'fa-question-circle' };
    }
};

const TrainingCard = ({ training, onEdit }) => {
    const { color, icon } = getStatusInfo(training.status);
    const trainingDate = new Date(training.dateTime);

    return (
        <div 
            onClick={() => onEdit(training)}
            className={`bg-secondary p-4 rounded-lg shadow-md border-l-4 ${color} flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:shadow-xl hover:bg-slate-700 transition-all cursor-pointer`}
            role="button"
            aria-label={`Editar capacitación: ${training.topic}`}
        >
            <div className="flex-1">
                <p className="text-xs text-slate-400">{training.clientFantasyName}</p>
                <h4 className="text-lg font-bold text-light">{training.topic}</h4>
                <div className="flex items-center text-sm text-slate-300 mt-2 gap-4 flex-wrap">
                    <span><i className="fas fa-user mr-2 text-accent"></i>{training.responsible}</span>
                    <span className="font-bold"><i className={`fas fa-tag mr-2 text-accent`}></i>{training.service}</span>
                    <span><i className="fas fa-clock mr-2 text-accent"></i>{training.duration} min</span>
                </div>
            </div>
            <div className="text-right w-full sm:w-auto">
                <p className="font-semibold text-light">{trainingDate.toLocaleDateString()}</p>
                <p className="text-sm text-slate-400">{trainingDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <span className="text-xs font-bold mt-2 inline-flex items-center gap-2"><i className={`fas ${icon}`}></i> {training.status}</span>
            </div>
        </div>
    );
};

const Trainings = () => {
    const { data, saveTraining } = useAppContext();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedTraining, setSelectedTraining] = useState(null);

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
    
    const upcomingTrainings = data.trainings
        .filter(t => new Date(t.dateTime) >= new Date() && (t.status === 'AGENDADA' || t.status === 'REAGENDADA'))
        .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());

    const pastTrainings = data.trainings
        .filter(t => new Date(t.dateTime) < new Date() || (t.status !== 'AGENDADA' && t.status !== 'REAGENDADA'))
        .sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime());

    return (
        <>
            <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-light">Capacitaciones</h2>
                    <button onClick={handleAddNew} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors shadow-md">
                        <i className="fas fa-plus mr-2"></i> Programar
                    </button>
                </div>
                
                <div>
                    <h3 className="text-xl font-semibold text-light mb-4 border-b-2 border-secondary pb-2">Próximas</h3>
                    <div className="space-y-4">
                        {upcomingTrainings.length > 0 ? (
                            upcomingTrainings.map(t => <TrainingCard key={t.id} training={t} onEdit={handleEdit} />)
                        ) : (
                            <p className="text-slate-400 text-center py-4">No hay capacitaciones programadas.</p>
                        )}
                    </div>
                </div>

                <div className="mt-10">
                    <h3 className="text-xl font-semibold text-light mb-4 border-b-2 border-secondary pb-2">Historial</h3>
                    <div className="space-y-4">
                         {pastTrainings.length > 0 ? (
                            pastTrainings.slice(0, 10).map(t => <TrainingCard key={t.id} training={t} onEdit={handleEdit} />) // show last 10
                        ) : (
                            <p className="text-slate-400 text-center py-4">No hay historial de capacitaciones.</p>
                        )}
                    </div>
                </div>
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