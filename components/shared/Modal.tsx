
import React from 'react';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children, footer }) => {
    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center"
            onClick={onClose}
        >
            <div 
                className="bg-secondary rounded-lg shadow-xl w-full max-w-2xl mx-4 transform transition-all animate-fade-in-up"
                onClick={e => e.stopPropagation()}
            >
                <div className="p-5 border-b border-primary flex justify-between items-center bg-gradient-to-r from-primary to-secondary rounded-t-lg">
                    <h3 className="text-xl font-semibold text-light">{title}</h3>
                    <button onClick={onClose} className="text-slate-400 hover:text-light">
                        <i className="fas fa-times text-2xl"></i>
                    </button>
                </div>
                <div className="p-6 text-light">
                    {children}
                </div>
                {footer && (
                    <div className="p-4 bg-primary rounded-b-lg flex justify-end space-x-3">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Modal;
