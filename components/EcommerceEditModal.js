import React, { useState, useEffect } from 'react';
import Modal from './shared/Modal.js';
import { useAppContext } from '../contexts/AppContext.js';

const FormInput = ({ label, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormSelect = ({ label, children, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent">
            {children}
        </select>
    </div>
);

const EcommerceEditModal = ({ isOpen, onClose, client }) => {
    const { saveEcommerceDetails } = useAppContext();
    const [formData, setFormData] = useState(client.ecommerceDetails);

    useEffect(() => {
        if (isOpen && client.ecommerceDetails) {
            setFormData(client.ecommerceDetails);
        }
    }, [client, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        saveEcommerceDetails(client.id, formData);
        onClose();
    };

    if (!formData) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Editar Ecommerce: ${client.fantasyName}`}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar Cambios</button>
                </>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput label="Host / Plataforma" name="host" value={formData.host} onChange={handleChange} />
                <FormSelect label="Estado Configuración" name="configStatus" value={formData.configStatus} onChange={handleChange}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Progreso">En Progreso</option>
                    <option value="Completado">Completado</option>
                </FormSelect>
                <FormInput label="URL Tienda" name="url" value={formData.url} onChange={handleChange} className="md:col-span-2" />
                <FormSelect label="Estado Hosting" name="hostingStatus" value={formData.hostingStatus} onChange={handleChange}>
                    <option value="Pendiente">Pendiente</option>
                    <option value="Contratado">Contratado</option>
                    <option value="Activo">Activo</option>
                </FormSelect>
                <FormSelect label="Hosting Administrado Por" name="hostingManagedBy" value={formData.hostingManagedBy} onChange={handleChange}>
                    <option value="Cliente">Cliente</option>
                    <option value="Nosotros">Nosotros</option>
                </FormSelect>
            </div>
        </Modal>
    );
};

export default EcommerceEditModal;