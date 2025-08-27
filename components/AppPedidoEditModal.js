import React, { useState, useEffect } from 'react';
import Modal from './shared/Modal.js';
import { useAppContext } from '../contexts/AppContext.js';
import { FormInput, FormTextarea } from './FormComponents.js';



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
            <div className="space-y-6">
                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg p-4 border border-blue-500/20">
                    <FormInput label="Número de Licencias" name="licenses" type="number" value={formData.licenses} onChange={handleFormChange} />
                </div>
                
                <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg p-4 border border-green-500/20">
                    <label className="block text-sm font-medium text-green-300 mb-3">
                        <i className="fas fa-mobile-alt mr-2"></i>
                        IMEIs de Dispositivos (uno por línea)
                    </label>
                    <FormTextarea 
                        placeholder="Ingrese los IMEIs de los dispositivos, uno por línea..." 
                        rows={6} 
                        value={imeiText} 
                        onChange={handleImeiChange} 
                        className="bg-slate-800/50 border-green-500/30 focus:border-green-500 focus:ring-green-500 font-mono text-sm"
                    />
                    <p className="text-xs text-slate-400 mt-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        Cada IMEI debe estar en una línea separada
                    </p>
                </div>
            </div>
        </Modal>
    );
};

export default AppPedidoEditModal;