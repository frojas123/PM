
import React, { useState, useMemo } from 'react';
import { useAppContext } from '../contexts/AppContext.js';

const ChecklistDetailView = ({ client, onBack }) => {
    const { data, updateChecklistState } = useAppContext();
    const checklistData = data.settings.checklistData || [];
    const [openAccordion, setOpenAccordion] = useState('tecnico');

    const handleAccordionClick = (accordionId) => {
        setOpenAccordion(openAccordion === accordionId ? null : accordionId);
    };
    
    const handleCheckboxChange = (category, itemId, isChecked) => {
        updateChecklistState(client.id, category, itemId, isChecked);
    };

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in">
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="mr-4 p-2 rounded-full text-slate-400 hover:bg-primary hover:text-light">
                    <i className="fas fa-arrow-left"></i>
                </button>
                <h2 className="text-2xl font-bold text-light">Checklist: <span className="text-accent">{client.fantasyName}</span></h2>
            </div>

            <div className="rounded-lg overflow-hidden">
                {checklistData.map(({ id, title, items }) => {
                    const completedItems = client.checklistState[id]?.length || 0;
                    const progress = items.length > 0 ? (completedItems / items.length) * 100 : 0;

                    return (
                        <div key={id} className="border-b border-primary">
                            <button type="button" className="flex items-center justify-between w-full p-5 font-medium text-left text-light bg-secondary hover:bg-slate-700" onClick={() => handleAccordionClick(id)}>
                                <div className="flex-1">
                                    <span>{title}</span>
                                    <div className="w-full bg-primary rounded-full h-2.5 mt-2">
                                        <div className="bg-accent h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
                                    </div>
                                </div>
                                <i className={`fas fa-chevron-down transition-transform duration-200 ml-4 ${openAccordion === id ? 'rotate-180' : ''}`}></i>
                            </button>
                            <div className={`p-5 bg-primary ${openAccordion === id ? '' : 'hidden'}`}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {items.map((item) => (
                                        <label key={item.id} className="flex items-center space-x-3 p-2 rounded-md hover:bg-secondary cursor-pointer">
                                            <input 
                                                type="checkbox" 
                                                className="form-checkbox h-5 w-5 rounded bg-slate-6