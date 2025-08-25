import React, { useState, useEffect } from 'react';
import Modal from './shared/Modal';
import Spinner from './shared/Spinner';
import { generateOverallClientAnalysis } from '../services/geminiService';
import { useAppContext } from '../contexts/AppContext';

interface GeneralAnalysisModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const GeneralAnalysisModal: React.FC<GeneralAnalysisModalProps> = ({ isOpen, onClose }) => {
    const { data } = useAppContext();
    const [analysis, setAnalysis] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);

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
