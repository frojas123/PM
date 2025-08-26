import React, { useState, useEffect, useMemo } from 'react';
import Modal from './shared/Modal.js';
import { useAppContext } from '../contexts/AppContext.js';

const newTrainingTemplate = {
    clientId: '',
    type: 'General',
    service: 'General',
    topic: '',
    responsible: '',
    dateTime: new Date().toISOString().slice(0, 16),
    duration: 60,
    notes: '',
    status: 'AGENDADA',
};

const FormSelect = ({ label, children, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent">
            {children}
        </select>
    </div>
);

const FormInput = ({ label, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormTextarea = ({ label, ...props }) => (
     <div className="col-span-1 md:col-span-2">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} rows={3} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const TrainingEditModal = ({ isOpen, onClose, trainingToEdit, onSave }) => {
    const [formData, setFormData] = useState(newTrainingTemplate);
    const { data: appData } = useAppContext();

    useEffect(() => {
        if (isOpen) {
            if (trainingToEdit) {
                 setFormData({
                    ...trainingToEdit,
                    dateTime: new Date(trainingToEdit.dateTime).toISOString().slice(0, 16)
                });
            } else {
                setFormData(newTrainingTemplate);
            }
        }
    }, [trainingToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        setFormData(prev => {
            const newState = { ...prev, [name]: value };
            if (name === 'type' || name === 'service') {
                newState.topic = '';
            }
            return newState;
        });
    };
    
    const handleSubmit = () => {
        const selectedClient = appData.clients.find(c => c.id === formData.clientId);
        const trainingData = {
            ...formData,
            id: trainingToEdit?.id || `T${Date.now()}`,
            clientFantasyName: selectedClient?.fantasyName || 'N/A',
            duration: Number(formData.duration),
        };
        onSave(trainingData);
    };

    const topicOptions = useMemo(() => {
        if (!appData) return [];
        if (formData.type === 'PM') {
            return appData.settings.trainingTopicsPM;
        }

        switch(formData.service) {
            case 'Ecommerce':
                return appData.settings.trainingTopicsEcommerce;
            case 'App Pedido':
                return appData.settings.trainingTopicsAppPedido;
            case 'KOS':
                return appData.settings.trainingTopicsKOS;
            case 'General':
            default:
                return appData.settings.trainingTopicsGeneral;
        }
    }, [appData, formData.type, formData.service]);

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={trainingToEdit ? 'Editar Capacitación' : 'Programar Nueva Capacitación'}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar</button>
                </>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <FormSelect label="Cliente" name="clientId" value={formData.clientId} onChange={handleChange} className="md:col-span-2">
                    <option value="">Seleccione un cliente</option>
                    {appData.clients.map(c => <option key={c.id} value={c.id}>{c.fantasyName}</option>)}
                </FormSelect>
                
                <FormSelect label="Tipo de Capacitación" name="type" value={formData.type} onChange={handleChange}>
                    <option value="General">General</option>
                    <option value="PM">PM</option>
                </FormSelect>

                <FormSelect label="Servicio" name="service" value={formData.service} onChange={handleChange}>
                    <option value="General">General</option>
                    <option value="Ecommerce">Ecommerce</option>
                    <option value="App Pedido">App Pedido</option>
                    <option value="KOS">KOS</option>
                </FormSelect>
                
                <FormSelect label="Tema" name="topic" value={formData.topic} onChange={handleChange} className="md:col-span-2">
                    <option value="">Seleccione un tema</option>
                    {topicOptions?.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
                </FormSelect>
                
                <FormSelect label="Responsable" name="responsible" value={formData.responsible} onChange={handleChange}>
                     <option value="">Seleccione responsable</option>
                     {appData.settings.users.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                </FormSelect>

                <FormSelect label="Estado" name="status" value={formData.status} onChange={handleChange}>
                    <option value="AGENDADA">Agendada</option>
                    <option value="EN PROCESO">En Proceso</option>
                    <option value="REAGENDADA">Reagendada</option>
                    <option value="CANCELADA">Cancelada</option>
                    <option value="COMPLETADA">Completada</option>
                </FormSelect>

                <FormInput label="Fecha y Hora" name="dateTime" type="datetime-local" value={formData.dateTime} onChange={handleChange} />
                <FormInput label="Duración (minutos)" name="duration" type="number" value={formData.duration} onChange={handleChange} />

                <FormTextarea label="Observaciones" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
        </Modal>
    );
};

export default TrainingEditModal;