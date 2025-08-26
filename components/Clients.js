
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import ClientDetailModal from './ClientDetailModal.js';
import ClientEditModal from './ClientEditModal.js';
import GeneralAnalysisModal from './GeneralAnalysisModal.js';

const getStatusColor = (status) => {
    switch (status) {
        case 'Activo': return 'bg-green-500';
        case 'Implementación': return 'bg-yellow-500';
        case 'En Pausa': return 'bg-orange-500';
        case 'Inactivo': return 'bg-red-500';
        default: return 'bg-gray-500';
    }
};

const Clients = () => {
    const { data, saveClient } = useAppContext();
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [industryFilter, setIndustryFilter] = useState('all');

    const [isDetailModalOpen, setDetailModalOpen] = useState(false);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [isAnalysisModalOpen, setAnalysisModalOpen] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);

    const industries = useMemo(() => {
        if (!data) return [];
        return [...new Set(data.clients.map(c => c.industry))];
    }, [data]);

    const filteredClients = useMemo(() => {
        if (!data) return [];
        return data.clients.filter(client => {
            const matchesSearch = client.fantasyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                  client.legalName.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
            const matchesIndustry = industryFilter === 'all' || client.industry === industryFilter;
            return matchesSearch && matchesStatus && matchesIndustry;
        });
    }, [data, searchTerm, statusFilter, industryFilter]);
    
    const handleViewDetails = (client) => {
        setSelectedClient(client);
        setDetailModalOpen(true);
    };

    const handleEdit = (client) => {
        setSelectedClient(client);
        setEditModalOpen(true);
    };

    const handleAddNew = () => {
        setSelectedClient(null);
        setEditModalOpen(true);
    };

    const handleSaveClient = (client) => {
        saveClient(client);
        setEditModalOpen(false);
    };


    const calculateDaysInImplementation = (client) => {
        if (client.actualGoLiveDate) {
             const start = new Date(client.registrationDate);
             const end = new Date(client.actualGoLiveDate);
             return Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }
        if(client.status === 'Implementación') {
            const start = new Date(client.registrationDate);
            const now = new Date();
            return Math.round((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
        }
        return 'N/A';
    };

    return (
        <>
            <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in h-full flex flex-col">
                <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
                    <div className="relative w-full md:w-1/3">
                        <input
                            type="text"
                            placeholder="Buscar cliente..."
                            className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-4 text-light focus:outline-none focus:ring-2 focus:ring-accent"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"></i>
                    </div>
                    <div className="flex items-center gap-4 w-full md:w-auto flex-wrap">
                        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="bg-primary border border-slate-600 rounded-lg py-2 px-4 text-light focus:outline-none focus:ring-2 focus:ring-accent">
                            <option value="all">Todos los Estados</option>
                            <option value="Activo">Activo</option>
                            <option value="Implementación">Implementación</option>
                            <option value="En Pausa">En Pausa</option>
                            <option value="Inactivo">Inactivo</option>
                        </select>
                         <select value={industryFilter} onChange={e => setIndustryFilter(e.target.value)} className="bg-primary border border-slate-600 rounded-lg py-2 px-4 text-light focus:outline-none focus:ring-2 focus:ring-accent">
                            <option value="all">Todos los Rubros</option>
                            {industries.map(industry => <option key={industry} value={industry}>{industry}</option>)}
                        </select>
                         <button onClick={() => setAnalysisModalOpen(true)} className="bg-secondary text-accent border border-accent font-bold py-2 px-4 rounded-lg hover:bg-accent hover:text-white transition-colors shadow-md flex-shrink-0">
                            <i className="fas fa-magic mr-2"></i> Análisis General IA
                        </button>
                        <button onClick={handleAddNew} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors shadow-md flex-shrink-0">
                            <i className="fas fa-plus mr-2"></i> Nuevo Cliente
                        </button>
                    </div>
                </div>
                
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-300">
                        <thead className="bg-primary text-xs text-slate-400 uppercase tracking-wider">
                            <tr>
                                <th className="p-3">Nombre Fantasía</th>
                                <th className="p-3">Correo Cliente</th>
                                <th className="p-3">Estado</th>
                                <th className="p-3">Días en P.M.</th>
                                <th className="p-3">Salida Producción</th>
                                <th className="p-3 text-center">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-700">
                           {filteredClients.map(client => (
                                <tr key={client.id} className="hover:bg-primary transition-colors">
                                    <td className="p-3 font-medium text-light">{client.fantasyName}</td>
                                    <td className="p-3">{client.clientEmail}</td>
                                    <td className="p-3">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full text-white ${getStatusColor(client.status)}`}>
                                            {client.status}
                                        </span>
                                    </td>
                                    <td className="p-3">{calculateDaysInImplementation(client)}</td>
                                    <td className="p-3">{client.actualGoLiveDate ? new Date(client.actualGoLiveDate).toLocaleDateString() : 'Pendiente'}</td>
                                    <td className="p-3 text-center">
                                        <button onClick={() => handleViewDetails(client)} className="text-accent hover:text-light transition-colors p-1" aria-label={`Ver detalles de ${client.fantasyName}`}><i className="fas fa-eye"></i></button>
                                        <button onClick={() => handleEdit(client)} className="text-accent hover:text-light transition-colors p-1 ml-2" aria-label={`Editar ${client.fantasyName}`}><i className="fas fa-edit"></i></button>
                                        <button className="text-accent hover:text-light transition-colors p-1 ml-2" aria-label="Más opciones"><i className="fas fa-ellipsis-h"></i></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                     {filteredClients.length === 0 && (
                        <div className="text-center py-10 text-slate-400">
                            <p>No se encontraron clientes con los filtros actuales.</p>
                        </div>
                    )}
                </div>
            </div>
            {isDetailModalOpen && selectedClient && (
                <ClientDetailModal 
                    isOpen={isDetailModalOpen} 
                    onClose={() => setDetailModalOpen(false)}
                    client={selectedClient}
                />
            )}
             {isEditModalOpen && (
                <ClientEditModal 
                    isOpen={isEditModalOpen}
                    onClose={() => setEditModalOpen(false)}
                    clientToEdit={selectedClient}
                    onSave={handleSaveClient}
                />
            )}
             {isAnalysisModalOpen && (
                <GeneralAnalysisModal
                    isOpen={isAnalysisModalOpen}
                    onClose={() => setAnalysisModalOpen(false)}
                />
            )}
        </>
    );
};

export default Clients;