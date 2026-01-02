// JavaScript específico para el módulo Financiero - Calculadora 4x1000

// Evitar redeclaración de la clase
if (typeof window.Calculadora4x1000 === 'undefined') {
    window.Calculadora4x1000 = class Calculadora4x1000 {
    constructor() {
        this.historial = this.cargarHistorial();
        const inicializado = this.inicializar();
        
        if (!inicializado) {
            console.error('Error al inicializar la calculadora 4x1000');
            // Reintentar inicialización después de un delay
            setTimeout(() => {
                this.inicializar();
            }, 200);
        }
    }

    inicializar() {
        // Verificar que los elementos básicos estén disponibles antes de continuar
        if (!document.getElementById('valorTransaccion')) {
            console.warn('Elementos del formulario no están listos, esperando...');
            return false;
        }
        
        this.configurarEventos();
        this.actualizarTablaHistorial();
        this.configurarFormato();
        
        console.log('Calculadora 4x1000 inicializada correctamente');
        return true;
    }

    configurarEventos() {
        // Verificar que los elementos existan antes de agregar eventos
        const btnCalcular = document.getElementById('btnCalcular4x1000');
        const btnLimpiar = document.getElementById('btnLimpiar4x1000');
        const valorTransaccion = document.getElementById('valorTransaccion');
        const btnExportarCSV = document.getElementById('btnExportarCSV');
        const btnExportarJSON = document.getElementById('btnExportarJSON');
        const btnImportarJSON = document.getElementById('btnImportarJSON');
        const btnLimpiarHistorial = document.getElementById('btnLimpiarHistorial');

        // Botón calcular
        if (btnCalcular) {
            btnCalcular.addEventListener('click', () => {
                this.calcular();
            });
        }

        // Botón limpiar
        if (btnLimpiar) {
            btnLimpiar.addEventListener('click', () => {
                this.limpiarFormulario();
            });
        }

        // Enter en el input para calcular
        if (valorTransaccion) {
            valorTransaccion.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.calcular();
                }
            });
        }

        // Botones del historial
        if (btnExportarCSV) {
            btnExportarCSV.addEventListener('click', () => {
                this.exportarCSV();
            });
        }

        if (btnExportarJSON) {
            btnExportarJSON.addEventListener('click', () => {
                this.exportarJSON();
            });
        }

        if (btnImportarJSON) {
            btnImportarJSON.addEventListener('click', () => {
                this.importarJSON();
            });
        }

        if (btnLimpiarHistorial) {
            btnLimpiarHistorial.addEventListener('click', () => {
                this.limpiarHistorial();
            });
        }

        // Configurar input oculto para importar JSON
        const inputFile = document.createElement('input');
        inputFile.type = 'file';
        inputFile.accept = '.json';
        inputFile.style.display = 'none';
        inputFile.id = 'fileInput4x1000';
        document.body.appendChild(inputFile);

        inputFile.addEventListener('change', (e) => {
            this.procesarArchivoImportado(e.target.files[0]);
        });
    }

    configurarFormato() {
        const input = document.getElementById('valorTransaccion');
        
        if (input) {
            input.addEventListener('input', (e) => {
                let value = e.target.value.replace(/[^\d]/g, '');
                if (value) {
                    e.target.value = this.formatearNumero(parseInt(value));
                }
            });
        }
    }

    calcular() {
        const valorTransaccionInput = document.getElementById('valorTransaccion');
        const valorTexto = valorTransaccionInput.value.replace(/[^\d]/g, '');

        if (!valorTexto || valorTexto === '0') {
            this.mostrarAlerta('Por favor ingresa un valor válido', 'error');
            valorTransaccionInput.focus();
            return;
        }

        const valorTransaccion = parseInt(valorTexto);

        if (valorTransaccion > 999999999) {
            this.mostrarAlerta('El valor no puede ser mayor a $999,999,999', 'error');
            return;
        }

        // Calcular 4x1000 - OPERACIÓN CORREGIDA: RESTA
        const cuatroPorMil = Math.round(valorTransaccion * 4 / 1000);
        const total = valorTransaccion - cuatroPorMil; // Resta el impuesto del valor original
        
        console.log(`Cálculo 4x1000: ${valorTransaccion} - ${cuatroPorMil} = ${total}`);

        // Mostrar resultados
        this.mostrarResultados(valorTransaccion, cuatroPorMil, total);

        // Guardar en historial
        this.guardarEnHistorial(valorTransaccion, cuatroPorMil, total);

        // Actualizar tabla
        this.actualizarTablaHistorial();

        this.mostrarAlerta('Cálculo realizado correctamente', 'success');
    }

    mostrarResultados(valorTransaccion, cuatroPorMil, total) {
        const contenedorResultado = document.getElementById('resultadoCalculo4x1000');
        const valorTransaccionSpan = document.getElementById('valorTransaccionResult');
        const cuatroPorMilSpan = document.getElementById('cuatroPorMilResult');
        const totalSpan = document.getElementById('totalResult');

        valorTransaccionSpan.textContent = this.formatearPesos(valorTransaccion);
        cuatroPorMilSpan.textContent = this.formatearPesos(cuatroPorMil);
        totalSpan.textContent = this.formatearPesos(total);

        contenedorResultado.style.display = 'block';
        contenedorResultado.scrollIntoView({ behavior: 'smooth' });
    }

    guardarEnHistorial(valorTransaccion, cuatroPorMil, total) {
        const registro = {
            id: Date.now(),
            fecha: new Date().toLocaleString('es-CO'),
            valorTransaccion,
            cuatroPorMil,
            total
        };

        this.historial.unshift(registro);
        
        // Mantener solo los últimos 50 registros
        if (this.historial.length > 50) {
            this.historial = this.historial.slice(0, 50);
        }

        this.guardarHistorial();
    }

    actualizarTablaHistorial() {
        const tbody = document.querySelector('#tablaHistorial4x1000 tbody');
        
        if (!tbody) {
            console.warn('No se encontró el elemento tbody de la tabla historial');
            return;
        }
        
        if (this.historial.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="5" class="no-data text-center">
                        <i class="fas fa-inbox"></i>
                        <br>No hay registros en el historial
                    </td>
                </tr>
            `;
            return;
        }

        tbody.innerHTML = this.historial.map(registro => `
            <tr>
                <td class="historial-date">${registro.fecha}</td>
                <td class="historial-positive">${this.formatearPesos(registro.valorTransaccion)}</td>
                <td class="historial-negative">${this.formatearPesos(registro.cuatroPorMil)}</td>
                <td class="historial-positive">${this.formatearPesos(registro.total)}</td>
                <td class="text-center">
                    <button class="btn-delete-row" onclick="window.calculadora4x1000.eliminarRegistro(${registro.id})">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    }

    eliminarRegistro(id) {
        this.historial = this.historial.filter(registro => registro.id !== id);
        this.guardarHistorial();
        this.actualizarTablaHistorial();
    }

    limpiarFormulario() {
        document.getElementById('valorTransaccion').value = '';
        document.getElementById('resultadoCalculo4x1000').style.display = 'none';
        document.getElementById('valorTransaccion').focus();
        this.mostrarAlerta('Formulario limpiado', 'info');
    }

    limpiarHistorial() {
        if (this.historial.length === 0) {
            this.mostrarAlerta('El historial ya está vacío', 'info');
            return;
        }

        if (confirm('¿Estás seguro de eliminar todo el historial? Esta acción no se puede deshacer.')) {
            this.historial = [];
            this.guardarHistorial();
            this.actualizarTablaHistorial();
            this.mostrarAlerta('Historial eliminado correctamente', 'success');
        }
    }

    exportarCSV() {
        if (this.historial.length === 0) {
            this.mostrarAlerta('No hay datos para exportar', 'error');
            return;
        }

        const headers = ['Fecha', 'Valor Transacción', '4x1000', 'Total'];
        const csvContent = [
            headers.join(','),
            ...this.historial.map(registro => [
                `"${registro.fecha}"`,
                registro.valorTransaccion,
                registro.cuatroPorMil,
                registro.total
            ].join(','))
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `calculadora_4x1000_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.mostrarAlerta('Historial exportado en CSV correctamente', 'success');
    }

    exportarJSON() {
        if (this.historial.length === 0) {
            this.mostrarAlerta('No hay datos para exportar', 'error');
            return;
        }

        const dataToExport = {
            version: '1.0',
            tipo: 'calculadora_4x1000',
            fechaExportacion: new Date().toISOString(),
            totalRegistros: this.historial.length,
            historial: this.historial
        };

        const blob = new Blob([JSON.stringify(dataToExport, null, 2)], { 
            type: 'application/json;charset=utf-8;' 
        });
        const link = document.createElement('a');
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', `calculadora_4x1000_${new Date().toISOString().split('T')[0]}.json`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        this.mostrarAlerta('Historial exportado en JSON correctamente', 'success');
    }

    importarJSON() {
        const input = document.getElementById('fileInput4x1000');
        input.click();
    }

    procesarArchivoImportado(file) {
        if (!file) return;

        if (!file.name.endsWith('.json')) {
            this.mostrarAlerta('Por favor selecciona un archivo JSON válido', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (!this.validarDatosImportados(data)) {
                    this.mostrarAlerta('El archivo JSON no tiene el formato correcto', 'error');
                    return;
                }

                if (confirm(`¿Deseas importar ${data.totalRegistros} registros? Esto reemplazará el historial actual.`)) {
                    this.historial = data.historial;
                    this.guardarHistorial();
                    this.actualizarTablaHistorial();
                    this.mostrarAlerta(`Se importaron ${data.totalRegistros} registros correctamente`, 'success');
                }
            } catch (error) {
                console.error('Error al procesar archivo:', error);
                this.mostrarAlerta('Error al procesar el archivo JSON', 'error');
            }
        };
        reader.readAsText(file);
    }

    validarDatosImportados(data) {
        return data && 
               data.tipo === 'calculadora_4x1000' &&
               Array.isArray(data.historial) &&
               data.historial.every(registro => 
                   registro.hasOwnProperty('fecha') &&
                   registro.hasOwnProperty('valorTransaccion') &&
                   registro.hasOwnProperty('cuatroPorMil') &&
                   registro.hasOwnProperty('total')
               );
    }

    cargarHistorial() {
        try {
            const historialGuardado = localStorage.getItem('calculadora_4x1000_historial');
            return historialGuardado ? JSON.parse(historialGuardado) : [];
        } catch (error) {
            console.error('Error al cargar historial:', error);
            return [];
        }
    }

    guardarHistorial() {
        try {
            localStorage.setItem('calculadora_4x1000_historial', JSON.stringify(this.historial));
        } catch (error) {
            console.error('Error al guardar historial:', error);
            this.mostrarAlerta('Error al guardar en el historial', 'error');
        }
    }

    formatearNumero(numero) {
        return numero.toLocaleString('es-CO');
    }

    formatearPesos(cantidad) {
        return `$${cantidad.toLocaleString('es-CO')}`;
    }

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
            const container = document.querySelector('.calculadora-4x1000-container');
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
} // Fin de la clase Calculadora4x1000

} // Fin de verificación de redeclaración

// Función para inicializar la calculadora
function inicializarCalculadora4x1000() {
    // Verificar que los elementos existan antes de inicializar
    const botonCalcular = document.getElementById('btnCalcular4x1000');
    const inputTransaccion = document.getElementById('valorTransaccion');
    
    if (botonCalcular && inputTransaccion) {
        // Limpiar instancia previa si existe
        if (window.calculadora4x1000) {
            window.calculadora4x1000 = null;
        }
        
        window.calculadora4x1000 = new window.Calculadora4x1000();
        
        // Enfocar el input principal
        setTimeout(() => {
            const input = document.getElementById('valorTransaccion');
            if (input) {
                input.focus();
            }
        }, 100);
        
        console.log('Calculadora 4x1000 inicializada exitosamente');
    } else {
        // Si los elementos no existen, esperar un poco y reintentar
        console.log('Elementos no encontrados, reintentando en 100ms...');
        setTimeout(inicializarCalculadora4x1000, 100);
    }
}

// Intentar inicializar inmediatamente o esperar a DOMContentLoaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarCalculadora4x1000);
} else {
    // El DOM ya está cargado, inicializar inmediatamente
    inicializarCalculadora4x1000();
}

// Estilos para las alertas (se agregarán dinámicamente)
if (!document.querySelector('#alertStyles4x1000')) {
    const style = document.createElement('style');
    style.id = 'alertStyles4x1000';
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

// Función de debug para verificar historial
window.debugHistorial4x1000 = function() {
    console.log('=== DEBUG HISTORIAL 4x1000 ===');
    const historial = localStorage.getItem('calculadora_4x1000_historial');
    if (historial) {
        const data = JSON.parse(historial);
        console.log('Registros en localStorage:', data.length);
        console.log('Datos:', data);
    } else {
        console.log('No hay historial en localStorage');
    }
    
    if (window.calculadora4x1000) {
        console.log('Instancia activa:', window.calculadora4x1000);
        console.log('Historial en instancia:', window.calculadora4x1000.historial.length);
    } else {
        console.log('No hay instancia activa');
    }
    console.log('================================');
};