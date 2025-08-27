// Script para generar app-bundle.js sin declaraciones duplicadas
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Obtener el directorio actual en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ruta al archivo app-bundle.js original
const appBundlePath = path.join(__dirname, 'public', 'app-bundle.js');

// Leer el contenido del archivo
let content = fs.readFileSync(appBundlePath, 'utf8');

// Buscar y eliminar declaraciones duplicadas de FormInput, FormSelect y FormTextarea
const formComponentRegex = /const (FormInput|FormSelect|FormTextarea) = \(\{ [^}]*\}\) => \([\s\S]*?\);/g;

// Encontrar todas las declaraciones
const declarations = [];
let match;
while ((match = formComponentRegex.exec(content)) !== null) {
  declarations.push({
    component: match[1],
    fullMatch: match[0],
    index: match.index
  });
}

// Buscar y eliminar declaraciones duplicadas de getStatusColor
const statusColorRegex = /const (getStatusColor) = \(([^)]*)\) => \{[\s\S]*?\};/g;
while ((match = statusColorRegex.exec(content)) !== null) {
  declarations.push({
    component: match[1],
    fullMatch: match[0],
    index: match.index
  });
}

// Agrupar por tipo de componente
const componentGroups = {};
declarations.forEach(decl => {
  if (!componentGroups[decl.component]) {
    componentGroups[decl.component] = [];
  }
  componentGroups[decl.component].push(decl);
});

// Eliminar declaraciones duplicadas (mantener solo la primera de cada tipo)
Object.values(componentGroups).forEach(group => {
  if (group.length > 1) {
    // Ordenar por índice en orden descendente para eliminar desde el final
    group.sort((a, b) => b.index - a.index);
    
    // Mantener la primera declaración, eliminar el resto
    for (let i = 0; i < group.length - 1; i++) {
      content = content.replace(group[i].fullMatch, '');
    }
  }
});

// Escribir el contenido modificado de vuelta al archivo
fs.writeFileSync(appBundlePath, content, 'utf8');

console.log('app-bundle.js ha sido actualizado correctamente.');