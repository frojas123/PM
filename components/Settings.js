import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext.js';
import ConfigOptionEditModal from './ConfigOptionEditModal.js';

const ConfigList = ({ title, items, onEdit, onAdd, onDelete }) => {
    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-light">{title}</h3>
                <button onClick={onAdd} className="bg-accent text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">
                    <i className="fas fa-plus mr-2"></i> Añadir Nuevo
                </button>
            </div>
            <div className="bg-primary rounded-lg shadow-inner">
                <ul className="divide-y divide-slate-700">
                    {items.map(item => (
                        <li key={item.id} className="p-4 flex justify-between items-center hover:bg-slate-700/50 transition-colors">
                            <div>
                                <p className="font-medium text-light">{item.name}</p>
                                {item.description && <p className="text-xs text-slate-400 mt-1">{item.description}</p>}
                            </div>
                            <div className="flex gap-2">
                                <button onClick={() => onEdit(item)} className="text-slate-400 hover:text-accent transition-colors p-1" aria-label={`Editar ${item.name}`}><i className="fas fa-edit"></i></button>
                                <button onClick={() => onDelete(item)} className="text-slate-400 hover:text-red-500 transition-colors p-1" aria-label={`Eliminar ${item.name}`}><i className="fas fa-trash"></i></button>
                            </div>
                        </li>
                    ))}
                </ul>
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
        { id: 'statuses', label: 'Estados Cliente' }, { id: 'industries', label: 'Rubros' },
        { id: 'connections', label: 'Tipos Conexión' }, { id: 'contracts', label: 'Tipos Contrato' },
        { id: 'emissionModels', label: 'Modelos Emisión' }, { id: 'freezeReasons', label: 'Motivos Congelación' },
        { id: 'topicsPM', label: 'Temas Cap. PM' }, { id: 'topicsGeneral', label: 'Temas Cap. General' },
        { id: 'topicsEcommerce', label: 'Temas Ecommerce' }, { id: 'topicsAppPedido', label: 'Temas App Pedido' },
        { id: 'topicsKOS', label: 'Temas KOS' }, { id: 'modules', label: 'Módulos Sistema' },
        { id: 'users', label: 'Responsables' }, { id: 'checklists', label: 'Checklists' },
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
            case 'statuses': return renderConfigList('clientStatuses', 'Estados de Cliente');
            case 'industries': return renderConfigList('industries', 'Rubros de Clientes');
            case 'connections': return renderConfigList('connectionTypes', 'Tipos de Conexión');
            case 'contracts': return renderConfigList('contractTypes', 'Tipos de Contrato');
            case 'emissionModels': return renderConfigList('emissionModels', 'Modelos de Emisión');
            case 'freezeReasons': return renderConfigList('freezeReasons', 'Motivos de Congelación');
            case 'topicsPM': return renderConfigList('trainingTopicsPM', 'Temas Cap. PM');
            case 'topicsGeneral': return renderConfigList('trainingTopicsGeneral', 'Temas Cap. General');
            case 'topicsEcommerce': return renderConfigList('trainingTopicsEcommerce', 'Temas Ecommerce');
            case 'topicsAppPedido': return renderConfigList('trainingTopicsAppPedido', 'Temas App Pedido');
            case 'topicsKOS': return renderConfigList('trainingTopicsKOS', 'Temas KOS');
            case 'modules': return renderConfigList('systemModules', 'Módulos del Sistema');
            case 'users': return renderConfigList('users', 'Responsables / Usuarios');
            case 'checklists': return <ChecklistConfig items={data.settings.checklistData} onUpdate={(val) => updateSettings({ ...data.settings, checklistData: val })} />;
            default: return null;
        }
    };

    return (
        <>
            <div className="bg-secondary p-4 md:p-6 rounded-lg shadow-lg animate-fade-in">
                <h2 className="text-2xl font-bold text-light mb-6 border-b border-primary pb-4">Configuración del Sistema</h2>
                <div className="flex flex-col md:flex-row gap-8">
                    <aside className="w-full md:w-1/4 lg:w-1/5">
                        <nav className="flex flex-col space-y-2">
                            {tabs.map(tab => (
                                 <button 
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`px-4 py-2.5 text-left font-semibold text-sm rounded-lg transition-colors ${activeTab === tab.id ? 'bg-accent text-white shadow-md' : 'text-slate-300 hover:bg-primary hover:text-light'}`}
                                >
                                    {tab.label}
                                </button>
                            ))}
                        </nav>
                    </aside>
                    <main className="w-full md:w-3/4 lg:w-4/5">
                        {renderContent()}
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