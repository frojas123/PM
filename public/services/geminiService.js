
// Gemini API integration
import { GoogleGenerativeAI } from "https://esm.run/@google/generative-ai";

const API_KEY = process.env.GEMINI_API_KEY || process.env.API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

/**
 * Generates a concise summary for a client using a simulated Gemini API call.
 * 
 * @param client - The client object to summarize.
 * @returns A promise that resolves to a string containing the client summary.
 */
export const generateClientSummary = async (client) => {
    console.log("Generating client summary with Gemini API...");

    const prompt = `
        Crea un resumen breve y profesional para el siguiente cliente de gestión de proyectos.
        Destaca su rubro, estado y fechas clave.
        
        Nombre Cliente: ${client.fantasyName} (${client.legalName})
        Rubro: ${client.industry}
        Estado: ${client.status}
        Fecha de Registro: ${client.registrationDate}
        Salida a Producción Esperada: ${client.expectedGoLiveDate}
        ${client.freezeReason ? `Motivo de Congelación: ${client.freezeReason}` : ''}
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating summary with Gemini:", error);
        // Fallback a respuesta simulada si falla la API
        return `${client.fantasyName}, un cliente del sector ${client.industry}, se encuentra actualmente ${client.status.toLowerCase()}. Se registró el ${new Date(client.registrationDate).toLocaleDateString()} con una fecha de salida a producción esperada para el ${new Date(client.expectedGoLiveDate).toLocaleDateString()}.`;
    }
};


/**
 * Generates a strategic overview of the entire client portfolio.
 * 
 * @param clients - An array of all client objects.
 * @returns A promise that resolves to a string with the overall analysis.
 */
export const generateOverallClientAnalysis = async (clients) => {
    console.log("Generating overall client analysis with Gemini API...");

    const clientDataSummary = clients.map(c =>
        `- ${c.fantasyName} (Estado: ${c.status}, Rubro: ${c.industry})`
    ).join('\n');

    const prompt = `
        Analiza la siguiente cartera de clientes de un sistema de gestión de proyectos. 
        Proporciona un resumen estratégico en español que incluya:
        1.  **Salud General:** Una evaluación general del estado de los clientes (e.g., "la mayoría activos", "riesgo por muchos en pausa").
        2.  **Distribución Clave:** Menciona la distribución de clientes por estado y por rubro.
        3.  **Riesgos Potenciales:** Identifica clientes o tendencias que representen un riesgo (e.g., clientes importantes en pausa, implementaciones estancadas).
        4.  **Oportunidades:** Sugiere posibles oportunidades (e.g., "ofrecer el servicio de Ecommerce a clientes del rubro Retail", "reactivar clientes en pausa").
        
        Aquí está la lista de clientes:
        ${clientDataSummary}
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text();
    } catch (error) {
        console.error("Error generating overall analysis with Gemini:", error);

        // Fallback a respuesta simulada si falla la API
        const total = clients.length;
        const active = clients.filter(c => c.status === 'Activo').length;
        const implementing = clients.filter(c => c.status === 'Implementación').length;
        const paused = clients.filter(c => c.status === 'En Pausa').length;
        const industries = [...new Set(clients.map(c => c.industry))];

        return `**Análisis General de la Cartera de Clientes**

**1. Salud General:**
La cartera presenta ${active} de ${total} clientes activos (${Math.round((active / total) * 100)}%). ${paused > 0 ? `Hay ${paused} cliente(s) en pausa que requieren atención.` : 'No hay clientes en pausa.'} ${implementing > 0 ? `${implementing} cliente(s) en implementación.` : ''}

**2. Distribución por Rubro:**
${industries.join(', ')}

**3. Recomendaciones:**
- Priorizar la finalización de implementaciones
- Desarrollar plan de reactivación para clientes en pausa
- Evaluar oportunidades de cross-selling por rubro`;
    }
};