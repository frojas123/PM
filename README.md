<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# PM Gestor Pro

Sistema de gestión integral para proyectos y clientes con análisis inteligente.

View your app in AI Studio: https://ai.studio/apps/drive/1Mxb4eDzfauMSoReuiJkM9Zh5yHJT_eNL

## 🚀 Deployment en GitHub Pages

Este proyecto está configurado para deployment automático en GitHub Pages.

**Ver la aplicación desplegada:** `https://[tu-usuario].github.io/PM/`

### Configuración rápida:

1. **Sube el código a GitHub**
2. **Ve a Settings > Pages en tu repositorio**
3. **Selecciona "GitHub Actions" como source**
4. **Configura tu `GEMINI_API_KEY` en Secrets**

¡El deployment será automático en cada push a main!

📖 **[Ver guía completa de deployment](DEPLOYMENT.md)**

## 🛠️ Desarrollo Local

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

## 📦 Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Build para producción
- `npm run preview` - Preview del build
- `npm run deploy` - Deploy manual a GitHub Pages
