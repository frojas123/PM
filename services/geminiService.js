
// This is a placeholder for Gemini API integration.
// In a real application, you would import and use @google/genai here.
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a concise summary for a client using a simulated Gemini API call.
 * 
 * @param client - The client object to summarize.
 * @returns A promise that resolves to a string containing the client summary.
 */
export const generateClientSummary = async (client) => {
    console.log("Simulating Gemini API call for client summary...");

    // En una implementación real, construirías un prompt y llamarías a la API:
    /*
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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating summary with Gemini:", error);
        return "No se pudo generar el resumen en este momento.";
    }
    */

    // Devolviendo una respuesta simulada para fines de demostración
    return new Promise(resolve => {
        setTimeout(() => {
            const summary = `${client.fantasyName}, un cliente del sector ${client.industry}, se encuentra actualmente ${client.status.toLowerCase()}. Se registró el ${new Date(client.registrationDate).toLocaleDateString()} con una fecha de salida a producción esperada para el ${new Date(client.expectedGoLiveDate).toLocaleDateString()}.`;
            resolve(summary);
        }, 1000);
    });
};


/**
 * Generates a strategic overview of the entire client portfolio.
 * 
 * @param clients - An array of all client objects.
 * @returns A promise that resolves to a string with the overall analysis.
 */
export const generateOverallClientAnalysis = async (clients) => {
    console.log("Simulating Gemini API call for overall client analysis...");

    // In a real implementation, you would format the client data and send it.
    /*
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
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
        });
        return response.text;
    } catch (error) {
        console.error("Error generating overall analysis with Gemini:", error);
        return "No se pudo generar el análisis general en este momento.";
    }
    */

    // Simulated response
    return new Promise(resolve => {
        setTimeout(() => {
            const total = clients.length;
            const active = clients.filter(c => c.status === 'Activo').length;
            const implementing = clients.filter(c => c.status === 'Implementación').length;
            const paused = clients.filter(c => c.status === 'En Pausa').length;
            const industries = [...new Set(clients.map(c => c.industry))];

            const analysis = `
**Análisis General de la Cartera de Clientes**

**1. Salud General:**
La cartera de clientes presenta una salud moderada. Con ${active} de ${total} clientes en estado "Activo" (${Math.round((active/total)*100)}%), la base es sólida. Sin embargo, la presencia de ${paused} cliente(s) "En Pausa" y ${implementing} en "Implementación" indica áreas que requieren atención para asegurar la conversión y retención.

**2. Distribución Clave:**
-   **Por Estado:** La mayoría de los clientes están activos, lo cual es positivo. Se debe priorizar la finalización de los proyectos en implementación para convertirlos en activos.
-   **Por Rubro:** Se observa una diversificación interesante en rubros como ${industries.join(', ')}. Esto reduce la dependencia de un solo sector.

**3. Riesgos Potenciales:**
-   **Cliente en Pausa:** FastFashion, un cliente del rubro Retail, se encuentra "En Pausa" debido a una reestructuración interna. Es un riesgo de churn si no se gestiona proactivamente un plan de reactivación.
-   **Implementaciones Largas:** Gourmet Market está en implementación desde hace un tiempo. Es crucial asegurar que el proyecto avance para evitar la insatisfacción del cliente.

**4. Oportunidades:**
-   **Cross-selling:** Clientes del rubro Retail como FastFashion podrían ser candidatos ideales para el servicio de "Ecommerce". Se recomienda preparar una propuesta.
-   **Reactivación:** Contactar a "FastFashion" en 1-2 meses para entender el estado de su reestructuración y proponer un nuevo cronograma podría asegurar la continuidad del proyecto.
-   **Upselling:** TechSolve, con 20 licencias de App Pedido, podría necesitar más a medida que crezca. Un seguimiento sobre su uso podría revelar oportunidades de ampliar el contrato.
            `;
            resolve(analysis.trim());
        }, 1500);
    });
};