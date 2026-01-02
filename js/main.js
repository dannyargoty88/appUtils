// Dashboard Main JavaScript
class Dashboard {
    constructor() {
        this.sidebar = document.getElementById('sidebar');
        this.mainContent = document.getElementById('mainContent');
        this.contentArea = document.getElementById('contentArea');
        this.toggleBtn = document.getElementById('toggleSidebar');
        this.mobileToggle = document.getElementById('mobileSidebarToggle');
        this.overlay = document.getElementById('overlay');
        this.currentSection = document.getElementById('currentSection');
        this.navLinks = document.querySelectorAll('.nav-link');
        
        this.isMobile = window.innerWidth <= 768;
        this.sidebarCollapsed = false;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.updateDateTime();
        this.showWelcomeScreen(); // Mostrar pantalla de bienvenida
        this.updateToggleIcon(); // Inicializar iconos
        
        // Actualizar fecha y hora cada segundo
        setInterval(() => this.updateDateTime(), 1000);
        
        // Responsive handler
        window.addEventListener('resize', () => this.handleResize());
    }
    
    setupEventListeners() {
        // Toggle sidebar desktop
        this.toggleBtn.addEventListener('click', () => this.toggleSidebar());
        
        // Toggle sidebar mobile/desktop
        this.mobileToggle.addEventListener('click', () => {
            if (this.isMobile) {
                this.toggleMobileSidebar();
            } else {
                this.toggleSidebar();
            }
        });
        
        // Overlay click (mobile)
        this.overlay.addEventListener('click', () => this.closeMobileSidebar());
        
        // Navigation links
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleNavigation(e));
        });
        
        // ESC key to close mobile sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isMobile) {
                this.closeMobileSidebar();
            }
        });
    }
    
    toggleSidebar() {
        if (!this.isMobile) {
            this.sidebarCollapsed = !this.sidebarCollapsed;
            
            if (this.sidebarCollapsed) {
                this.sidebar.classList.add('collapsed');
                this.mainContent.classList.add('expanded');
            } else {
                this.sidebar.classList.remove('collapsed');
                this.mainContent.classList.remove('expanded');
            }
            
            // Actualizar icono del botón toggle
            this.updateToggleIcon();
        }
    }
    
    toggleMobileSidebar() {
        if (this.isMobile) {
            this.sidebar.classList.toggle('mobile-open');
            this.overlay.classList.toggle('active');
            document.body.style.overflow = this.sidebar.classList.contains('mobile-open') ? 'hidden' : '';
        }
    }
    
    closeMobileSidebar() {
        if (this.isMobile) {
            this.sidebar.classList.remove('mobile-open');
            this.overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    updateToggleIcon() {
        const toggleIcon = this.toggleBtn.querySelector('i');
        const mobileToggleIcon = this.mobileToggle.querySelector('i');
        
        if (this.sidebarCollapsed) {
            if (toggleIcon) toggleIcon.className = 'fas fa-chevron-right';
            if (mobileToggleIcon) mobileToggleIcon.className = 'fas fa-chevron-right';
        } else {
            if (toggleIcon) toggleIcon.className = 'fas fa-bars';
            if (mobileToggleIcon) mobileToggleIcon.className = 'fas fa-bars';
        }
    }
    
    handleResize() {
        const wasMobile = this.isMobile;
        this.isMobile = window.innerWidth <= 768;
        
        if (wasMobile !== this.isMobile) {
            // Reset states cuando cambia entre mobile y desktop
            if (this.isMobile) {
                this.sidebar.classList.remove('collapsed');
                this.mainContent.classList.remove('expanded');
                this.sidebarCollapsed = false;
                this.updateToggleIcon();
            } else {
                this.closeMobileSidebar();
                this.updateToggleIcon();
            }
        }
    }
    
    handleNavigation(e) {
        e.preventDefault();
        const link = e.currentTarget;
        const section = link.dataset.section;
        
        // Si es un link padre (Desarrollo), toggle submenu en lugar de navegar
        if (link.classList.contains('nav-parent')) {
            const parentItem = link.closest('.nav-item-with-submenu');
            const submenu = parentItem.querySelector('.submenu');
            
            parentItem.classList.toggle('open');
            submenu.classList.toggle('open');
            return;
        }
        
        // Actualizar active link
        this.navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
        
        // Si es un submenu link, también activar el padre
        if (link.classList.contains('submenu-link')) {
            const parentLink = link.closest('.nav-item-with-submenu').querySelector('.nav-parent');
            parentLink.classList.add('active');
        }
        link.classList.add('active');
        
        // Cargar sección
        this.loadSection(section);
        
        // Cerrar sidebar en mobile
        if (this.isMobile) {
            this.closeMobileSidebar();
        }
        
        // Actualizar breadcrumb
        this.updateBreadcrumb(section);
    }
    
    updateBreadcrumb(section) {
        const sectionNames = {
            'financiero': 'Financiero',
            'calculadora-inversion': 'Financiero - Calculadora de Inversión',
            'calculadora-4x1000': 'Financiero - Calculadora 4x1000',
            'desarrollo': 'Desarrollo',
            'comparar-textos': 'Desarrollo - Comparar Textos',
            'links-utils': 'Desarrollo - Links Utils'
        };
        
        this.currentSection.textContent = sectionNames[section] || 'Dashboard';
    }
    
    showWelcomeScreen() {
        // Mostrar pantalla de bienvenida
        this.contentArea.innerHTML = this.getWelcomeContent();
        this.currentSection.textContent = 'Dashboard';
        
        // Limpiar estados activos de navegación
        this.navLinks.forEach(l => l.classList.remove('active'));
    }
    
    getWelcomeContent() {
        return `
            <div class="card">
                <div class="card-header">
                    <h2 class="card-title">
                        <i class="fas fa-home"></i>
                        Bienvenido al Dashboard
                    </h2>
                </div>
                
                <div style="text-align: center; padding: 40px 20px;">
                    <div style="margin-bottom: 30px;">
                        <i class="fas fa-tasks" style="font-size: 4rem; color: var(--accent-blue); margin-bottom: 20px;"></i>
                        <h3 style="color: var(--secondary-dark); margin-bottom: 15px;">¡Bienvenido a tu Dashboard!</h3>
                        <p style="color: #7f8c8d; font-size: 1.1rem; line-height: 1.6; max-width: 600px; margin: 0 auto;">
                            Este es tu centro de control personalizado. Utiliza el menú lateral para navegar entre las diferentes secciones y herramientas disponibles.
                        </p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-top: 40px;">
                        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid var(--accent-blue);">
                            <i class="fas fa-chart-line" style="color: var(--accent-blue); font-size: 2rem; margin-bottom: 10px;"></i>
                            <h4 style="color: var(--secondary-dark); margin-bottom: 8px;">Financiero</h4>
                            <p style="color: #7f8c8d; margin: 0;">Gestiona y calcula tus inversiones financieras</p>
                        </div>
                        
                        <div style="padding: 20px; background-color: #f8f9fa; border-radius: 8px; border-left: 4px solid #27ae60;">
                            <i class="fas fa-code" style="color: #27ae60; font-size: 2rem; margin-bottom: 10px;"></i>
                            <h4 style="color: var(--secondary-dark); margin-bottom: 8px;">Desarrollo</h4>
                            <p style="color: #7f8c8d; margin: 0;">Herramientas útiles para desarrollo</p>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    async loadSection(section) {
        try {
            // Mostrar loading
            this.contentArea.innerHTML = '<div class="loading">Cargando...</div>';
            
            // Simular carga
            await this.delay(300);
            
            // Detectar si estamos en protocolo file:// (CORS restringido)
            const isFileProtocol = window.location.protocol === 'file:';
            let content;
            
            if (!isFileProtocol) {
                // Intentar cargar desde módulo independiente
                try {
                    let modulePath;
                    
                    // Determinar la ruta del módulo según la sección
                    if (section === 'calculadora-inversion') {
                        modulePath = 'modules/financiero/calculadora-inversion/index.html';
                    } else if (section === 'calculadora-4x1000') {
                        modulePath = 'modules/financiero/calculadora-4x1000/index.html';
                    } else if (section === 'links-utils') {
                        modulePath = 'modules/desarrollo/links-utils/index.html';
                    } else if (section === 'comparar-textos') {
                        modulePath = 'modules/desarrollo/comparar-textos/index.html';
                    } else {
                        modulePath = `modules/${section}/index.html`;
                    }
                    
                    const response = await fetch(modulePath);
                    if (response.ok) {
                        content = await response.text();
                    } else {
                        throw new Error('Módulo no encontrado');
                    }
                } catch {
                    // Si falla la carga del módulo, usar contenido por defecto
                    console.warn(`No se pudo cargar el módulo ${section}, usando fallback`);
                    content = this.getDefaultContent(section);
                }
            } else {
                // Si estamos en file://, usar directamente contenido por defecto
                console.info('Modo file:// detectado, usando contenido embebido para evitar CORS');
                content = this.getDefaultContent(section);
            }
            
            this.contentArea.innerHTML = content;
            
            // Cargar JavaScript del módulo si existe
            await this.loadModuleScript(section);
            
            // Añadir clase para animación
            this.contentArea.classList.add('fade-in');
            setTimeout(() => this.contentArea.classList.remove('fade-in'), 300);
            
        } catch (error) {
            console.error('Error loading section:', error);
            this.contentArea.innerHTML = '<div class="error">Error al cargar la sección</div>';
        }
    }
    
    async loadModuleScript(section) {
        try {
            // Remover script previo si existe
            const prevScript = document.querySelector(`script[data-module="${section}"]`);
            if (prevScript) {
                prevScript.remove();
            }
            
            // Verificar si el módulo tiene script
            let scriptPath;
            
            // Determinar la ruta del script según la sección
            if (section === 'calculadora-inversion') {
                scriptPath = 'modules/financiero/calculadora-inversion/script.js';
            } else if (section === 'calculadora-4x1000') {
                scriptPath = 'modules/financiero/calculadora-4x1000/script.js';
            } else if (section === 'links-utils') {
                scriptPath = 'modules/desarrollo/links-utils/script.js';
            } else if (section === 'comparar-textos') {
                scriptPath = 'modules/desarrollo/comparar-textos/script.js';
            } else {
                scriptPath = `modules/${section}/script.js`;
            }
            
            // Intentar cargar el script del módulo
            const script = document.createElement('script');
            script.src = scriptPath;
            script.dataset.module = section;
            
            // Promesa para esperar la carga del script
            return new Promise((resolve, reject) => {
                script.onload = () => {
                    console.log(`Script del módulo ${section} cargado exitosamente`);
                    resolve();
                };
                
                script.onerror = () => {
                    console.warn(`No se encontró script para el módulo ${section}`);
                    resolve(); // No fallar si no hay script
                };
                
                document.head.appendChild(script);
            });
            
        } catch (error) {
            console.warn(`Error al cargar script del módulo ${section}:`, error);
        }
    }
    
    getSectionContent(section) {
        // Función mantenida para compatibilidad, pero ya no se usa
        return this.getDefaultContent(section);
    }
    
    getDefaultContent(section) {
        const contents = {
            'financiero': `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-chart-line"></i>
                            Panel Financiero
                        </h2>
                    </div>
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f39c12; margin-bottom: 20px;"></i>
                        <h3>Módulo en modo fallback</h3>
                        <p>Para acceder al módulo completo, ejecuta con servidor web:<br>
                        <code>python -m http.server 8080</code></p>
                        <p>Módulo ubicado en: <strong>modules/financiero/</strong></p>
                    </div>
                </div>
            `,
            'calculadora-inversion': `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-calculator"></i>
                            Calculadora de Inversión
                        </h2>
                    </div>
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f39c12; margin-bottom: 20px;"></i>
                        <h3>Módulo en modo fallback</h3>
                        <p>Para acceder al módulo completo, ejecuta con servidor web:<br>
                        <code>python -m http.server 8080</code></p>
                        <p>Módulo ubicado en: <strong>modules/financiero/calculadora-inversion/</strong></p>
                    </div>
                </div>
            `,
            'calculadora-4x1000': `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-percentage"></i>
                            Calculadora 4x1000
                        </h2>
                    </div>
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f39c12; margin-bottom: 20px;"></i>
                        <h3>Módulo en modo fallback</h3>
                        <p>Para acceder al módulo completo, ejecuta con servidor web:<br>
                        <code>python -m http.server 8080</code></p>
                        <p>Módulo ubicado en: <strong>modules/financiero/calculadora-4x1000/</strong></p>
                    </div>
                </div>
            `,
            'comparar-textos': `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-equals"></i>
                            Módulo Comparador de Textos
                        </h2>
                    </div>
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f39c12; margin-bottom: 20px;"></i>
                        <h3>Módulo en modo fallback</h3>
                        <p>Para acceder al módulo completo, ejecuta con servidor web:<br>
                        <code>python -m http.server 8080</code></p>
                        <p>Módulo ubicado en: <strong>modules/desarrollo/comparar-textos/</strong></p>
                    </div>
                </div>
            `,
            'desarrollo': `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-code"></i>
                            Panel de Desarrollo
                        </h2>
                    </div>
                    <p style="color: #7f8c8d; line-height: 1.6; padding: 20px;">
                        Panel principal de desarrollo. Selecciona una herramienta del submenú para acceder a las utilidades disponibles.
                    </p>
                    
                    <div style="margin: 20px; padding: 15px; background-color: #e8f4fd; border-left: 4px solid #3498db; border-radius: 4px;">
                        <strong style="color: #3498db;">
                            <i class="fas fa-info-circle"></i> Herramientas Disponibles
                        </strong>
                        <p style="margin: 5px 0 0 0; color: #2c3e50;">
                            • Comparar Textos: Herramienta de comparación de textos<br>
                            • Links Utils: Enlaces a herramientas útiles externas
                        </p>
                    </div>
                </div>
            `,
            'links-utils': `
                <div class="card">
                    <div class="card-header">
                        <h2 class="card-title">
                            <i class="fas fa-link"></i>
                            Links Utils
                        </h2>
                    </div>
                    <div style="text-align: center; padding: 40px;">
                        <i class="fas fa-exclamation-triangle" style="font-size: 3rem; color: #f39c12; margin-bottom: 20px;"></i>
                        <h3>Módulo en modo fallback</h3>
                        <p>Para acceder al módulo completo, ejecuta con servidor web:<br>
                        <code>python -m http.server 8080</code></p>
                        <p>Módulo ubicado en: <strong>modules/desarrollo/links-utils/</strong></p>
                    </div>
                </div>
            `,
        };
        
        return contents[section] || '<div class="card"><h2>Sección no encontrada</h2><p>Módulo: modules/' + section + '/</p></div>';
    }
    
    updateDateTime() {
        const now = new Date();
        
        // Formatear fecha
        const dateOptions = {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        };
        
        // Formatear hora
        const timeOptions = {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        };
        
        const dateStr = now.toLocaleDateString('es-ES', dateOptions);
        const timeStr = now.toLocaleTimeString('es-ES', timeOptions);
        
        document.getElementById('currentDate').textContent = dateStr;
        document.getElementById('currentTime').textContent = timeStr;
    }
    
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Inicializar dashboard cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', () => {
    new Dashboard();
});