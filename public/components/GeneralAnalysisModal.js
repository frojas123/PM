import React, { useState, useEffect } from 'react';
import Modal from './shared/Modal.js';
import Spinner from './shared/Spinner.js';
import { generateOverallClientAnalysis } from '../services/geminiService.js';
import { useAppContext } from '../contexts/AppContext.js';

const GeneralAnalysisModal = ({ isOpen, onClose }) => {
    const { data } = useAppContext();
    const [analysis, setAnalysis] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (isOpen) {
            const fetchAnalysis = async () => {
                setIsLoading(true);
                setAnalysis('');
                const result = await generateOverallClientAnalysis(data.clients);
                setAnalysis(result);
                setIsLoading(false);
            };
            fetchAnalysis();
        }
    }, [isOpen, data.clients]);

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Análisis General de Clientes (IA)">
            <div className="min-h-[250px] max-h-[60vh] overflow-y-auto pr-2">
                {isLoading ? (
                    <div className="flex justify-center items-center h-full min-h-[250px]">
                        <Spinner />
                    </div>
                ) : (
                    <div className="text-sm text-slate-300 whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: analysis.replace(/\*\*(.*?)\*\*/g, '<strong class="text-accent">$1</strong>').replace(/\n/g, '<br />') }} />
                )}
            </div>
        </Modal>
    );
};

export default GeneralAnalysisModal;