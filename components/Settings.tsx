
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { ConfigOption, ChecklistCategory, SettingsData } from '../types';
import Modal from './shared/Modal';

type SettingsTab = 'statuses' | 'industries' | 'connections' | 'contracts' | 'emissionModels' | 'freezeReasons' | 'topicsPM' | 'topicsGeneral' | 'topicsEcommerce' | 'topicsAppPedido' | 'topicsKOS' | 'modules' | 'users' | 'checklists';

const ConfigList: React.FC<{
    title: string;
    items: ConfigOption[];
    onUpdate: (items: ConfigOption[]) => void;
}> = ({ title, items, onUpdate }) => {
    const handleAddItem = () => {
        const name = prompt(`Nuevo nombre para ${title}:`);
        if (name) {
            const newItem: ConfigOption = { id: `new_${Date.now()}`, name };
            onUpdate([...items, newItem]);
        }
    };

    const handleEditItem = (itemToEdit: ConfigOption) => {
        const newName = prompt("Nuevo nombre:", itemToEdit.name);
        if (newName) {
            onUpdate(items.map(item => item.id === itemToEdit.id ? { ...item, name: newName } : item));
        }
    };

    const handleDeleteItem = (itemToDelete: ConfigOption) => {
        if (window.confirm(`¿Seguro que quieres eliminar "${itemToDelete.name}"?`)) {
            onUpdate(items.filter(item => item.id !== itemToDelete.id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-light">{title}</h3>
                <button onClick={handleAddItem} className="bg-accent text-white text-sm font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">
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
                                <button onClick={() => handleEditItem(item)} className="text-slate-400 hover:text-accent transition-colors p-1" aria-label={`Editar ${item.name}`}><i className="fas fa-edit"></i></button>
                                <button onClick={() => handleDeleteItem(item)} className="text-slate-400 hover:text-red-500 transition-colors p-1" aria-label={`Eliminar ${item.name}`}><i className="fas fa-trash"></i></button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

const ChecklistConfig: React.FC<{ 
    items: ChecklistCategory[];
    onUpdate: (items: ChecklistCategory[]) => void;
}> = ({ items, onUpdate }) => {
    // This is a simplified version. A real implementation might use modals for editing.
    const handleEditCategoryTitle = (categoryId: string, currentTitle: string) => {
        const newTitle = prompt("Nuevo título para la categoría:", currentTitle);
        if (newTitle) {
            onUpdate(items.map(cat => cat.id === categoryId ? { ...cat, title: newTitle } : cat));
        }
    };

    const handleEditItemLabel = (categoryId: string, itemId: string, currentLabel: string) => {
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

const Settings: React.FC = () => {
    const { data, updateSettings } = useAppContext();
    const [activeTab, setActiveTab] = useState<SettingsTab>('statuses');
    
    const handleUpdate = (key: keyof SettingsData, value: any) => {
        const newSettings = { ...data.settings, [key]: value };
        updateSettings(newSettings);
    };

    const tabs: { id: SettingsTab; label: string }[] = [
        { id: 'statuses', label: 'Estados Cliente' }, { id: 'industries', label: 'Rubros' },
        { id: 'connections', label: 'Tipos Conexión' }, { id: 'contracts', label: 'Tipos Contrato' },
        { id: 'emissionModels', label: 'Modelos Emisión' }, { id: 'freezeReasons', label: 'Motivos Congelación' },
        { id: 'topicsPM', label: 'Temas Cap. PM' }, { id: 'topicsGeneral', label: 'Temas Cap. General' },
        { id: 'topicsEcommerce', label: 'Temas Ecommerce' }, { id: 'topicsAppPedido', label: 'Temas App Pedido' },
        { id: 'topicsKOS', label: 'Temas KOS' }, { id: 'modules', label: 'Módulos Sistema' },
        { id: 'users', label: 'Responsables' }, { id: 'checklists', label: 'Checklists' },
    ];

    const renderContent = () => {
        const { settings } = data;
        switch (activeTab) {
            case 'statuses': return <ConfigList title="Estados de Cliente" items={settings.clientStatuses} onUpdate={(val) => handleUpdate('clientStatuses', val)} />;
            case 'industries': return <ConfigList title="Rubros de Clientes" items={settings.industries} onUpdate={(val) => handleUpdate('industries', val)} />;
            case 'connections': return <ConfigList title="Tipos de Conexión" items={settings.connectionTypes} onUpdate={(val) => handleUpdate('connectionTypes', val)} />;
            case 'contracts': return <ConfigList title="Tipos de Contrato" items={settings.contractTypes} onUpdate={(val) => handleUpdate('contractTypes', val)} />;
            case 'emissionModels': return <ConfigList title="Modelos de Emisión" items={settings.emissionModels} onUpdate={(val) => handleUpdate('emissionModels', val)} />;
            case 'freezeReasons': return <ConfigList title="Motivos de Congelación" items={settings.freezeReasons} onUpdate={(val) => handleUpdate('freezeReasons', val)} />;
            case 'topicsPM': return <ConfigList title="Temas Cap. PM" items={settings.trainingTopicsPM} onUpdate={(val) => handleUpdate('trainingTopicsPM', val)} />;
            case 'topicsGeneral': return <ConfigList title="Temas Cap. General" items={settings.trainingTopicsGeneral} onUpdate={(val) => handleUpdate('trainingTopicsGeneral', val)} />;
            case 'topicsEcommerce': return <ConfigList title="Temas Ecommerce" items={settings.trainingTopicsEcommerce} onUpdate={(val) => handleUpdate('trainingTopicsEcommerce', val)} />;
            case 'topicsAppPedido': return <ConfigList title="Temas App Pedido" items={settings.trainingTopicsAppPedido} onUpdate={(val) => handleUpdate('trainingTopicsAppPedido', val)} />;
            case 'topicsKOS': return <ConfigList title="Temas KOS" items={settings.trainingTopicsKOS} onUpdate={(val) => handleUpdate('trainingTopicsKOS', val)} />;
            case 'modules': return <ConfigList title="Módulos del Sistema" items={settings.systemModules} onUpdate={(val) => handleUpdate('systemModules', val)} />;
            case 'users': return <ConfigList title="Responsables / Usuarios" items={settings.users} onUpdate={(val) => handleUpdate('users', val)} />;
            case 'checklists': return <ChecklistConfig items={settings.checklistData} onUpdate={(val) => handleUpdate('checklistData', val)} />;
            default: return null;
        }
    };

    return (
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
    );
};

export default Settings;
