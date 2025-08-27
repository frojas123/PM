import React, { useState, useEffect } from 'react';
import Modal from './shared/Modal.js';
import { FormInput, FormTextarea } from './FormComponents.js';

const newOptionTemplate = {
    name: '',
    description: '',
};




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