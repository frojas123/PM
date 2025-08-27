// Componentes de formulario compartidos
import React from 'react';

const FormInput = ({ label, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <input {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

const FormSelect = ({ label, children, ...props }) => (
    <div className="col-span-1">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <select {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent">
            {children}
        </select>
    </div>
);

const FormTextarea = ({ label, ...props }) => (
    <div className="col-span-1 md:col-span-2">
        <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
        <textarea {...props} className="w-full bg-primary border border-slate-600 rounded-lg py-2 px-3 text-light focus:outline-none focus:ring-2 focus:ring-accent" />
    </div>
);

export { FormInput, FormSelect, FormTextarea };