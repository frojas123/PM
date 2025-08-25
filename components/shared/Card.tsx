
import React from 'react';

interface CardProps {
    icon: React.ReactNode;
    title: string;
    value: string;
}

const Card: React.FC<CardProps> = ({ icon, title, value }) => {
    return (
        <div className="bg-secondary p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-3 bg-primary rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-light">{value}</p>
            </div>
        </div>
    );
};

export default Card;
