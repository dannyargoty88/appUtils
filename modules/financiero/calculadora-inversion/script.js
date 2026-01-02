// JavaScript específico para el módulo Finanzas - Calculadora de Inversión

// Evitar redeclaración de la clase
if (typeof window.CalculadoraInversion === 'undefined') {
    window.CalculadoraInversion = class CalculadoraInversion {
        constructor() {
            this.historial = this.cargarHistorial();
            const inicializado = this.init();
            
            if (!inicializado) {
                console.error('Error al inicializar la calculadora de inversión');
                // Reintentar inicialización después de un delay
                setTimeout(() => {
                    this.init();
                }, 200);
            }
        }
    
    init() {
        // Verificar que los elementos básicos estén disponibles antes de continuar
        if (!document.getElementById('valorInvertir')) {
            console.warn('Elementos del formulario no están listos, esperando...');
            return false;
        }
        
        console.log('Calculadora de Inversión inicializada');
        this.setupEventListeners();
        this.setFechaActual();
        this.actualizarHistorialTabla();
        
        console.log('Calculadora de Inversión inicializada correctamente');
        return true;
    }
    
    setupEventListeners() {
        const calcularBtn = document.getElementById('calcularBtn');
        const limpiarBtn = document.getElementById('limpiarBtn');
        const limpiarHistorialBtn = document.getElementById('limpiarHistorialBtn');
        const exportarHistorialBtn = document.getElementById('exportarHistorialBtn');
        const exportarJSONBtn = document.getElementById('exportarJSONBtn');
        const importarJSONBtn = document.getElementById('importarJSONBtn');
        const fileInput = document.getElementById('fileInput');
        const aplica4x1000Select = document.getElementById('aplica4x1000');
        
        if (calcularBtn) {
            calcularBtn.addEventListener('click', () => this.calcularInversion());
        }
        
        if (limpiarBtn) {
            limpiarBtn.addEventListener('click', () => this.limpiarFormulario());
        }
        
        if (limpiarHistorialBtn) {
            limpiarHistorialBtn.addEventListener('click', () => this.limpiarHistorial());
        }
        
        if (exportarHistorialBtn) {
            exportarHistorialBtn.addEventListener('click', () => this.exportarHistorial());
        }
        
        if (exportarJSONBtn) {
            exportarJSONBtn.addEventListener('click', () => this.exportarJSON());
        }
        
        if (importarJSONBtn) {
            importarJSONBtn.addEventListener('click', () => this.abrirSelectorArchivo());
        }
        
        if (fileInput) {
            fileInput.addEventListener('change', (e) => this.importarJSON(e));
        }
        
        if (aplica4x1000Select) {
            aplica4x1000Select.addEventListener('change', () => this.toggleFila4x1000());
        }
        
        // Formateo automático para el valor a invertir
        const valorInvertirInput = document.getElementById('valorInvertir');
        if (valorInvertirInput) {
            valorInvertirInput.addEventListener('input', (e) => this.formatearNumeroInput(e));
            valorInvertirInput.addEventListener('blur', (e) => this.validarNumeroInput(e));
        }
    }
    
    setFechaActual() {
        const fechaInicioInput = document.getElementById('fechaInicio');
        if (fechaInicioInput) {
            const hoy = new Date().toISOString().split('T')[0];
            fechaInicioInput.value = hoy;
        }
    }
    
    formatearNumeroInput(event) {
        let valor = event.target.value.replace(/[^0-9]/g, '');
        if (valor) {
            // Formatear con separadores de miles
            event.target.value = parseInt(valor).toLocaleString('es-CO');
        }
    }
    
    validarNumeroInput(event) {
        let valor = event.target.value.replace(/[^0-9]/g, '');
        if (valor && parseInt(valor) > 999999999) {
            event.target.value = '999.999.999';
            this.mostrarAlerta('El valor máximo permitido es $999.999.999', 'warning');
        }
    }
    
    parseNumeroFormateado(valorFormateado) {
        if (!valorFormateado) return 0;
        return parseInt(valorFormateado.toString().replace(/[^0-9]/g, '')) || 0;
    }
    
    calcularInversion() {
        try {
            // Obtener valores del formulario
            const datos = this.obtenerDatosFormulario();
            
            // Validar datos
            if (!this.validarDatos(datos)) {
                return;
            }
            
            // Realizar cálculos
            const resultado = this.realizarCalculos(datos);
            
            // Mostrar resultados
            this.mostrarResultados(resultado, datos);
            
        } catch (error) {
            console.error('Error en el cálculo:', error);
            this.mostrarAlerta('Error al realizar el cálculo. Verifica los datos ingresados.', 'error');
        }
    }
    
    obtenerDatosFormulario() {
        const valorInvertirStr = document.getElementById('valorInvertir').value.replace(/[^\d]/g, '');
        
        return {
            valorInvertir: parseFloat(valorInvertirStr) || 0,
            tasaEfectiva: parseFloat(document.getElementById('tasaEfectiva').value) || 0,
            plazoDias: parseInt(document.getElementById('plazoDias').value) || 0,
            fechaInicio: document.getElementById('fechaInicio').value,
            retefuente: parseFloat(document.getElementById('retefuente').value) || 0,
            aplica4x1000: document.getElementById('aplica4x1000').value === 'si'
        };
    }
    
    validarDatos(datos) {
        if (datos.valorInvertir <= 0) {
            this.mostrarAlerta('El valor a invertir debe ser mayor a cero', 'warning');
            return false;
        }
        
        if (datos.tasaEfectiva <= 0) {
            this.mostrarAlerta('La tasa efectiva anual debe ser mayor a cero', 'warning');
            return false;
        }
        
        if (datos.plazoDias <= 0) {
            this.mostrarAlerta('El plazo en días debe ser mayor a cero', 'warning');
            return false;
        }
        
        if (!datos.fechaInicio) {
            this.mostrarAlerta('Debe seleccionar una fecha de inicio', 'warning');
            return false;
        }
        
        return true;
    }
    
    realizarCalculos(datos) {
        // Calcular fechas
        const fechaInicio = new Date(datos.fechaInicio);
        const fechaFinal = new Date(fechaInicio);
        fechaFinal.setDate(fechaFinal.getDate() + datos.plazoDias);
        
        // Calcular rentabilidad - Fórmula de Interés Compuesto para Tasa Efectiva Anual
        // Fórmula correcta: VF = VP * (1 + i)^(días/360) - Año comercial 360 días
        const tasaDecimal = datos.tasaEfectiva / 100;
        const exponente = datos.plazoDias / 360;
        const factorCapitalizacion = Math.pow(1 + tasaDecimal, exponente);
        
        const totalConRentabilidad = Math.round(datos.valorInvertir * factorCapitalizacion);
        const rentabilidad = totalConRentabilidad - datos.valorInvertir;
        
        // Calcular descuentos
        const retefuente = Math.round((rentabilidad * datos.retefuente) / 100);
        
        // Calcular 4x1000 sobre (Rentabilidad - ReteFuente)
        let descuento4x1000Rentabilidad = 0;
        let rentabilidadNetaInformativa = 0;
        if (datos.aplica4x1000) {
            const baseCalculo4x1000 = rentabilidad - retefuente;
            descuento4x1000Rentabilidad = Math.round((baseCalculo4x1000 * 4) / 1000);
            rentabilidadNetaInformativa = baseCalculo4x1000 - descuento4x1000Rentabilidad;
        } else {
            rentabilidadNetaInformativa = rentabilidad - retefuente;
        }
        
        // Subtotal = Total con Rentabilidad - ReteFuente 4%
        const subtotal = totalConRentabilidad - retefuente;
        
        let descuento4x1000 = 0;
        if (datos.aplica4x1000) {
            descuento4x1000 = Math.round((totalConRentabilidad * 4) / 1000);
        }
        
        const valorFinalNeto = subtotal - descuento4x1000;
        const gananciaNeta = valorFinalNeto - datos.valorInvertir;
        const rentabilidadEfectiva = (gananciaNeta / datos.valorInvertir) * 100;
        
        return {
            fechaInicio,
            fechaFinal,
            rentabilidad,
            totalConRentabilidad,
            retefuente,
            descuento4x1000Rentabilidad,
            rentabilidadNetaInformativa,
            subtotal,
            descuento4x1000,
            valorFinalNeto,
            gananciaNeta,
            rentabilidadEfectiva
        };
    }
    
    mostrarResultados(resultado, datos) {
        // Actualizar tabla de resultados
        document.getElementById('resValorInvertido').textContent = this.formatearMoneda(datos.valorInvertir);
        document.getElementById('resTasaEA').textContent = datos.tasaEfectiva + '%';
        document.getElementById('resDias').textContent = datos.plazoDias;
        document.getElementById('resFechaInicio').textContent = this.formatearFecha(resultado.fechaInicio);
        document.getElementById('resFechaFinal').textContent = this.formatearFecha(resultado.fechaFinal);
        document.getElementById('resRentabilidad').textContent = this.formatearMoneda(resultado.rentabilidad);
        document.getElementById('resTotalConRentabilidad').textContent = this.formatearMoneda(resultado.totalConRentabilidad);
        document.getElementById('resRetefuente').textContent = this.formatearMoneda(resultado.retefuente);
        document.getElementById('res4x1000Rentabilidad').textContent = this.formatearMoneda(resultado.rentabilidadNetaInformativa);
        document.getElementById('resSubtotal').textContent = this.formatearMoneda(resultado.subtotal);
        document.getElementById('resDescuento4x1000').textContent = this.formatearMoneda(resultado.descuento4x1000);
        document.getElementById('resValorFinalNeto').textContent = this.formatearMoneda(resultado.valorFinalNeto);
        
        // Actualizar porcentaje de retefuente
        document.getElementById('resPorcentajeRete').textContent = datos.retefuente + '%';
        
        // Actualizar tarjetas de resumen
        document.getElementById('gananciaNeta').textContent = this.formatearMoneda(resultado.gananciaNeta);
        document.getElementById('rentabilidadEfectiva').textContent = resultado.rentabilidadEfectiva.toFixed(2) + '%';
        
        // Mostrar/ocultar fila 4x1000
        this.toggleFila4x1000();
        
        // Mostrar sección de resultados
        const resultadoDiv = document.getElementById('resultadoCalculadora');
        if (resultadoDiv) {
            resultadoDiv.style.display = 'block';
            resultadoDiv.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Guardar en historial
        this.guardarEnHistorial(resultado, datos);
        
        // Cálculo completado sin alerta
    }
    
    toggleFila4x1000() {
        const aplica4x1000 = document.getElementById('aplica4x1000').value === 'si';
        const fila4x1000 = document.getElementById('fila4x1000');
        const fila4x1000Rentabilidad = document.getElementById('fila4x1000Rentabilidad');
        
        if (fila4x1000) {
            fila4x1000.style.display = aplica4x1000 ? 'table-row' : 'none';
        }
        
        if (fila4x1000Rentabilidad) {
            fila4x1000Rentabilidad.style.display = aplica4x1000 ? 'table-row' : 'none';
        }
    }
    
    limpiarFormulario() {
        // Limpiar todos los inputs
        document.getElementById('valorInvertir').value = '';
        document.getElementById('tasaEfectiva').value = '';
        document.getElementById('plazoDias').value = '';
        document.getElementById('retefuente').value = '4';
        document.getElementById('aplica4x1000').value = 'si';
        
        // Restaurar fecha actual
        this.setFechaActual();
        
        // Ocultar resultados
        const resultadoDiv = document.getElementById('resultadoCalculadora');
        if (resultadoDiv) {
            resultadoDiv.style.display = 'none';
        }
        
        // Formulario limpiado sin alerta
    }
    
    formatearMoneda(valor) {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(valor);
    }
    
    formatearFecha(fecha) {
        return fecha.toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
    
    // Sistema de alertas estilo calculadora 4x1000
    mostrarAlerta(mensaje, tipo = 'info') {
        try {
            // Remover alertas existentes
            const alertasExistentes = document.querySelectorAll('.custom-alert');
            alertasExistentes.forEach(alerta => alerta.remove());

            const alerta = document.createElement('div');
            alerta.className = `custom-alert custom-alert-${tipo}`;
            
            const iconos = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle',
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };

            alerta.innerHTML = `
                <div class="custom-alert-content">
                    <i class="fas ${iconos[tipo] || iconos.info}"></i>
                    <span>${mensaje}</span>
                    <button class="custom-alert-close" onclick="this.parentElement.parentElement.remove()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
            `;

            // Insertar al inicio del contenedor principal
            const container = document.querySelector('.calculadora-inversion-container') || document.querySelector('.container') || document.body;
            if (container) {
                container.insertBefore(alerta, container.firstChild);

                // Auto-remover después de 5 segundos
                setTimeout(() => {
                    if (alerta.parentNode) {
                        alerta.remove();
                    }
                }, 5000);

                // Hacer scroll hacia la alerta
                alerta.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            } else {
                console.warn('No se encontró el contenedor para mostrar la alerta:', mensaje);
            }
        } catch (error) {
            console.error('Error al mostrar alerta:', error, 'Mensaje original:', mensaje);
        }
    }
    

    
    // Funciones del historial
    cargarHistorial() {
        const historialGuardado = localStorage.getItem('finanzas-historial');
        return historialGuardado ? JSON.parse(historialGuardado) : [];
    }
    
    guardarHistorial() {
        localStorage.setItem('finanzas-historial', JSON.stringify(this.historial));
    }
    
    guardarEnHistorial(resultado, datos) {
        const registro = {
            id: Date.now(),
            fechaConsulta: new Date().toISOString(),
            valorInvertido: datos.valorInvertir,
            tasaEA: datos.tasaEfectiva,
            dias: datos.plazoDias,
            fechaInicio: datos.fechaInicio,
            rentabilidad: resultado.rentabilidad,
            totalConRentabilidad: resultado.totalConRentabilidad,
            retefuente: resultado.retefuente,
            retefuentePorcentaje: datos.retefuente,
            rentabilidadNetaInformativa: resultado.rentabilidadNetaInformativa,
            subtotal: resultado.subtotal,
            descuento4x1000: resultado.descuento4x1000,
            aplica4x1000: datos.aplica4x1000,
            valorFinal: resultado.valorFinalNeto,
            gananciaNeta: resultado.gananciaNeta,
            rentabilidadEfectiva: resultado.rentabilidadEfectiva
        };
        
        this.historial.unshift(registro); // Agregar al inicio
        
        // Mantener solo los últimos 100 registros
        if (this.historial.length > 100) {
            this.historial = this.historial.slice(0, 100);
        }
        
        this.guardarHistorial();
        this.actualizarHistorialTabla();
    }
    
    actualizarHistorialTabla() {
        const tbody = document.getElementById('historialBody');
        if (!tbody) {
            console.warn('No se encontró el elemento tbody de la tabla historial en calculadora de inversión');
            return;
        }
        
        if (this.historial.length === 0) {
            tbody.innerHTML = `
                <tr class="no-data">
                    <td colspan="12" class="text-center">
                        <i class="fas fa-inbox"></i>
                        No hay consultas registradas
                    </td>
                </tr>
            `;
            return;
        }
        
        tbody.innerHTML = this.historial.map(registro => `
            <tr>
                <td class="historial-date" style="display: none;">${this.formatearFechaCompleta(registro.fechaConsulta)}</td>
                <td>${this.formatearMoneda(registro.valorInvertido)}</td>
                <td>${registro.tasaEA}%</td>
                <td>${registro.dias}</td>
                <td class="historial-positive">${this.formatearMoneda(registro.rentabilidad)}</td>
                <td class="historial-positive">${this.formatearMoneda(registro.totalConRentabilidad)}</td>
                <td class="historial-negative">${this.formatearMoneda(registro.retefuente)} (${registro.retefuentePorcentaje}%)</td>
                <td class="historial-positive">${this.formatearMoneda(registro.rentabilidadNetaInformativa || 0)}</td>
                <td class="historial-positive">${this.formatearMoneda(registro.subtotal)}</td>
                <td class="historial-negative">${this.formatearMoneda(registro.descuento4x1000)}</td>
                <td class="historial-positive">${this.formatearMoneda(registro.valorFinal)}</td>
                <td>
                    <button onclick="finanzasModule.eliminarRegistro(${registro.id})" class="btn-delete-row">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }
    
    eliminarRegistro(id) {
        this.historial = this.historial.filter(registro => registro.id !== id);
        this.guardarHistorial();
        this.actualizarHistorialTabla();
        // Registro eliminado sin alerta
    }
    
    limpiarHistorial() {
        if (this.historial.length === 0) {
            this.mostrarAlerta('No hay registros para eliminar', 'info');
            return;
        }
        
        if (confirm('¿Está seguro de que desea eliminar todo el historial? Esta acción no se puede deshacer.')) {
            this.historial = [];
            this.guardarHistorial();
            this.actualizarHistorialTabla();
            // Historial limpiado sin alerta
        }
    }
    
    exportarHistorial() {
        if (this.historial.length === 0) {
            this.mostrarAlerta('No hay registros para exportar', 'warning');
            return;
        }
        
        const headers = [
            'Fecha Consulta',
            'Valor Invertido',
            'Tasa E.A.',
            'Días',
            'Rentabilidad',
            'Total con Rentabilidad',
            'ReteFuente',
            'Porcentaje ReteFuente',
            '4x1000 sobre Rent-Rete',
            'Subtotal',
            'Descuento 4x1000',
            'Valor final neto',
            'Aplica 4x1000'
        ];
        
        const csvContent = [
            headers.join(','),
            ...this.historial.map(registro => [
                `"${this.formatearFechaCompleta(registro.fechaConsulta)}"`,
                registro.valorInvertido,
                registro.tasaEA,
                registro.dias,
                registro.rentabilidad,
                registro.totalConRentabilidad,
                registro.retefuente,
                registro.retefuentePorcentaje,
                registro.rentabilidadNetaInformativa || 0,
                registro.subtotal,
                registro.descuento4x1000,
                registro.valorFinal,
                registro.aplica4x1000 ? 'SI' : 'NO'
            ].join(','))
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `historial-inversiones-${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Exportación completada sin alerta
    }
    
    formatearFechaCompleta(fechaISO) {
        const fecha = new Date(fechaISO);
        return fecha.toLocaleString('es-CO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // Funciones para manejo de JSON
    exportarJSON() {
        if (this.historial.length === 0) {
            this.mostrarAlerta('No hay registros para exportar', 'warning');
            return;
        }
        
        const dataToExport = {
            version: '1.0',
            fechaExportacion: new Date().toISOString(),
            totalRegistros: this.historial.length,
            historial: this.historial
        };
        
        const jsonContent = JSON.stringify(dataToExport, null, 2);
        const blob = new Blob([jsonContent], { type: 'application/json' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        
        link.setAttribute('href', url);
        link.setAttribute('download', `historial-inversiones-${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // JSON exportado sin alerta visual
        console.log(`Historial exportado: ${this.historial.length} registros`);
    }
    
    abrirSelectorArchivo() {
        const fileInput = document.getElementById('fileInput');
        if (fileInput) {
            fileInput.click();
        }
    }
    
    async importarJSON(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            // Validar estructura del archivo
            if (!data.historial || !Array.isArray(data.historial)) {
                this.mostrarAlerta('El archivo JSON no tiene el formato correcto', 'error');
                return;
            }
            
            // Validar que los registros tengan la estructura esperada
            const registroValido = data.historial.every(registro => 
                registro.hasOwnProperty('id') &&
                registro.hasOwnProperty('fechaConsulta') &&
                registro.hasOwnProperty('valorInvertido') &&
                registro.hasOwnProperty('tasaEA')
            );
            
            if (!registroValido) {
                this.mostrarAlerta('Los registros en el archivo no tienen el formato esperado', 'error');
                return;
            }
            
            // Mostrar información del archivo antes de importar
            const mensaje = `¿Deseas importar ${data.historial.length} registros?\n\nEsto ${this.historial.length > 0 ? 'reemplazará' : 'agregará'} tu historial actual.`;
            
            if (confirm(mensaje)) {
                // Combinar historial existente con el importado, evitando duplicados por ID
                const historialCombinado = [...this.historial];
                let registrosNuevos = 0;
                
                data.historial.forEach(registroImportado => {
                    const existe = historialCombinado.some(registro => registro.id === registroImportado.id);
                    if (!existe) {
                        historialCombinado.push(registroImportado);
                        registrosNuevos++;
                    }
                });
                
                // Ordenar por fecha de consulta (más reciente primero)
                historialCombinado.sort((a, b) => new Date(b.fechaConsulta) - new Date(a.fechaConsulta));
                
                this.historial = historialCombinado;
                this.guardarHistorial();
                this.actualizarHistorialTabla();
                
                // Mostrar resultado de la importación
                if (registrosNuevos > 0) {
                    this.mostrarAlerta(`Se importaron ${registrosNuevos} nuevos registros`, 'success');
                } else {
                    this.mostrarAlerta('No se encontraron registros nuevos para importar', 'info');
                }
            }
            
        } catch (error) {
            console.error('Error al importar JSON:', error);
            this.mostrarAlerta('No se pudo leer el archivo JSON. Verifica que el formato sea válido.', 'error');
        }
        
        // Limpiar el input file
        event.target.value = '';
    }
    }; // Cierre de la clase CalculadoraInversion
} // Cierre de la condición if

// Función para inicializar la calculadora
function inicializarCalculadoraInversion() {
    // Verificar que los elementos existan antes de inicializar
    const botonCalcular = document.getElementById('calcularBtn');
    const inputValorInvertir = document.getElementById('valorInvertir');
    
    if (botonCalcular && inputValorInvertir) {
        // Limpiar instancia previa si existe
        if (window.finanzasModule) {
            window.finanzasModule = null;
        }
        
        window.finanzasModule = new window.CalculadoraInversion();
        
        // Enfocar el input principal
        setTimeout(() => {
            const input = document.getElementById('valorInvertir');
            if (input) {
                input.focus();
            }
        }, 100);
        
        console.log('Calculadora de Inversión inicializada exitosamente');
    } else {
        // Si los elementos no existen, esperar un poco y reintentar
        console.log('Elementos no encontrados, reintentando en 100ms...');
        setTimeout(inicializarCalculadoraInversion, 100);
    }
}

// Intentar inicializar inmediatamente o esperar a DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCalculadoraInversion);
} else {
    // El DOM ya está cargado, inicializar inmediatamente
    inicializarCalculadoraInversion();
}

// Funciones globales para compatibilidad
window.calcularInversion = function() {
    if (window.finanzasModule) {
        window.finanzasModule.calcularInversion();
    }
};

window.limpiarFormulario = function() {
    if (window.finanzasModule) {
        window.finanzasModule.limpiarFormulario();
    }
};

// Agregar estilos para las alertas si no existen
if (!document.querySelector('#alertStylesInversion')) {
    const style = document.createElement('style');
    style.id = 'alertStylesInversion';
    style.textContent = `
        .custom-alert {
            position: fixed;
            top: 20px;
            right: 20px;
            min-width: 300px;
            max-width: 500px;
            z-index: 1000;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
            transform: translateX(100%);
            animation: slideIn 0.3s ease forwards;
        }

        .custom-alert-content {
            padding: 15px 20px;
            display: flex;
            align-items: center;
            gap: 12px;
            color: white;
            font-weight: 500;
        }

        .custom-alert-success {
            background: linear-gradient(135deg, #10b981, #059669);
        }

        .custom-alert-error {
            background: linear-gradient(135deg, #ef4444, #dc2626);
        }

        .custom-alert-warning {
            background: linear-gradient(135deg, #f59e0b, #d97706);
        }

        .custom-alert-info {
            background: linear-gradient(135deg, #3b82f6, #2563eb);
        }

        .custom-alert-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 5px;
            border-radius: 4px;
            opacity: 0.8;
            transition: opacity 0.2s ease;
            margin-left: auto;
        }

        .custom-alert-close:hover {
            opacity: 1;
            background: rgba(255, 255, 255, 0.1);
        }

        @keyframes slideIn {
            from {
                transform: translateX(100%);
            }
            to {
                transform: translateX(0);
            }
        }

        @media (max-width: 768px) {
            .custom-alert {
                top: 10px;
                right: 10px;
                left: 10px;
                min-width: auto;
                max-width: none;
            }
        }
    `;
    document.head.appendChild(style);
}