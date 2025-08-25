
import React, { createContext, useState, useContext, ReactNode, useMemo, useCallback } from 'react';
import { AppData, Client, Training, SettingsData, DashboardStats, EcommerceDetails, AppPedidoDetails, KosDetails } from '../types';

interface AppContextType {
    data: AppData;
    saveClient: (client: Client) => void;
    saveTraining: (training: Training) => void;
    updateSettings: (newSettings: SettingsData) => void;
    updateChecklistState: (clientId: string, categoryId: string, itemId: string, isChecked: boolean) => void;
    saveEcommerceDetails: (clientId: string, details: EcommerceDetails) => void;
    saveAppPedidoDetails: (clientId: string, details: AppPedidoDetails) => void;
    saveKosDetails: (clientId: string, details: KosDetails) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode; initialData: AppData }> = ({ children, initialData }) => {
    const [data, setData] = useState<AppData>(initialData);

    const recalculateDashboardStats = (clients: Client[], trainings: Training[]): DashboardStats => {
        const activeClients = clients.filter(c => c.status === 'Activo').length;
        const pendingInstallations = clients.filter(c => c.status === 'Implementación').length;
        const now = new Date();
        const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
        const trainingsThisMonth = trainings.filter(t => {
            const trainingDate = new Date(t.dateTime);
            return trainingDate >= firstDayOfMonth && trainingDate <= lastDayOfMonth;
        }).length;

        return {
            totalClients: clients.length,
            activeClients,
            pendingInstallations,
            trainingsThisMonth,
            clientsByStatus: [
                { name: 'Activo', value: activeClients },
                { name: 'Implementación', value: pendingInstallations },
                { name: 'En Pausa', value: clients.filter(c => c.status === 'En Pausa').length },
                { name: 'Inactivo', value: clients.filter(c => c.status === 'Inactivo').length },
            ],
            clientsByIndustry: [...new Set(clients.map(c => c.industry))].map(ind => ({ name: ind, value: clients.filter(c => c.industry === ind).length})),
        };
    };

    const saveClient = useCallback((clientToSave: Client) => {
        setData(prevData => {
            const clientIndex = prevData.clients.findIndex(c => c.id === clientToSave.id);
            let newClients: Client[];
            if (clientIndex > -1) {
                newClients = [...prevData.clients];
                newClients[clientIndex] = clientToSave;
            } else {
                newClients = [...prevData.clients, clientToSave];
            }
            const newDashboardStats = recalculateDashboardStats(newClients, prevData.trainings);
            return { ...prevData, clients: newClients, dashboardStats: newDashboardStats };
        });
    }, []);

    const saveTraining = useCallback((trainingToSave: Training) => {
        setData(prevData => {
            const trainingIndex = prevData.trainings.findIndex(t => t.id === trainingToSave.id);
            let newTrainings: Training[];
            if (trainingIndex > -1) {
                newTrainings = [...prevData.trainings];
                newTrainings[trainingIndex] = trainingToSave;
            } else {
                newTrainings = [...prevData.trainings, trainingToSave];
            }
            const newDashboardStats = recalculateDashboardStats(prevData.clients, newTrainings);
            return { ...prevData, trainings: newTrainings, dashboardStats: newDashboardStats };
        });
    }, []);

    const updateSettings = useCallback((newSettings: SettingsData) => {
        setData(prevData => ({
            ...prevData,
            settings: newSettings,
        }));
    }, []);
    
    const updateChecklistState = useCallback((clientId: string, categoryId: string, itemId: string, isChecked: boolean) => {
        setData(prevData => {
            const newClients = prevData.clients.map(client => {
                if (client.id === clientId) {
                    const newChecklistState = { ...client.checklistState };
                    const categoryItems = newChecklistState[categoryId] ? [...newChecklistState[categoryId]] : [];
                    
                    if (isChecked) {
                        if (!categoryItems.includes(itemId)) categoryItems.push(itemId);
                    } else {
                        const index = categoryItems.indexOf(itemId);
                        if (index > -1) categoryItems.splice(index, 1);
                    }
                    newChecklistState[categoryId] = categoryItems;
                    return { ...client, checklistState: newChecklistState };
                }
                return client;
            });
            return { ...prevData, clients: newClients };
        });
    }, []);
    
    const saveEcommerceDetails = useCallback((clientId: string, details: EcommerceDetails) => {
        setData(prevData => ({
            ...prevData,
            clients: prevData.clients.map(c => c.id === clientId ? { ...c, ecommerceDetails: details } : c)
        }));
    }, []);

    const saveAppPedidoDetails = useCallback((clientId: string, details: AppPedidoDetails) => {
        setData(prevData => ({
            ...prevData,
            clients: prevData.clients.map(c => c.id === clientId ? { ...c, appPedidoDetails: details } : c)
        }));
    }, []);

    const saveKosDetails = useCallback((clientId: string, details: KosDetails) => {
        setData(prevData => ({
            ...prevData,
            clients: prevData.clients.map(c => c.id === clientId ? { ...c, kosDetails: details } : c)
        }));
    }, []);


    const value = useMemo(() => ({
        data,
        saveClient,
        saveTraining,
        updateSettings,
        updateChecklistState,
        saveEcommerceDetails,
        saveAppPedidoDetails,
        saveKosDetails
    }), [data, saveClient, saveTraining, updateSettings, updateChecklistState, saveEcommerceDetails, saveAppPedidoDetails, saveKosDetails]);

    return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = (): AppContextType => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error('useAppContext must be used within an AppProvider');
    }
    return context;
};