
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { useAppContext } from '../contexts/AppContext.js';
import Card from './shared/Card.js';

const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];

const Dashboard = () => {
    const { data } = useAppContext();
    const { dashboardStats } = data;

    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card icon={<i className="fas fa-users text-2xl text-accent"></i>} title="Total Clientes" value={dashboardStats.totalClients.toString()} />
                <Card icon={<i className="fas fa-user-check text-2xl text-green-500"></i>} title="Clientes Activos" value={dashboardStats.activeClients.toString()} />
                <Card icon={<i className="fas fa-cogs text-2xl text-yellow-500"></i>} title="Instalaciones Pendientes" value={dashboardStats.pendingInstallations.toString()} />
                <Card icon={<i className="fas fa-chalkboard-teacher text-2xl text-purple-500"></i>} title="Capacitaciones del Mes" value={dashboardStats.trainingsThisMonth.toString()} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-light">Estado de Clientes</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={dashboardStats.clientsByStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {dashboardStats.clientsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} clientes`, '']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-light">Clientes por Rubro</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dashboardStats.clientsByIndustry} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                            <XAxis dataKey="name" stroke="#ecf0f1" />
                            <YAxis stroke="#ecf0f1" />
                            <Tooltip contentStyle={{ backgroundColor: '#2c3e50', border: 'none' }} cursor={{fill: '#34495e'}} />
                            <Legend />
                            <Bar dataKey="value" name="Nº Clientes" fill="#3498db" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;