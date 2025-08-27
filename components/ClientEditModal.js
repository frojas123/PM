import React, { useState, useEffect } from 'react';
import Modal from './shared/Modal.js';
import { useAppContext } from '../contexts/AppContext.js';
import { FormInput, FormSelect, FormTextarea } from './FormComponents.js';

const newClientTemplate = {
    legalName: '', fantasyName: '', status: 'Implementación', industry: '',
    connectionType: '', contractType: '', registrationDate: new Date().toISOString().split('T')[0],
    expectedGoLiveDate: '', actualGoLiveDate: null, licenses: 1, databaseName: '',
    emissionModel: '', observations: '', clientEmail: '', email2: '', email3: '',
    asanaLink: '', crmLink: '', freezeDate: null, freezeReason: null, freezeDetails: null,
    checklistState: {},
};




const ClientEditModal = ({ isOpen, onClose, clientToEdit, onSave }) => {
    const [formData, setFormData] = useState(newClientTemplate);
    const { data: appData } = useAppContext(); // get settings data from context

    useEffect(() => {
        if (isOpen) {
             if (clientToEdit) {
                setFormData({
                    ...clientToEdit,
                    registrationDate: clientToEdit.registrationDate ? new Date(clientToEdit.registrationDate).toISOString().split('T')[0] : '',
                    expectedGoLiveDate: clientToEdit.expectedGoLiveDate ? new Date(clientToEdit.expectedGoLiveDate).toISOString().split('T')[0] : '',
                    actualGoLiveDate: clientToEdit.actualGoLiveDate ? new Date(clientToEdit.actualGoLiveDate).toISOString().split('T')[0] : null,
                    freezeDate: clientToEdit.freezeDate ? new Date(clientToEdit.freezeDate).toISOString().split('T')[0] : null,
                });
            } else {
                setFormData(newClientTemplate);
            }
        }
    }, [clientToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        const clientData = {
            ...formData,
            id: clientToEdit?.id || `C${Date.now()}`,
        };
        onSave(clientData);
    };
    
    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title={clientToEdit ? `Editar ${clientToEdit.fantasyName}`: 'Crear Nuevo Cliente'}
            footer={
                <>
                    <button onClick={onClose} className="bg-slate-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-slate-500 transition-colors">Cancelar</button>
                    <button onClick={handleSubmit} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors">Guardar Cambios</button>
                </>
            }
        >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[65vh] overflow-y-auto p-1 pr-3">
                <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1">Información Básica</h4>
                <FormInput label="Nombre de Fantasía" name="fantasyName" value={formData.fantasyName} onChange={handleChange} required />
                <FormInput label="Razón Social" name="legalName" value={formData.legalName} onChange={handleChange} required />
                <FormSelect label="Estado" name="status" value={formData.status} onChange={handleChange}>
                   {appData.settings.clientStatuses.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
                </FormSelect>
                <FormSelect label="Rubro" name="industry" value={formData.industry} onChange={handleChange}>
                    <option value="">Seleccione un rubro</option>
                    {appData.settings.industries.map(i => <option key={i.id} value={i.name}>{i.name}</option>)}
                </FormSelect>
                
                 <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Información de Contacto</h4>
                <FormInput label="Correo Principal" name="clientEmail" type="email" value={formData.clientEmail} onChange={handleChange} />
                <FormInput label="Correo 2" name="email2" type="email" value={formData.email2} onChange={handleChange} />
                <FormInput label="Correo 3" name="email3" type="email" value={formData.email3} onChange={handleChange} />
                <FormInput label="Link Asana" name="asanaLink" type="url" value={formData.asanaLink} onChange={handleChange} />
                <FormInput label="Link CRM" name="crmLink" type="url" value={formData.crmLink} onChange={handleChange} />

                <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Detalles Técnicos y Contrato</h4>
                <FormInput label="Licencias" name="licenses" type="number" value={formData.licenses} onChange={handleChange} />
                <FormInput label="Nombre Base de Datos" name="databaseName" value={formData.databaseName} onChange={handleChange} />
                <FormSelect label="Tipo Contrato" name="contractType" value={formData.contractType} onChange={handleChange}>
                     <option value="">Seleccione tipo</option>
                    {appData.settings.contractTypes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </FormSelect>
                 <FormSelect label="Tipo Conexión" name="connectionType" value={formData.connectionType} onChange={handleChange}>
                     <option value="">Seleccione tipo</option>
                    {appData.settings.connectionTypes.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                </FormSelect>
                <FormSelect label="Modelo de Emisión" name="emissionModel" value={formData.emissionModel} onChange={handleChange} className="md:col-span-2">
                     <option value="">Seleccione modelo</option>
                    {appData.settings.emissionModels.map(e => <option key={e.id} value={e.name}>{e.name}</option>)}
                </FormSelect>
                
                <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Fechas Clave</h4>
                <FormInput label="Fecha Registro" name="registrationDate" type="date" value={formData.registrationDate} onChange={handleChange} />
                <FormInput label="Salida a Producción (Esperada)" name="expectedGoLiveDate" type="date" value={formData.expectedGoLiveDate} onChange={handleChange} />
                <FormInput label="Salida a Producción (Real)" name="actualGoLiveDate" type="date" value={formData.actualGoLiveDate || ''} onChange={handleChange} />

                 <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Congelación (si aplica)</h4>
                <FormInput label="Fecha Congelación" name="freezeDate" type="date" value={formData.freezeDate || ''} onChange={handleChange} />
                <FormSelect label="Motivo Congelación" name="freezeReason" value={formData.freezeReason || ''} onChange={handleChange}>
                    <option value="">Seleccione motivo</option>
                    {appData.settings.freezeReasons.map(r => <option key={r.id} value={r.name}>{r.name}</option>)}
                </FormSelect>
                <FormTextarea label="Detalles de Congelación" name="freezeDetails" value={formData.freezeDetails || ''} onChange={handleChange} />

                <h4 className="md:col-span-2 font-bold text-accent border-b border-primary pb-1 mt-4">Notas Adicionales</h4>
                <FormTextarea label="Observaciones" name="observations" value={formData.observations} onChange={handleChange} />
            </div>
        </Modal>
    );
};

export default ClientEditModal;