import React, { useState, useEffect } from 'react';
import Modal from './shared/Modal.js';
import { useAppContext } from '../contexts/AppContext.js';

const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);


const KosEditModal = ({ isOpen, onClose, client }) => {
    const { saveKosDetails } = useAppContext();
    const [formData, setFormData] = useState(client.kosDetails);

    useEffect(() => {
        if (isOpen && client.kosDetails) {
            setFormData(client.kosDetails);
        }
    }, [client, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name === 'licenses' ? Number(value) : value }));
    };

    const handleSubmit = () => {
        saveKosDetails(client.id, formData);
        onClose();
    };

    if (!formData) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Editar KOS: ${client.fantasyName}`}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar Cambios</button>
                </>
            }
        >
            <div className="space-y-4">
                <FormInput label="Especialidad" name="specialty" value={formData.specialty} onChange={handleChange} />
                <FormInput label="Licencias" name="licenses" type="number" value={formData.licenses} onChange={handleChange} />
            </div>
        </Modal>
    );
};

export default KosEditModal;