
import React from 'react';
const { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } = window.Recharts;
import { useAppContext } from '../contexts/AppContext.js';
import Card from './shared/Card.js';

const COLORS = ['#3498db', '#2ecc71', '#f1c40f', '#e74c3c', '#9b59b6'];

const Dashboard = () => {
    const { data } = useAppContext();
    const { dashboardStats } = data;

    // Calcular estadísticas de capacitaciones
    const now = new Date();
    const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    const trainingsThisMonth = data.trainings.filter(t => {
        const trainingDate = new Date(t.dateTime);
        return trainingDate >= firstDayOfMonth && trainingDate <= lastDayOfMonth;
    });

    const upcomingTrainings = data.trainings.filter(t => 
        new Date(t.dateTime) >= now && (t.status === 'AGENDADA' || t.status === 'REAGENDADA')
    );

    const completedTrainings = data.trainings.filter(t => t.status === 'COMPLETADA');

    const trainingsByStatus = data.settings?.trainingStatuses?.map(status => ({
        name: status.name,
        value: data.trainings.filter(t => t.status === status.name).length,
        color: status.color
    })) || [];

    const trainingsByService = [...new Set(data.trainings.map(t => t.service))].map(service => ({
        name: service,
        value: data.trainings.filter(t => t.service === service).length
    }));

    return (
        <div className="animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card icon={<i className="fas fa-users text-2xl text-accent"></i>} title="Total Clientes" value={dashboardStats.totalClients.toString()} />
                <Card icon={<i className="fas fa-user-check text-2xl text-green-500"></i>} title="Clientes Activos" value={dashboardStats.activeClients.toString()} />
                <Card icon={<i className="fas fa-cogs text-2xl text-yellow-500"></i>} title="Instalaciones Pendientes" value={dashboardStats.pendingInstallations.toString()} />
                <Card icon={<i className="fas fa-chalkboard-teacher text-2xl text-purple-500"></i>} title="Capacitaciones del Mes" value={trainingsThisMonth.length.toString()} />
            </div>

            {/* Estadísticas adicionales de capacitaciones */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
                <Card 
                    icon={<i className="fas fa-calendar-check text-2xl text-blue-500"></i>} 
                    title="Próximas Capacitaciones" 
                    value={upcomingTrainings.length.toString()}
                    subtitle="Agendadas y reagendadas"
                />
                <Card 
                    icon={<i className="fas fa-check-circle text-2xl text-green-500"></i>} 
                    title="Completadas" 
                    value={completedTrainings.length.toString()}
                    subtitle="Total histórico"
                />
                <Card 
                    icon={<i className="fas fa-clock text-2xl text-orange-500"></i>} 
                    title="Horas Totales" 
                    value={Math.round(data.trainings.reduce((acc, t) => acc + (t.duration || 0), 0) / 60).toString()}
                    subtitle="Horas de capacitación"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
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

            {/* Gráficos de capacitaciones */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-light">Capacitaciones por Estado</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={trainingsByStatus}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                                nameKey="name"
                                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                            >
                                {trainingsByStatus.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value) => [`${value} capacitaciones`, '']} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-secondary p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-semibold mb-4 text-light">Capacitaciones por Servicio</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={trainingsByService} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#34495e" />
                            <XAxis dataKey="name" stroke="#ecf0f1" />
                            <YAxis stroke="#ecf0f1" />
                            <Tooltip contentStyle={{ backgroundColor: '#2c3e50', border: 'none' }} cursor={{fill: '#34495e'}} />
                            <Legend />
                            <Bar dataKey="value" name="Nº Capacitaciones" fill="#9b59b6" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;