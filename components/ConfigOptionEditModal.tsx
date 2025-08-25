import React, { useState, useEffect } from 'react';
import { ConfigOption } from '../types';
import Modal from './shared/Modal';

interface ConfigOptionEditModalProps {
    isOpen: boolean;
    onClose: () => void;
    optionToEdit: ConfigOption | null;
    onSave: (option: ConfigOption) => void;
    title: string;
}

const newOptionTemplate: Omit<ConfigOption, 'id'> = {
    name: '',
    description: '',
};

const FormInput: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { label: string }> = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormTextarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement> & { label: string }> = ({ label, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} rows={3} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);


const ConfigOptionEditModal: React.FC<ConfigOptionEditModalProps> = ({ isOpen, onClose, optionToEdit, onSave, title }) => {
    const [formData, setFormData] = useState<Omit<ConfigOption, 'id'>>(newOptionTemplate);

    useEffect(() => {
        if (isOpen) {
            if (optionToEdit) {
                setFormData({
                    name: optionToEdit.name,
                    description: optionToEdit.description || '',
                });
            } else {
                setFormData(newOptionTemplate);
            }
        }
    }, [optionToEdit, isOpen]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const optionData: ConfigOption = {
            id: optionToEdit?.id || `new_${Date.now()}`,
            name: formData.name,
            description: formData.description,
        };
        onSave(optionData);
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={title}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar</button>
                </>
            }
        >
           <div className="space-y-4">
                <FormInput 
                    label="Nombre"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                />
                <FormTextarea
                    label="Descripción (Opcional)"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                />
           </div>
        </Modal>
    );
};

export default ConfigOptionEditModal;