# Dashboard Utilities

Dashboard web modular con sistema de navegación lateral y módulos independientes.

## Características

- ✅ Menú lateral colapsible y responsivo
- ✅ Navbar con fecha y hora en tiempo real
- ✅ Diseño completamente responsivo
- ✅ Módulos de Finanzas (Calculadoras especializadas)
- ✅ Módulos de Desarrollo (Herramientas útiles)
- ✅ Arquitectura modular independiente
- ✅ Sistema de carga dinámica de módulos
- ✅ Soporte para modo offline con fallbacks

## Estructura del Proyecto

```
appUtils/
├── index.html              # Página principal del dashboard
├── css/
│   └── styles.css          # Estilos principales del dashboard
├── js/
│   └── main.js            # JavaScript principal con navegación
├── modules/
│   ├── financiero/
│   │   ├── calculadora-inversion/
│   │   │   ├── index.html
│   │   │   ├── script.js
│   │   │   └── styles.css
│   │   └── calculadora-4x1000/
│   │       ├── index.html
│   │       ├── script.js
│   │       └── styles.css
│   └── desarrollo/
│       ├── comparar-textos/
│       │   ├── index.html
│       │   ├── script.js
│       │   └── styles.css
│       └── links-utils/
│           ├── index.html
│           ├── script.js
│           └── styles.css
├── assets/                 # Recursos adicionales
├── start-server.bat       # Script para iniciar servidor (Windows)
└── README.md              # Este archivo
```

## Cómo usar

### Opción 1: Servidor web local (Recomendado)

1. Abrir terminal en la carpeta del proyecto
2. Ejecutar: `python -m http.server 8080`
3. Abrir navegador en: `http://localhost:8080`

### Opción 2: Usar el archivo batch (Windows)

1. Hacer doble clic en `start-server.bat`
2. Abrir navegador en: `http://localhost:8080`

### Opción 3: Apertura directa (Limitado)

- Abrir `index.html` directamente en el navegador
- Nota: Los módulos externos no se cargarán por restricciones CORS
- Se usará contenido embebido como fallback

## Módulos Disponibles

### 📊 Financiero
#### Calculadora de Inversión
- Cálculo de rendimientos de inversión
- Análisis de interés compuesto
- Proyecciones financieras
- Historial de cálculos con exportación

#### Calculadora 4x1000
- Cálculo del impuesto 4x1000 sobre transacciones
- Total neto después del impuesto
- Historial completo de operaciones
- Exportación de datos en CSV/JSON

### 🛠️ Desarrollo
#### Comparar Textos
- Comparación detallada de dos textos
- Análisis de similitud y diferencias
- Vista estilo Git diff
- Comparación línea por línea con resaltado

#### Links Utils
- Herramientas externas útiles integradas
- Decode Base64 to PDF
- Convertidores JSON/SQL a Go
- SQL Formatter
- Búsqueda rápida de herramientas

## Navegación

- **💰 Financiero**: Calculadoras financieras especializadas
  - **Calculadora de Inversión**: Rendimientos y proyecciones
  - **Calculadora 4x1000**: Impuesto sobre transacciones
- **⚡ Desarrollo**: Herramientas de desarrollo
  - **Comparar Textos**: Análisis de diferencias entre textos
  - **Links Utils**: Enlaces a herramientas útiles externas

## Tecnologías

- **HTML5**: Estructura semántica moderna
- **CSS3**: Variables CSS, Grid, Flexbox, animaciones
- **JavaScript ES6+**: Clases, async/await, módulos dinámicos
- **Font Awesome 6**: Sistema de iconos vectoriales
- **Arquitectura Modular**: Carga dinámica de componentes

## Instalación y Uso

### Opción 1: Servidor web local (Recomendado)
```bash
# Con Python
python -m http.server 8080

# Con Node.js
npx http-server

# Con PHP
php -S localhost:8080
```

### Opción 2: Script automático (Windows)
1. Ejecutar `start-server.bat`
2. Abrir navegador en `http://localhost:8080`

### Opción 3: Apertura directa (Limitado)
- Abrir `index.html` directamente
- Los módulos se cargarán en modo fallback por restricciones CORS

## Características Técnicas

### Sistema Modular
- **Carga dinámica**: Los módulos se cargan solo cuando se necesitan
- **Arquitectura independiente**: Cada módulo tiene sus propios archivos
- **Detección inteligente**: Fallback automático para modo offline
- **Gestión de scripts**: Prevención de conflictos entre módulos

### Responsive Design
- **Desktop**: Sidebar fija con toggle para colapsar
- **Mobile**: Sidebar overlay con navegación táctil
- **Tablet**: Adaptación automática según resolución
- **Breakpoints**: Optimizado para todos los tamaños de pantalla

### Funcionalidades Avanzadas
- **Fecha y hora en tiempo real**: Actualización automática
- **Navegación sin recarga**: SPA (Single Page Application)
- **Gestión de estado**: Breadcrumbs dinámicos
- **Eventos de teclado**: Soporte completo para accesibilidad

## Personalización

### Variables CSS Principales
```css
:root {
    --primary-dark: #1a1a1a;
    --secondary-dark: #2c3e50;
    --accent-blue: #3498db;
    --white: #ffffff;
    --sidebar-width: 280px;
    --navbar-height: 60px;
}
```

### Agregar Nuevos Módulos
1. Crear carpeta en `modules/[categoria]/[nombre-modulo]/`
2. Incluir: `index.html`, `script.js`, `styles.css`
3. Actualizar rutas en `js/main.js`
4. Agregar entrada en el menú lateral

## Compatibilidad

- **Chrome 60+**
- **Firefox 55+** 
- **Safari 12+**
- **Edge 79+**
- **Dispositivos móviles**: iOS Safari, Chrome Mobile

---

**Dashboard Utilities** - Herramientas profesionales para finanzas y desarrollo
*Desarrollado con arquitectura modular moderna*
