import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import ConfigOptionEditModal from './ConfigOptionEditModal.js';

const ConfigList = ({ title, items, onEdit, onAdd, onDelete }) => {
    return (
        <div className="bg-primary/50 rounded-xl p-6 border border-slate-700/50">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-light flex items-center">
                    <i className="fas fa-cog mr-2 text-accent"></i>
                    {title}
                </h3>
                <button onClick={onAdd} className="bg-accent hover:bg-blue-600 text-white text-sm font-bold py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-105">
                    <i className="fas fa-plus mr-2"></i> Añadir Nuevo
                </button>
            </div>
            <div className="space-y-3">
                {items.map(item => (
                    <div key={item.id} className="bg-secondary/30 rounded-lg p-4 flex justify-between items-center hover:bg-secondary/50 transition-all duration-200 border border-slate-600/30">
                        <div className="flex-1">
                            <p className="font-semibold text-light text-base">{item.name}</p>
                            {item.description && <p className="text-sm text-slate-400 mt-1">{item.description}</p>}
                        </div>
                        <div className="flex gap-2 ml-4">
                            <button onClick={() => onEdit(item)} className="bg-slate-700/50 hover:bg-accent text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-200" aria-label={`Editar ${item.name}`}>
                                <i className="fas fa-edit"></i>
                            </button>
                            <button onClick={() => onDelete(item)} className="bg-slate-700/50 hover:bg-red-500 text-slate-300 hover:text-white p-2 rounded-lg transition-all duration-200" aria-label={`Eliminar ${item.name}`}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
                {items.length === 0 && (
                    <div className="text-center py-8 text-slate-400">
                        <i className="fas fa-inbox text-4xl mb-3 opacity-50"></i>
                        <p>No hay elementos configurados</p>
                    </div>
                )}
            </div>
        </div>
    );
};

const ChecklistConfig = ({ items, onUpdate }) => {
    // NOTE: Checklist editing still uses prompts for simplicity, could be upgraded to modals.
    const handleEditCategoryTitle = (categoryId, currentTitle) => {
        const newTitle = prompt("Nuevo título para la categoría:", currentTitle);
        if (newTitle) {
            onUpdate(items.map(cat => cat.id === categoryId ? { ...cat, title: newTitle } : cat));
        }
    };

    const handleEditItemLabel = (categoryId, itemId, currentLabel) => {
        const newLabel = prompt("Nuevo texto para la tarea:", currentLabel);
        if (newLabel) {
            onUpdate(items.map(cat => {
                if (cat.id === categoryId) {
                    return { ...cat, items: cat.items.map(it => it.id === itemId ? { ...it, label: newLabel } : it) };
                }
                return cat;
            }));
        }
    };
    
    return (
        <div className="space-y-4">
            <h3 className="text-xl font-semibold text-light">Parámetros del Checklist</h3>
            {items.map(category => (
                <div key={category.id} className="bg-primary p-4 rounded-lg shadow-inner">
                    <div className="flex justify-between items-center mb-3">
                         <h4 className="text-md font-bold text-accent">{category.title}</h4>
                         <div>
                            <button onClick={() => handleEditCategoryTitle(category.id, category.title)} className="text-slate-400 hover:text-accent transition-colors p-1 ml-2" aria-label={`Editar ${category.title}`}><i className="fas fa-edit"></i></button>
                         </div>
                    </div>
                    <ul className="divide-y divide-slate-700/50">
                        {category.items.map(item => (
                            <li key={item.id} className="py-2 px-2 flex justify-between items-center hover:bg-slate-700/50 rounded-md">
                                <p className="text-sm text-light">{item.label}</p>
                                <div className="flex gap-2">
                                    <button onClick={() => handleEditItemLabel(category.id, item.id, item.label)} className="text-slate-500 hover:text-accent transition-colors p-1" aria-label={`Editar ${item.label}`}><i className="fas fa-edit text-xs"></i></button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

const Settings = () => {
    const { data, updateSettings } = useAppContext();
    const [activeTab, setActiveTab] = useState('statuses');
    
    const [isModalOpen, setModalOpen] = useState(false);
    const [editingOption, setEditingOption] = useState(null);

    const handleOpenModal = (listKey, option = null) => {
        setEditingOption({ listKey, option });
        setModalOpen(true);
    };

    const handleSaveOption = (updatedOption) => {
        if (!editingOption) return;
        const { listKey } = editingOption;
        
        const list = data.settings[listKey];
        let updatedList;

        if (updatedOption.id.startsWith('new_')) {
            // It's a new item
            updatedList = [...list, { ...updatedOption, id: `opt_${Date.now()}` }];
        } else {
            // It's an existing item
            updatedList = list.map(item => item.id === updatedOption.id ? updatedOption : item);
        }

        const newSettings = { ...data.settings, [listKey]: updatedList };
        updateSettings(newSettings);
        setModalOpen(false);
        setEditingOption(null);
    };

    const handleDeleteOption = (listKey, optionToDelete) => {
         if (window.confirm(`¿Seguro que quieres eliminar "${optionToDelete.name}"?`)) {
            const list = data.settings[listKey];
            const updatedList = list.filter(item => item.id !== optionToDelete.id);
            const newSettings = { ...data.settings, [listKey]: updatedList };
            updateSettings(newSettings);
        }
    }

    const tabs = [
        { id: 'statuses', label: 'Estados Cliente' },
        { id: 'trainingTypes', label: 'Tipos Capacitación' },
        { id: 'trainingServices', label: 'Servicios Cap.' },
        { id: 'trainingTopics', label: 'Temas Capacitación' },
        { id: 'trainingStatuses', label: 'Estados Cap.' },
        { id: 'trainingPriorities', label: 'Prioridades Cap.' },
    ];
    
    const renderConfigList = (listKey, title) => {
        const items = data.settings[listKey];
        return (
            <ConfigList 
                title={title}
                items={items}
                onAdd={() => handleOpenModal(listKey, null)}
                onEdit={(option) => handleOpenModal(listKey, option)}
                onDelete={(option) => handleDeleteOption(listKey, option)}
            />
        );
    };

    const renderContent = () => {
        switch (activeTab) {
            case 'statuses': return (
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                        <h3 className="text-lg font-semibold text-blue-300 mb-2">
                            <i className="fas fa-users mr-2"></i>
                            Gestión de Estados de Cliente
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Define los estados posibles para los clientes en el sistema
                        </p>
                    </div>
                    {renderConfigList('clientStatuses', 'Estados de Cliente')}
                </div>
            );
            case 'trainingTypes': return (
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                        <h3 className="text-lg font-semibold text-green-300 mb-2">
                            <i className="fas fa-graduation-cap mr-2"></i>
                            Tipos de Capacitación
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Categoriza los diferentes tipos de capacitación disponibles
                        </p>
                    </div>
                    {renderConfigList('trainingTypes', 'Tipos de Capacitación')}
                </div>
            );
            case 'trainingServices': return (
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg p-4 border border-purple-500/20">
                        <h3 className="text-lg font-semibold text-purple-300 mb-2">
                            <i className="fas fa-cogs mr-2"></i>
                            Servicios de Capacitación
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Define los servicios específicos de capacitación ofrecidos
                        </p>
                    </div>
                    {renderConfigList('trainingServices', 'Servicios de Capacitación')}
                </div>
            );
            case 'trainingTopics': return (
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
                        <h3 className="text-lg font-semibold text-yellow-300 mb-2">
                            <i className="fas fa-book mr-2"></i>
                            Temas de Capacitación
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Lista de temas específicos para las capacitaciones
                        </p>
                    </div>
                    {renderConfigList('trainingTopics', 'Temas de Capacitación')}
                </div>
            );
            case 'trainingStatuses': return (
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-indigo-500/10 to-cyan-500/10 rounded-lg p-4 border border-indigo-500/20">
                        <h3 className="text-lg font-semibold text-indigo-300 mb-2">
                            <i className="fas fa-tasks mr-2"></i>
                            Estados de Capacitación
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Estados del progreso de las capacitaciones
                        </p>
                    </div>
                    {renderConfigList('trainingStatuses', 'Estados de Capacitación')}
                </div>
            );
            case 'trainingPriorities': return (
                <div className="space-y-4">
                    <div className="bg-gradient-to-r from-red-500/10 to-pink-500/10 rounded-lg p-4 border border-red-500/20">
                        <h3 className="text-lg font-semibold text-red-300 mb-2">
                            <i className="fas fa-exclamation-triangle mr-2"></i>
                            Prioridades de Capacitación
                        </h3>
                        <p className="text-sm text-slate-400 mb-4">
                            Niveles de prioridad para las capacitaciones
                        </p>
                    </div>
                    {renderConfigList('trainingPriorities', 'Prioridades de Capacitación')}
                </div>
            );
            default: return null;
        }
    };

    return (
        <>
            <div className="bg-gradient-to-br from-secondary to-primary p-6 md:p-8 rounded-xl shadow-2xl animate-fade-in">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-light mb-2 flex items-center">
                        <i className="fas fa-sliders-h mr-3 text-accent"></i>
                        Configuración de Sistema
                    </h2>
                    <p className="text-slate-400">Gestión de estados y parametrización de capacitaciones</p>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                    <aside className="w-full lg:w-1/4">
                        <nav className="flex flex-col space-y-2 bg-primary/30 rounded-xl p-2">
                            {tabs.map(tab => (
                                 <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-3 text-left font-semibold text-sm rounded-lg transition-all duration-200 ${activeTab === tab.id ? 'bg-accent text-white shadow-lg transform scale-105' : 'text-slate-300 hover:bg-primary/50 hover:text-light hover:pl-6'}`}
                                >
                                    <i className="fas fa-chevron-right mr-2 text-xs"></i>
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="w-full lg:w-3/4">
                        <div className="bg-primary/20 rounded-xl p-6">
                            {renderContent()}
                        </div>
                    </main>
                </div>
            </div>

            {isModalOpen && editingOption && (
                <ConfigOptionEditModal 
                    isOpen={isModalOpen}
                    onClose={() => setModalOpen(false)}
                    optionToEdit={editingOption.option}
                    onSave={handleSaveOption}
                    title={editingOption.option ? 'Editar Opción' : 'Crear Nueva Opción'}
                />
            )}
        </>
    );
};

export default Settings;