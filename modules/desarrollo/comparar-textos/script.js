// JavaScript específico para el módulo Comparar Textos

// Verificar si la clase ya existe para evitar redeclaración
if (typeof window.ComparadorTextosModule === 'undefined') {

class ComparadorTextosModule {
    constructor() {
        this.init();
    }
    
    init() {
        console.log('Módulo Comparador de Textos inicializado');
        this.setupEventListeners();
    }
    
    setupEventListeners() {
        console.log('Configurando event listeners...');
        
        // Usar setTimeout para asegurar que los elementos estén en el DOM
        setTimeout(() => {
            const compararBtn = document.getElementById('comparar-btn');
            const limpiarBtn = document.getElementById('limpiar-btn');
            
            console.log('Elementos encontrados:', {
                compararBtn: !!compararBtn,
                limpiarBtn: !!limpiarBtn,
                texto1: !!document.getElementById('texto1'),
                texto2: !!document.getElementById('texto2')
            });
            
            if (compararBtn) {
                console.log('Asignando evento al botón Comparar');
                compararBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Botón comparar clickeado');
                    this.compararTextos();
                });
            }
            
            if (limpiarBtn) {
                console.log('Asignando evento al botón Limpiar');
                limpiarBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Botón limpiar clickeado');
                    this.limpiarTextos();
                });
            }
        }, 100);
    }
    
    compararTextos() {
        console.log('Iniciando comparación de textos...');  
        const texto1 = document.getElementById('texto1').value.trim();
        const texto2 = document.getElementById('texto2').value.trim();
        
        if (!texto1 || !texto2) {
            this.mostrarAlerta('Por favor, ingresa ambos textos para compararlos.', 'warning');
            return;
        }
        
        // Realizar análisis de comparación
        const analisis = this.analizarTextos(texto1, texto2);
        this.mostrarResultados(analisis);
    }
    
    analizarTextos(texto1, texto2) {
        // Análisis básico
        const palabras1 = texto1.toLowerCase().split(/\s+/);
        const palabras2 = texto2.toLowerCase().split(/\s+/);
        
        // Palabras comunes
        const palabrasComunes = palabras1.filter(palabra => palabras2.includes(palabra));
        
        // Similitud
        const totalPalabras = Math.max(palabras1.length, palabras2.length);
        const similitud = Math.round((palabrasComunes.length / totalPalabras) * 100);
        
        // Análisis de caracteres
        const caracteres1 = texto1.length;
        const caracteres2 = texto2.length;
        
        // Diferencia de longitud
        const diferenciaLongitud = Math.abs(caracteres1 - caracteres2);
        
        // Análisis línea por línea para diff
        const lineas1 = texto1.split('\n');
        const lineas2 = texto2.split('\n');
        const diff = this.generarDiff(lineas1, lineas2);
        
        return {
            similitud,
            palabrasComunes: palabrasComunes.length,
            caracteres1,
            caracteres2,
            diferenciaLongitud,
            totalPalabras1: palabras1.length,
            totalPalabras2: palabras2.length,
            lineas1: lineas1.length,
            lineas2: lineas2.length,
            diff: diff
        };
    }
    
    mostrarResultados(analisis) {
        // Actualizar métricas
        document.getElementById('porcentajeSimilitud').textContent = analisis.similitud + '%';
        document.getElementById('palabrasComunes').textContent = analisis.palabrasComunes;
        document.getElementById('longitudTexto1').textContent = analisis.caracteres1;
        document.getElementById('longitudTexto2').textContent = analisis.caracteres2;
        
        // Mostrar sección de resultados
        const resultadosDiv = document.getElementById('resultadoComparacion');
        if (resultadosDiv) {
            resultadosDiv.style.display = 'block';
            resultadosDiv.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Generar análisis detallado
        this.generarAnalisisDetallado(analisis);
        
        // Comparación completada sin alerta
    }
    
    generarAnalisisDetallado(analisis) {
        const detalleDiv = document.getElementById('diferenciasDetalle');
        if (!detalleDiv) return;
        
        let html = '<div class="analisis-tabs">';
        html += '<button class="tab-btn active" onclick="mostrarTab(\'resumen\')" id="tab-resumen">📊 Resumen</button>';
        html += '<button class="tab-btn" onclick="mostrarTab(\'diff\')" id="tab-diff">🔍 Diferencias (Git Style)</button>';
        html += '<button class="tab-btn" onclick="mostrarTab(\'completo\')" id="tab-completo">📄 Comparación Completa</button>';
        html += '</div>';
        
        // Tab Resumen
        html += '<div id="tab-content-resumen" class="tab-content active">';
        html += '<h4>📋 Análisis General</h4>';
        html += '<div class="resumen-stats">';
        
        if (analisis.similitud >= 80) {
            html += '<div class="stat-item alta-similitud"><i class="fas fa-check-circle"></i> Los textos son muy similares (' + analisis.similitud + '%)</div>';
        } else if (analisis.similitud >= 50) {
            html += '<div class="stat-item media-similitud"><i class="fas fa-exclamation-triangle"></i> Los textos tienen similitud moderada (' + analisis.similitud + '%)</div>';
        } else {
            html += '<div class="stat-item baja-similitud"><i class="fas fa-times-circle"></i> Los textos son muy diferentes (' + analisis.similitud + '%)</div>';
        }
        
        html += '<div class="stat-item"><i class="fas fa-file-alt"></i> Líneas - Texto 1: ' + analisis.lineas1 + ' | Texto 2: ' + analisis.lineas2 + '</div>';
        html += '<div class="stat-item"><i class="fas fa-calculator"></i> Diferencia de caracteres: ' + analisis.diferenciaLongitud + '</div>';
        html += '<div class="stat-item"><i class="fas fa-spell-check"></i> Palabras en común: ' + analisis.palabrasComunes + '</div>';
        html += '</div></div>';
        
        // Tab Diferencias
        html += '<div id="tab-content-diff" class="tab-content">';
        html += '<h4>🔍 Diferencias Detectadas (Estilo Git)</h4>';
        html += '<div class="diff-container">';
        html += this.formatearDiffComoGit(analisis.diff);
        html += '</div></div>';
        
        // Tab Comparación Completa
        html += '<div id="tab-content-completo" class="tab-content">';
        html += '<h4>📄 Comparación Completa de Textos</h4>';
        html += '<div class="comparison-complete">';
        html += this.generarComparacionCompleta(analisis);
        html += '</div></div>';
        
        detalleDiv.innerHTML = html;
        
        // Agregar funciones globales para las tabs
        window.mostrarTab = (tabName) => {
            document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
            
            document.getElementById('tab-' + tabName).classList.add('active');
            document.getElementById('tab-content-' + tabName).classList.add('active');
        };
    }
    
    generarComparacionCompleta(analisis) {
        const texto1 = document.getElementById('texto1').value;
        const texto2 = document.getElementById('texto2').value;
        
        const lineas1 = texto1.split('\n');
        const lineas2 = texto2.split('\n');
        
        const maxLineas = Math.max(lineas1.length, lineas2.length);
        
        let html = '<div class="comparison-side-by-side">';
        
        // Cabecera
        html += '<div class="comparison-header">';
        html += '<div class="comparison-column">';
        html += '<h5><i class="fas fa-file-alt"></i> Texto 1 (' + lineas1.length + ' líneas)</h5>';
        html += '</div>';
        html += '<div class="comparison-column">';
        html += '<h5><i class="fas fa-file-alt"></i> Texto 2 (' + lineas2.length + ' líneas)</h5>';
        html += '</div>';
        html += '</div>';
        
        // Contenido línea por línea
        html += '<div class="comparison-content">';
        
        for (let i = 0; i < maxLineas; i++) {
            const linea1 = i < lineas1.length ? lineas1[i] : '';
            const linea2 = i < lineas2.length ? lineas2[i] : '';
            const numeroLinea = i + 1;
            
            // Determinar si las líneas son diferentes
            const sonIguales = linea1 === linea2;
            const claseLinea = sonIguales ? 'line-equal' : 'line-different';
            
            html += '<div class="comparison-row ' + claseLinea + '">';
            
            // Columna Texto 1
            html += '<div class="comparison-column text1-column">';
            html += '<span class="line-number">' + numeroLinea + '</span>';
            html += '<div class="line-content">';
            if (linea1 !== '' || i < lineas1.length) {
                html += this.resaltarDiferenciasEnLinea(linea1, linea2, 'texto1');
            } else {
                html += '<span class="empty-line">(línea vacía)</span>';
            }
            html += '</div>';
            html += '</div>';
            
            // Columna Texto 2
            html += '<div class="comparison-column text2-column">';
            html += '<span class="line-number">' + numeroLinea + '</span>';
            html += '<div class="line-content">';
            if (linea2 !== '' || i < lineas2.length) {
                html += this.resaltarDiferenciasEnLinea(linea2, linea1, 'texto2');
            } else {
                html += '<span class="empty-line">(línea vacía)</span>';
            }
            html += '</div>';
            html += '</div>';
            
            html += '</div>';
        }
        
        html += '</div>';
        html += '</div>';
        
        return html;
    }
    
    resaltarDiferenciasEnLinea(lineaActual, lineaComparar, tipo) {
        if (lineaActual === lineaComparar) {
            return this.escaparHTML(lineaActual);
        }
        
        // Si las líneas son completamente diferentes, marcar toda la línea
        if (lineaActual === '' || lineaComparar === '') {
            const clase = tipo === 'texto1' ? 'highlight-removed' : 'highlight-added';
            return '<span class="' + clase + '">' + this.escaparHTML(lineaActual) + '</span>';
        }
        
        // Para diferencias más sutiles, resaltar caracteres específicos
        return this.resaltarDiferenciasCaracter(lineaActual, lineaComparar, tipo);
    }
    
    resaltarDiferenciasCaracter(str1, str2, tipo) {
        const palabras1 = str1.split(' ');
        const palabras2 = str2.split(' ');
        const maxPalabras = Math.max(palabras1.length, palabras2.length);
        
        let resultado = [];
        
        for (let i = 0; i < maxPalabras; i++) {
            const palabra1 = i < palabras1.length ? palabras1[i] : '';
            const palabra2 = i < palabras2.length ? palabras2[i] : '';
            
            if (palabra1 === palabra2) {
                resultado.push(this.escaparHTML(palabra1));
            } else {
                const clase = tipo === 'texto1' ? 'highlight-removed' : 'highlight-added';
                const palabraActual = tipo === 'texto1' ? palabra1 : palabra1;
                resultado.push('<span class="' + clase + '">' + this.escaparHTML(palabraActual) + '</span>');
            }
        }
        
        return resultado.join(' ');
    }
    
    limpiarTextos() {
        document.getElementById('texto1').value = '';
        document.getElementById('texto2').value = '';
        
        const resultadosDiv = document.getElementById('resultadoComparacion');
        if (resultadosDiv) {
            resultadosDiv.style.display = 'none';
        }
        
        console.log('Textos limpiados');
        // Textos limpiados sin alerta
    }
    
    // Sistema de alertas estilo calculadora 4x1000
    mostrarAlerta(mensaje, tipo = 'info') {
        console.log('mostrarAlerta llamada:', mensaje, tipo);
        try {
            // Inyectar estilos si no existen
            this.inyectarEstilosAlerta();
            
            // Remover alertas existentes del mismo tipo
            const alertasExistentes = document.querySelectorAll('.unified-alert');
            alertasExistentes.forEach(alerta => alerta.remove());

            const alerta = document.createElement('div');
            alerta.className = `unified-alert unified-alert-${tipo}`;
            
            const iconos = {
                success: 'fa-check-circle',
                error: 'fa-exclamation-circle', 
                warning: 'fa-exclamation-triangle',
                info: 'fa-info-circle'
            };

            alerta.innerHTML = `
                <div class="unified-alert-content">
                    <i class="fas ${iconos[tipo] || iconos.info} unified-alert-icon"></i>
                    <span class="unified-alert-message">${mensaje}</span>
                </div>
            `;

            document.body.appendChild(alerta);
            console.log('Alerta agregada al DOM:', alerta);

            // Trigger animation
            setTimeout(() => {
                alerta.classList.add('show');
                console.log('Clase show agregada');
            }, 10);

            // Auto-remover después de 3 segundos
            setTimeout(() => {
                if (alerta.parentNode) {
                    alerta.classList.remove('show');
                    setTimeout(() => {
                        if (alerta.parentNode) {
                            alerta.remove();
                        }
                    }, 300);
                }
            }, 3000);
        } catch (error) {
            console.error('Error al mostrar alerta:', error, 'Mensaje original:', mensaje);
        }
    }

    inyectarEstilosAlerta() {
        if (document.getElementById('alertStylesComparador')) return;
        
        const styles = document.createElement('style');
        styles.id = 'alertStylesComparador';
        styles.textContent = `
            .unified-alert {
                position: fixed;
                top: 20px;
                right: 20px;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 16px 20px;
                border-radius: 12px;
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
                z-index: 10000;
                transform: translateX(400px);
                transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
                min-width: 300px;
                max-width: 400px;
            }

            .unified-alert.show {
                transform: translateX(0);
            }

            .unified-alert-success {
                background: linear-gradient(135deg, #4ade80 0%, #22c55e 100%);
            }

            .unified-alert-error {
                background: linear-gradient(135deg, #f87171 0%, #ef4444 100%);
            }

            .unified-alert-warning {
                background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
                color: #1f2937;
            }

            .unified-alert-info {
                background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
            }

            .unified-alert-content {
                display: flex;
                align-items: center;
                gap: 12px;
            }

            .unified-alert-icon {
                font-size: 20px;
                flex-shrink: 0;
            }

            .unified-alert-message {
                flex: 1;
                font-weight: 500;
                line-height: 1.4;
            }

            @media (max-width: 480px) {
                .unified-alert {
                    top: 10px;
                    right: 10px;
                    left: 10px;
                    transform: translateY(-100px);
                    min-width: auto;
                }

                .unified-alert.show {
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styles);
    }
    
    // Métodos para generar diff al estilo Git
    generarDiff(lineas1, lineas2) {
        const diff = [];
        const maxLineas = Math.max(lineas1.length, lineas2.length);
        
        for (let i = 0; i < maxLineas; i++) {
            const linea1 = i < lineas1.length ? lineas1[i] : undefined;
            const linea2 = i < lineas2.length ? lineas2[i] : undefined;
            
            if (linea1 === undefined && linea2 !== undefined) {
                // Línea agregada
                diff.push({ tipo: 'agregada', contenido: linea2, numero: i + 1 });
            } else if (linea1 !== undefined && linea2 === undefined) {
                // Línea eliminada
                diff.push({ tipo: 'eliminada', contenido: linea1, numero: i + 1 });
            } else if (linea1 !== linea2) {
                // Línea modificada
                diff.push({ tipo: 'eliminada', contenido: linea1, numero: i + 1 });
                diff.push({ tipo: 'agregada', contenido: linea2, numero: i + 1 });
            } else {
                // Línea sin cambios
                diff.push({ tipo: 'igual', contenido: linea1, numero: i + 1 });
            }
        }
        
        return this.agruparDiff(diff);
    }
    
    agruparDiff(diff) {
        const grupos = [];
        let grupoActual = [];
        let contexto = 3; // Líneas de contexto como Git
        
        for (let i = 0; i < diff.length; i++) {
            const item = diff[i];
            
            if (item.tipo !== 'igual') {
                // Agregar contexto antes si es necesario
                if (grupoActual.length === 0) {
                    let inicio = Math.max(0, i - contexto);
                    for (let j = inicio; j < i; j++) {
                        if (diff[j].tipo === 'igual') {
                            grupoActual.push(diff[j]);
                        }
                    }
                }
                
                grupoActual.push(item);
                
                // Agregar contexto después
                let j = i + 1;
                let contextAdded = 0;
                while (j < diff.length && contextAdded < contexto) {
                    if (diff[j].tipo === 'igual') {
                        grupoActual.push(diff[j]);
                        contextAdded++;
                    } else {
                        break;
                    }
                    j++;
                }
                
                // Si no hay más cambios cerca, cerrar el grupo
                let siguientesCambios = false;
                for (let k = j; k < Math.min(diff.length, j + contexto * 2); k++) {
                    if (diff[k].tipo !== 'igual') {
                        siguientesCambios = true;
                        break;
                    }
                }
                
                if (!siguientesCambios || j >= diff.length) {
                    grupos.push([...grupoActual]);
                    grupoActual = [];
                    i = j - 1; // Ajustar índice
                }
            }
        }
        
        if (grupoActual.length > 0) {
            grupos.push(grupoActual);
        }
        
        return grupos;
    }
    
    formatearDiffComoGit(grupos) {
        if (!grupos || grupos.length === 0) {
            return '<div class="no-diff"><i class="fas fa-check"></i> Los textos son idénticos</div>';
        }
        
        let html = '<div class="git-diff">';
        
        grupos.forEach((grupo, indiceGrupo) => {
            if (grupo.length === 0) return;
            
            // Cabecera del hunk como Git
            const primerNumero = grupo[0].numero;
            const ultimoNumero = grupo[grupo.length - 1].numero;
            html += `<div class="diff-hunk-header">@@ -${primerNumero},${grupo.length} +${primerNumero},${grupo.length} @@</div>`;
            
            grupo.forEach(item => {
                let claseCSS = '';
                let prefijo = ' ';
                
                if (item.tipo === 'eliminada') {
                    claseCSS = 'diff-deleted';
                    prefijo = '-';
                } else if (item.tipo === 'agregada') {
                    claseCSS = 'diff-added';
                    prefijo = '+';
                } else {
                    claseCSS = 'diff-context';
                    prefijo = ' ';
                }
                
                html += `<div class="diff-line ${claseCSS}">`;
                html += `<span class="diff-line-number">${item.numero}</span>`;
                html += `<span class="diff-prefix">${prefijo}</span>`;
                html += `<span class="diff-content">${this.escaparHTML(item.contenido)}</span>`;
                html += '</div>';
            });
            
            if (indiceGrupo < grupos.length - 1) {
                html += '<div class="diff-separator"></div>';
            }
        });
        
        html += '</div>';
        
        // Agregar estadísticas
        const totalEliminadas = grupos.flat().filter(item => item.tipo === 'eliminada').length;
        const totalAgregadas = grupos.flat().filter(item => item.tipo === 'agregada').length;
        
        html += '<div class="diff-stats">';
        html += `<span class="stat-removed"><i class="fas fa-minus"></i> ${totalEliminadas} eliminadas</span>`;
        html += `<span class="stat-added"><i class="fas fa-plus"></i> ${totalAgregadas} agregadas</span>`;
        html += '</div>';
        
        return html;
    }
    
    escaparHTML(texto) {
        const div = document.createElement('div');
        div.textContent = texto;
        return div.innerHTML;
    }
    
    // Métodos de utilidad adicionales
    calcularDistanciaLevenshtein(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
}

// Almacenar la clase en window para evitar redeclaraciones
window.ComparadorTextosModule = ComparadorTextosModule;

} // Cerrar la verificación condicional

// Asegurar que las funciones estén disponibles globalmente INMEDIATAMENTE
console.log('Script de comparador cargándose...');

// Definir funciones globales inmediatamente
window.compararTextos = function() {
    console.log('Función global compararTextos llamada');
    if (!window.comparadorModule) {
        console.log('Módulo no inicializado, inicializando ahora...');
        window.comparadorModule = new window.ComparadorTextosModule();
    }
    window.comparadorModule.compararTextos();
};

window.limpiarTextos = function() {
    console.log('Función global limpiarTextos llamada');
    if (!window.comparadorModule) {
        console.log('Módulo no inicializado, inicializando ahora...');
        window.comparadorModule = new window.ComparadorTextosModule();
    }
    window.comparadorModule.limpiarTextos();
};

// También definirlas sin window para compatibilidad total
function compararTextos() {
    return window.compararTextos();
}

function limpiarTextos() {
    return window.limpiarTextos();
}



// Inicializar módulo cuando se carga el script
console.log('Inicializando módulo comparador...');
setTimeout(() => {
    if (!window.comparadorModule) {
        window.comparadorModule = new window.ComparadorTextosModule();
        console.log('Módulo comparador inicializado automáticamente');
    }
}, 100);

console.log('Funciones definidas:', {
    compararTextos: typeof compararTextos,
    limpiarTextos: typeof limpiarTextos
});