# Guía de Deployment para GitHub Pages

## Configuración Automática (Recomendado)

El proyecto está configurado para deployment automático usando GitHub Actions. Cada vez que hagas push a la rama `main`, se desplegará automáticamente.

### Pasos para configurar:

1. **Sube tu código a GitHub:**
   ```bash
   git add .
   git commit -m "Configuración para GitHub Pages"
   git push origin main
   ```

2. **Configura GitHub Pages:**
   - Ve a tu repositorio en GitHub
   - Ve a Settings > Pages
   - En "Source", selecciona "GitHub Actions"

3. **Configura las variables de entorno (si usas API keys):**
   - Ve a Settings > Secrets and variables > Actions
   - Agrega `GEMINI_API_KEY` con tu clave de API

## Deployment Manual

Si prefieres hacer deployment manual:

1. **Instala las dependencias:**
   ```bash
   npm install
   ```

2. **Construye el proyecto:**
   ```bash
   npm run build
   ```

3. **Despliega usando gh-pages:**
   ```bash
   npm run deploy
   ```

## Configuración Importante

- **Base URL:** El proyecto está configurado para funcionar en `/pm-gestor-pro/`
- **Archivos estáticos:** Se sirven desde el directorio `public/`
- **Build output:** Se genera en el directorio `dist/`

## Solución de Problemas

### Si las rutas no funcionan:
- Verifica que el `base` en `vite.config.ts` coincida con el nombre de tu repositorio
- Asegúrate de que las rutas en `index.html` usen el prefijo correcto

### Si los assets no cargan:
- Verifica que el archivo `.nojekyll` esté en el directorio `public/`
- Revisa que las rutas de CSS y JS sean absolutas

### Si GitHub Actions falla:
- Verifica que tengas permisos de escritura en el repositorio
- Asegúrate de que las secrets estén configuradas correctamente