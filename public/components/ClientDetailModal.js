import React, { useState } from 'react';
import Modal from './shared/Modal.js';
import { generateClientSummary } from '../services/geminiService.js';
import Spinner from './shared/Spinner.js';

const DetailItem = ({ label, value, isLink = false }) => (
    <div>
        <p className="text-xs text-slate-400">{label}</p>
        {isLink && value ? 
            <a href={value.toString()} target="_blank" rel="noopener noreferrer" className="font-semibold text-accent hover:underline">{value}</a> :
            <p className="font-semibold text-light break-words">{value || 'N/A'}</p>
        }
    </div>
);

const ClientDetailModal = ({ isOpen, onClose, client }) => {
    const [summary, setSummary] = useState('');
    const [isSummaryLoading, setSummaryLoading] = useState(false);

    const handleGenerateSummary = async () => {
        setSummaryLoading(true);
        setSummary('');
        const result = await generateClientSummary(client);
        setSummary(result);
        setSummaryLoading(false);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={client.fantasyName}>
            <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                
                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Resumen IA</h4>
                     <button onClick={handleGenerateSummary} disabled={isSummaryLoading} className="bg-accent text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-500 transition-colors shadow-md disabled:bg-slate-500 disabled:cursor-not-allowed">
                        <i className="fas fa-magic mr-2"></i> Generar Resumen
                    </button>
                    <div className="mt-4 p-4 bg-primary rounded-lg min-h-[80px]">
                        {isSummaryLoading && <Spinner />}
                        {!isSummaryLoading && summary && <p className="text-sm text-slate-300">{summary}</p>}
                        {!isSummaryLoading && !summary && <p className="text-sm text-slate-400">Haga clic en el botón para generar un resumen con IA.</p>}
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Información Básica</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        <DetailItem label="Razón Social" value={client.legalName} />
                        <DetailItem label="Estado" value={client.status} />
                        <DetailItem label="Rubro" value={client.industry} />
                    </div>
                </section>
                
                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Información de Contacto y Enlaces</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        <DetailItem label="Correo Principal" value={client.clientEmail} />
                        <DetailItem label="Correo 2" value={client.email2} />
                        <DetailItem label="Correo 3" value={client.email3} />
                        <DetailItem label="Link Asana" value={client.asanaLink} isLink={true} />
                        <DetailItem label="Link CRM" value={client.crmLink} isLink={true} />
                    </div>
                </section>

                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Información Técnica y Contrato</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                        <DetailItem label="Licencias" value={client.licenses} />
                        <DetailItem label="Tipo Contrato" value={client.contractType} />
                        <DetailItem label="Tipo Conexión" value={client.connectionType} />
                        <DetailItem label="Nombre Base de Datos" value={client.databaseName} />
                        <DetailItem label="Modelo de Emisión" value={client.emissionModel} />
                    </div>
                </section>
                
                <section>
                     <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Fechas Clave</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                         <DetailItem label="Fecha Registro" value={new Date(client.registrationDate).toLocaleDateString()} />
                         <DetailItem label="Salida Producción (Esperada)" value={new Date(client.expectedGoLiveDate).toLocaleDateString()} />
                         <DetailItem label="Salida Producción (Real)" value={client.actualGoLiveDate ? new Date(client.actualGoLiveDate).toLocaleDateString() : 'Pendiente'} />
                    </div>
                </section>

                {client.freezeReason && (
                    <section>
                        <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Información de Congelación</h4>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                            <DetailItem label="Fecha Congelación" value={client.freezeDate ? new Date(client.freezeDate).toLocaleDateString() : null} />
                            <DetailItem label="Motivo" value={client.freezeReason} />
                        </div>
                        <div className="mt-2">
                            <DetailItem label="Detalles" value={client.freezeDetails} />
                        </div>
                    </section>
                )}

                <section>
                    <h4 className="font-bold text-accent mb-2 border-b border-primary pb-1">Observaciones</h4>
                    <p className="text-sm text-slate-300 bg-primary p-3 rounded-md">{client.observations || 'Sin observaciones.'}</p>
                </section>
                
            </div>
        </Modal>
    );
};

export default ClientDetailModal;