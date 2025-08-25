
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Client } from '../types';

const ChecklistDetailView: React.FC<{ client: Client; onBack: () => void; }> = ({ client, onBack }) => {
    const { data, updateChecklistState } = useAppContext();
    const checklistData = data.settings.checklistData || [];
    const [openAccordion, setOpenAccordion] = useState<string | null>('tecnico');

    const handleAccordionClick = (accordionId: string) => {
        setOpenAccordion(openAccordion === accordionId ? null : accordionId);
    };
    
    const handleCheckboxChange = (category: string, itemId: string, isChecked: boolean) => {
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
                                            <span className="text-slate-300">{item.label}</span>
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


const Checklists: React.FC = () => {
    const { data } = useAppContext();
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [searchTerm, setSearchTerm] = useState('');

    const totalChecklistItems = useMemo(() => {
        return data.settings.checklistData.reduce((acc, category) => acc + category.items.length, 0) || 0;
    }, [data.settings.checklistData]);

    const filteredClients = useMemo(() => {
        return data.clients.filter(client =>
            client.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            client.legalName.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data.clients, searchTerm]);

    const calculateOverallProgress = (client: Client) => {
        if (totalChecklistItems === 0) return 0;
        const completedCount = Object.values(client.checklistState).reduce((acc, items) => acc + items.length, 0);
        return (completedCount / totalChecklistItems) * 100;
    };
    
    if (selectedClient) {
        // Find the latest version of the client from the context to pass to the detail view
        const currentClient = data.clients.find(c => c.id === selectedClient.id) || selectedClient;
        return <ChecklistDetailView client={currentClient} onBack={() => setSelectedClient(null)} />;
    }

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in h-full flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-light">Progreso de Implementación</h2>
                <div className="relative w-1/3">
                    <input
                        type="text"
                        placeholder="Buscar cliente..."
                        className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-4 text-light focus:outline-none focus:ring-2 focus:ring-accent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                </div>
            </div>
            
            <div className="flex-1 overflow-y-auto">
                {filteredClients.map(client => {
                    const progress = calculateOverallProgress(client);
                    return (
                        <div key={client.id} onClick={() => setSelectedClient(client)} className="bg-primary p-4 rounded-lg mb-3 flex items-center justify-between cursor-pointer hover:bg-slate-700 transition-colors">
                            <div className="flex-1 pr-4">
                                <h3 className="font-bold text-light">{client.fantasyName}</h3>
                                <p className="text-sm text-slate-400">{client.legalName}</p>
                            </div>
                            <div className="w-1/3">
                                <div className="flex justify-between mb-1">
                                    <span className="text-sm font-medium text-slate-300">Progreso</span>
                                    <span className="text-sm font-medium text-light">{Math.round(progress)}%</span>
                                </div>
                                <div className="w-full bg-secondary rounded-full h-2.5">
                                    <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                </div>
                            </div>
                        </div>
                    );
                })}
                 {filteredClients.length === 0 && (
                    <div className="text-center py-10 text-slate-400">
                        <p>No se encontraron clientes.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Checklists;
