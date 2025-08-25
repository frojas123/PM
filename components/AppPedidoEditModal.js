import React, { useState, useEffect } from 'react';
import Modal from './shared/Modal.js';
import { useAppContext } from '../contexts/AppContext.js';

const FormInput = ({ label, ...props }) => (
    <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormTextarea = ({ label, ...props }) => (
     <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const AppPedidoEditModal = ({ isOpen, onClose, client }) => {
    const { saveAppPedidoDetails } = useAppContext();
    const [formData, setFormData] = useState(client.appPedidoDetails);
    const [imeiText, setImeiText] = useState('');

    useEffect(() => {
        if (isOpen && client.appPedidoDetails) {
            setFormData(client.appPedidoDetails);
            setImeiText(client.appPedidoDetails.imeis.join('\n'));
        }
    }, [client, isOpen]);

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: Number(value) }));
    };

    const handleImeiChange = (e) => {
        setImeiText(e.target.value);
    };

    const handleSubmit = () => {
        const imeis = imeiText.split('\n').map(s => s.trim()).filter(Boolean);
        const finalData = { ...formData, imeis };
        saveAppPedidoDetails(client.id, finalData);
        onClose();
    };

    if (!formData) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={`Editar App Pedido: ${client.fantasyName}`}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar Cambios</button>
                </>
            }
        >
            <div className="space-y-4">
                <FormInput label="Licencias" name="licenses" type="number" value={formData.licenses} onChange={handleFormChange} />
                <FormTextarea label="IMEIs (uno por línea)" rows={5} value={imeiText} onChange={handleImeiChange} />
            </div>
        </Modal>
    );
};

export default AppPedidoEditModal;