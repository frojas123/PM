import React from 'react';

const Card = ({ icon, title, value, subtitle }) => {
    return (
        <div className="bg-secondary p-5 rounded-lg shadow-lg flex items-center space-x-4 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
            <div className="p-3 bg-primary rounded-full">
                {icon}
            </div>
            <div>
                <p className="text-sm text-slate-400 font-medium">{title}</p>
                <p className="text-2xl font-bold text-light">{value}</p>
                {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
            </div>
        </div>
    );
};

export default Card;