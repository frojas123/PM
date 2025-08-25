
import React, { useMemo, useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Client, Training } from '../types';
import KosEditModal from './KosEditModal';

const Kos: React.FC = () => {
    const { data } = useAppContext();
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);


    const kosClients = useMemo(() => {
        return data.clients.filter(c => c.kosDetails);
    }, [data.clients]);

    const getTrainingsForClient = (clientId: string): Training[] => {
        return data.trainings.filter(t => t.clientId === clientId && t.service === 'KOS');
    };
    
    const handleEdit = (client: Client) => {
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

export default Kos;