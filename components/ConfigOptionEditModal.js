import React, { useState, useEffect } from 'react';
import Modal from './shared/Modal.js';

const newOptionTemplate = {
    name: '',
    description: '',
};

const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormTextarea = ({ label, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} rows={3} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);


const ConfigOptionEditModal = ({ isOpen, onClose, optionToEdit, onSave, title }) => {
    const [formData, setFormData] = useState(newOptionTemplate);

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

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const optionData = {
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