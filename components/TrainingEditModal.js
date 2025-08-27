import React, { useState, useEffect, useMemo } from 'react';
import Modal from './shared/Modal.js';
import { useAppContext } from '../contexts/AppContext.js';
import { FormInput, FormSelect, FormTextarea } from './FormComponents.js';

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
    priority: 'Media'
};



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
            
            // Resetear tema cuando cambia el servicio
            if (name === 'service') {
                newState.topic = '';
            }
            
            // Auto-completar duración cuando se selecciona un tema
            if (name === 'topic') {
                const selectedTopic = appData.settings?.trainingTopics?.find(t => t.name === value);
                if (selectedTopic && selectedTopic.duration) {
                    newState.duration = selectedTopic.duration;
                }
                if (selectedTopic && selectedTopic.priority) {
                    newState.priority = selectedTopic.priority;
                }
            }
            
            // Auto-completar duración por defecto cuando cambia el tipo
            if (name === 'type') {
                const selectedType = appData.settings?.trainingTypes?.find(t => t.name === value);
                if (selectedType && selectedType.defaultDuration) {
                    newState.duration = selectedType.defaultDuration;
                }
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
        if (!appData?.settings?.trainingTopics) return [];
        
        // Filtrar temas por servicio seleccionado
        return appData.settings.trainingTopics.filter(topic => 
            topic.service === formData.service
        );
    }, [appData, formData.service]);

    const selectedTopic = useMemo(() => {
        return appData?.settings?.trainingTopics?.find(t => t.name === formData.topic);
    }, [appData, formData.topic]);

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
                    <option value="">Seleccione un tipo</option>
                    {appData.settings?.trainingTypes?.map(t => (
                        <option key={t.id} value={t.name}>{t.name} - {t.description}</option>
                    ))}
                </FormSelect>

                <FormSelect label="Servicio" name="service" value={formData.service} onChange={handleChange}>
                    <option value="">Seleccione un servicio</option>
                    {appData.settings?.trainingServices?.map(s => (
                        <option key={s.id} value={s.name}>{s.name} - {s.description}</option>
                    ))}
                </FormSelect>
                
                <div className="md:col-span-2">
                    <FormSelect label="Tema" name="topic" value={formData.topic} onChange={handleChange}>
                        <option value="">Seleccione un tema</option>
                        {topicOptions?.map(t => (
                            <option key={t.id} value={t.name}>
                                {t.name} ({t.duration} min - {t.priority})
                            </option>
                        ))}
                    </FormSelect>
                    {selectedTopic && (
                        <div className="mt-2 p-2 bg-primary rounded text-sm text-slate-300">
                            <div className="flex justify-between">
                                <span>Duración sugerida: <strong>{selectedTopic.duration} min</strong></span>
                                <span className={`font-semibold ${
                                    selectedTopic.priority === 'Alta' ? 'text-red-400' :
                                    selectedTopic.priority === 'Media' ? 'text-yellow-400' : 'text-green-400'
                                }`}>
                                    Prioridad: {selectedTopic.priority}
                                </span>
                            </div>
                        </div>
                    )}
                </div>
                
                <FormSelect label="Responsable" name="responsible" value={formData.responsible} onChange={handleChange}>
                     <option value="">Seleccione responsable</option>
                     {appData.settings?.users?.map(u => <option key={u.id} value={u.name}>{u.name}</option>)}
                </FormSelect>

                <FormSelect label="Estado" name="status" value={formData.status} onChange={handleChange}>
                    <option value="">Seleccione un estado</option>
                    {appData.settings?.trainingStatuses?.map(s => (
                        <option key={s.id} value={s.name}>{s.name} - {s.description}</option>
                    ))}
                </FormSelect>

                <FormInput label="Fecha y Hora" name="dateTime" type="datetime-local" value={formData.dateTime} onChange={handleChange} />
                <FormInput label="Duración (minutos)" name="duration" type="number" value={formData.duration} onChange={handleChange} />

                <FormTextarea label="Observaciones" name="notes" value={formData.notes} onChange={handleChange} />
            </div>
        </Modal>
    );
};

export default TrainingEditModal;