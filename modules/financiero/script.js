// JavaScript específico para el módulo Financiero

class ModuloFinanciero {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('Módulo Financiero inicializado');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        // Event listeners específicos del módulo financiero principal
        console.log('Event listeners del módulo financiero configurados');
    }
}

// Inicializar módulo
console.log('Inicializando módulo financiero...');
setTimeout(() => {
    if (!window.financieroModule) {
        window.financieroModule = new ModuloFinanciero();
        console.log('Módulo financiero inicializado automáticamente');
    }
}, 100);