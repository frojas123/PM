
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import { Training, TrainingStatus } from '../types';

const getStatusColor = (status: TrainingStatus): string => {
    switch (status) {
        case 'AGENDADA': return 'bg-yellow-500';
        case 'EN PROCESO': return 'bg-blue-500';
        case 'REAGENDADA': return 'bg-orange-500';
        case 'CANCELADA': return 'bg-red-500';
        case 'COMPLETADA': return 'bg-green-500';
        default: return 'bg-gray-500';
    }
};

const Calendar: React.FC = () => {
    const { data } = useAppContext();
    const [currentDate, setCurrentDate] = useState(new Date());

    const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const startDay = startOfMonth.getDay();
    const daysInMonth = endOfMonth.getDate();

    const trainingsByDate: { [key: string]: Training[] } = {};
    data.trainings.forEach(t => {
        const dateKey = new Date(t.dateTime).toDateString();
        if (!trainingsByDate[dateKey]) {
            trainingsByDate[dateKey] = [];
        }
        trainingsByDate[dateKey].push(t);
    });

    const goToPreviousMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const goToNextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };
    
    const goToToday = () => {
        setCurrentDate(new Date());
    };

    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const calendarDays = [];

    // Add empty cells for days before the start of the month
    for (let i = 0; i < startDay; i++) {
        calendarDays.push(<div key={`empty-${i}`} className="border border-primary"></div>);
    }

    // Add cells for each day of the month
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        const dateKey = date.toDateString();
        const isToday = date.toDateString() === new Date().toDateString();
        
        calendarDays.push(
            <div key={day} className={`border border-primary p-2 flex flex-col ${isToday ? 'bg-accent/20' : ''}`}>
                <span className={`font-bold ${isToday ? 'text-accent' : 'text-light'}`}>{day}</span>
                <div className="flex-1 overflow-y-auto mt-1 space-y-1">
                    {trainingsByDate[dateKey]?.map(t => (
                        <div key={t.id} className={`text-xs p-1 rounded ${getStatusColor(t.status)} text-white truncate`} title={`${t.clientFantasyName}: ${t.topic}`}>
                           {t.clientFantasyName}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="bg-secondary p-6 rounded-lg shadow-lg animate-fade-in h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <button onClick={goToPreviousMonth} className="px-3 py-1 bg-primary rounded-lg hover:bg-accent">&lt;</button>
                 <h2 className="text-xl font-bold text-light">
                    {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <button onClick={goToNextMonth} className="px-3 py-1 bg-primary rounded-lg hover:bg-accent">&gt;</button>
            </div>
             <button onClick={goToToday} className="mb-4 text-accent hover:underline text-sm">Ir a Hoy</button>
            <div className="grid grid-cols-7 text-center font-bold text-slate-400">
                {days.map(day => <div key={day} className="p-2 border-b-2 border-primary">{day}</div>)}
            </div>
            <div className="grid grid-cols-7 grid-rows-5 flex-1">
                {calendarDays}
            </div>
        </div>
    );
};

export default Calendar;
