// Script para generar app-bundle.js completo desde archivos fuente
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función para leer archivo y procesar imports
function processFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remover imports de React (ya están globalmente disponibles)
    content = content.replace(/import React.*from.*['"']react['"'];?\n?/g, '');
    content = content.replace(/import \{[^}]*\}.*from.*['"']react['"'];?\n?/g, '');
    
    // Remover imports específicos que ya están disponibles globalmente
    content = content.replace(/import.*\{[^}]*navItems[^}]*\}.*from.*['"'].*constants.*['"];?\n?/g, '');
    content = content.replace(/import.*navItems.*from.*['"'].*constants.*['"];?\n?/g, '');
    
    // Convertir imports relativos a referencias de variables globales
    content = content.replace(/import.*from\s+['"]\.\/contexts\/AppContext\.js['"];?\n?/g, '');
    content = content.replace(/import.*from\s+['"]\.\/shared\/.*['"];?\n?/g, '');
    content = content.replace(/import.*from\s+['"]\.\/.*['"];?\n?/g, '');
    
    // Remover export default
    content = content.replace(/export default.*;?\n?$/gm, '');
    
    return content;
}

// Orden de archivos para el bundle
const fileOrder = [
    'public/constants.js',
    'public/contexts/AppContext.js', 
    'public/hooks/useAppData.js',
    'public/utils/StatusUtils.js',
    'public/services/geminiService.js',
    'public/config/trainingConfig.js',
    'public/components/shared/Spinner.js',
    'public/components/shared/Skeleton.js',
    'public/components/shared/Card.js',
    'public/components/shared/Modal.js',
    'public/components/FormComponents.js',
    'public/components/Header.js',
    'public/components/Sidebar.js',
    'public/components/Dashboard.js',
    'public/components/Clients.js',
    'public/components/ClientDetailModal.js',
    'public/components/ClientEditModal.js',
    'public/components/Trainings.js',
    'public/components/TrainingEditModal.js',
    'public/components/TrainingSummary.js',
    'public/components/Calendar.js',
    'public/components/Checklists.js',
    'public/components/Ecommerce.js',
    'public/components/EcommerceEditModal.js',
    'public/components/AppPedido.js',
    'public/components/AppPedidoEditModal.js',
    'public/components/Kos.js',
    'public/components/KosEditModal.js',
    'public/components/Settings.js',
    'public/components/ConfigOptionEditModal.js',
    'public/components/GeneralAnalysisModal.js',
    'public/App.js',
    'public/index.js'
];

// Generar el bundle
let bundleContent = `// PM Gestor Pro - Bundle
// Generated automatically - Do not edit manually

// React hooks destructuring
const { useState, useCallback, useContext, createContext, useEffect, useMemo } = React;
const { createRoot } = ReactDOM;


`;

fileOrder.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    
    if (fs.existsSync(fullPath)) {
        const processedContent = processFile(fullPath);
        bundleContent += `// === ${filePath} ===\n`;
        bundleContent += processedContent;
        bundleContent += '\n\n';
    } else {
        console.warn(`Warning: File not found: ${filePath}`);
    }
});

// Escribir el bundle
const bundlePath = path.join(__dirname, 'public', 'app-bundle.js');
fs.writeFileSync(bundlePath, bundleContent, 'utf8');

console.log('app-bundle.js ha sido generado correctamente.');