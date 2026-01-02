// JavaScript para Links Utils
// Evitar redeclaraciones múltiples
if (typeof window.LinksUtils === 'undefined') {
    class LinksUtils {
        constructor() {
            this.currentTool = null;
            this.currentUrl = null;
            this.init();
        }
        
        init() {
            // Cargar estilos del módulo
            this.loadModuleStyles();
            console.log('Links Utils inicializado');
        }
        
        loadModuleStyles() {
            // Verificar si los estilos ya están cargados
            const existingLink = document.querySelector('link[href*="links-utils/styles.css"]');
            if (existingLink) {
                console.log('Estilos de Links Utils ya cargados');
                return;
            }
            
            // Crear y agregar el link para los estilos
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = 'modules/desarrollo/links-utils/styles.css';
            link.dataset.module = 'links-utils';
            
            // Confirmar que se cargaron los estilos
            link.onload = () => {
                console.log('Estilos de Links Utils cargados exitosamente');
            };
            
            link.onerror = () => {
                console.error('Error al cargar estilos de Links Utils');
            };
            
            document.head.appendChild(link);
            console.log('Intentando cargar estilos de Links Utils...');
        }
    }
    
    // Asignar la clase al objeto window para evitar redeclaraciones
    window.LinksUtils = LinksUtils;
}

// Configuración de herramientas
if (typeof window.toolsConfig === 'undefined') {
    window.toolsConfig = {
        'base64-pdf': {
            title: 'Decode Base64 to PDF',
            url: 'https://base64.online/decoders/decode-base64-to-pdf',
            description: 'Decodifica texto Base64 y lo convierte a PDF'
        },
        'data-converter': {
            title: 'Data Converter - JSON to Go',
            url: 'https://toolset.marco79423.net/en/json-to-go-struct-converter',
            description: 'Convierte JSON a estructuras Go y otros formatos'
        },
        'sql-to-go': {
            title: 'SQL to Go Struct',
            url: 'https://toolset.marco79423.net/en/sql-ddl-to-go-struct-converter',
            description: 'Convierte DDL SQL a estructuras Go'
        },
        'sql-formatter': {
            title: 'SQL Formatter',
            url: 'https://www.freeformatter.com/sql-formatter.html',
            description: 'Formatea y embellece código SQL'
        }
    };
}

// Variables globales del módulo
if (typeof window.currentToolUrl === 'undefined') {
    window.currentToolUrl = null;
}

// Función para abrir herramienta
function openTool(toolKey) {
    const tool = window.toolsConfig[toolKey];
    if (!tool) {
        console.error('Herramienta no encontrada:', toolKey);
        return;
    }
    
    // Abrir directamente en nueva pestaña debido a restricciones X-Frame-Options
    window.open(tool.url, '_blank', 'noopener,noreferrer');
    
    // Mostrar mensaje de confirmación
    showToolMessage(tool.title, 'La herramienta se ha abierto en una nueva pestaña.');
}

// Función para mostrar mensaje de confirmación
function showToolMessage(title, message) {
    // Crear elementos del mensaje
    const messageDiv = document.createElement('div');
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 10000;
        max-width: 350px;
        opacity: 0;
        transform: translateX(100%);
        transition: all 0.3s ease;
        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    `;
    
    messageDiv.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 8px;">
            <i class="fas fa-check-circle" style="color: #4CAF50; font-size: 1.2em;"></i>
            <strong>${title}</strong>
        </div>
        <div style="font-size: 0.9em; opacity: 0.9;">
            ${message}
        </div>
        <button onclick="this.parentElement.remove()" style="
            position: absolute;
            top: 8px;
            right: 8px;
            background: none;
            border: none;
            color: white;
            font-size: 16px;
            cursor: pointer;
            padding: 2px;
            border-radius: 50%;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
        ">&times;</button>
    `;
    
    // Agregar al DOM
    document.body.appendChild(messageDiv);
    
    // Animación de entrada
    setTimeout(() => {
        messageDiv.style.opacity = '1';
        messageDiv.style.transform = 'translateX(0)';
    }, 100);
    
    // Auto-remove después de 5 segundos
    setTimeout(() => {
        if (messageDiv.parentElement) {
            messageDiv.style.opacity = '0';
            messageDiv.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (messageDiv.parentElement) {
                    messageDiv.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Función para cerrar herramienta (mantenida para compatibilidad)
function closeTool() {
    // Ya no se usa modal, esta función se mantiene para compatibilidad
    console.log('closeTool llamada - no se requiere acción');
}

// Función para abrir en nueva pestaña (mantenida para compatibilidad)
function openInNewTab() {
    // Ya no se usa modal, esta función se mantiene para compatibilidad
    console.log('openInNewTab llamada - no se requiere acción');
}

// Cerrar modal con tecla ESC
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('toolModal');
        if (modal && modal.classList.contains('active')) {
            closeTool();
        }
    }
});

// Inicializar el módulo cuando se carga
if (typeof window !== 'undefined') {
    // Verificar si ya existe una instancia
    if (!window.linksUtilsInstance) {
        window.linksUtilsInstance = new window.LinksUtils();
    }
}

// Cleanup function para cuando se cambia de módulo
function cleanupLinksUtils() {
    // Limpiar estilos del módulo
    const moduleStyles = document.querySelectorAll('link[data-module="links-utils"]');
    moduleStyles.forEach(link => link.remove());
    
    // Cerrar modal si está abierto
    const modal = document.getElementById('toolModal');
    if (modal && modal.classList.contains('active')) {
        closeTool();
    }
    
    // Limpiar instancia
    if (window.linksUtilsInstance) {
        delete window.linksUtilsInstance;
    }
}

// Exportar funciones globales solo si no existen
if (typeof window.openTool === 'undefined') {
    window.openTool = openTool;
}
if (typeof window.closeTool === 'undefined') {
    window.closeTool = closeTool;
}
if (typeof window.openInNewTab === 'undefined') {
    window.openInNewTab = openInNewTab;
}
if (typeof window.cleanupLinksUtils === 'undefined') {
    window.cleanupLinksUtils = cleanupLinksUtils;
}

// Función para filtrar herramientas
function filterTools() {
    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput.value.toLowerCase().trim();
    const tableBody = document.getElementById('toolsTableBody');
    const rows = tableBody.querySelectorAll('tr');
    const clearBtn = document.getElementById('clearSearchBtn');
    const searchStats = document.getElementById('searchStats');
    
    let visibleCount = 0;
    let totalCount = rows.length;
    
    // Mostrar/ocultar botón de limpiar
    if (searchTerm) {
        clearBtn.style.display = 'block';
        searchStats.style.display = 'block';
    } else {
        clearBtn.style.display = 'none';
        searchStats.style.display = 'none';
    }
    
    rows.forEach(row => {
        const searchTerms = row.dataset.searchTerms || '';
        const toolName = row.querySelector('strong')?.textContent || '';
        const toolDescription = row.querySelectorAll('td')[1]?.textContent || '';
        
        const searchableText = (searchTerms + ' ' + toolName + ' ' + toolDescription).toLowerCase();
        
        if (searchTerm === '' || searchableText.includes(searchTerm)) {
            row.style.display = '';
            visibleCount++;
            
            // Resaltar términos encontrados
            if (searchTerm) {
                highlightSearchTerm(row, searchTerm);
            } else {
                removeHighlight(row);
            }
        } else {
            row.style.display = 'none';
            removeHighlight(row);
        }
    });
    
    // Actualizar estadísticas de búsqueda
    if (searchTerm) {
        searchStats.textContent = `Mostrando ${visibleCount} de ${totalCount} herramientas`;
        
        if (visibleCount === 0) {
            showNoResultsMessage();
        } else {
            hideNoResultsMessage();
        }
    }
}

// Función para limpiar búsqueda
function clearSearch() {
    const searchInput = document.getElementById('searchInput');
    searchInput.value = '';
    searchInput.focus();
    filterTools();
}

// Función para resaltar términos de búsqueda
function highlightSearchTerm(row, searchTerm) {
    const cells = row.querySelectorAll('td');
    
    cells.forEach((cell, index) => {
        if (index === 2) return; // Saltar columna de botones
        
        const originalText = cell.dataset.originalText || cell.textContent;
        cell.dataset.originalText = originalText;
        
        if (searchTerm) {
            const regex = new RegExp(`(${escapeRegex(searchTerm)})`, 'gi');
            const highlightedText = originalText.replace(regex, '<mark style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px; color: #856404;">$1</mark>');
            
            if (cell.querySelector('strong')) {
                // Para celdas con elementos HTML, manejar de forma especial
                const strong = cell.querySelector('strong');
                const strongText = strong.textContent;
                if (strongText.toLowerCase().includes(searchTerm)) {
                    strong.innerHTML = strongText.replace(regex, '<mark style="background-color: #fff3cd; padding: 2px 4px; border-radius: 3px; color: #856404;">$1</mark>');
                }
            } else {
                cell.innerHTML = highlightedText;
            }
        }
    });
}

// Función para quitar resaltado
function removeHighlight(row) {
    const cells = row.querySelectorAll('td');
    
    cells.forEach((cell, index) => {
        if (index === 2) return; // Saltar columna de botones
        
        if (cell.dataset.originalText) {
            const originalText = cell.dataset.originalText;
            
            if (cell.querySelector('strong')) {
                // Restaurar texto en elementos strong
                const strong = cell.querySelector('strong');
                strong.innerHTML = strong.textContent.replace(/<mark[^>]*>(.*?)<\/mark>/gi, '$1');
            } else {
                cell.textContent = originalText;
            }
        }
    });
}

// Función para escapar caracteres especiales en regex
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Función para mostrar mensaje de "sin resultados"
function showNoResultsMessage() {
    const tableBody = document.getElementById('toolsTableBody');
    let noResultsRow = document.getElementById('noResultsRow');
    
    if (!noResultsRow) {
        noResultsRow = document.createElement('tr');
        noResultsRow.id = 'noResultsRow';
        noResultsRow.innerHTML = `
            <td colspan="3" style="text-align: center; padding: 40px; color: #666; font-style: italic;">
                <i class="fas fa-search" style="font-size: 2em; margin-bottom: 10px; color: #ccc;"></i><br>
                No se encontraron herramientas que coincidan con tu búsqueda
            </td>
        `;
        tableBody.appendChild(noResultsRow);
    }
    
    noResultsRow.style.display = '';
}

// Función para ocultar mensaje de "sin resultados"
function hideNoResultsMessage() {
    const noResultsRow = document.getElementById('noResultsRow');
    if (noResultsRow) {
        noResultsRow.style.display = 'none';
    }
}

// Exportar funciones globales de búsqueda
window.filterTools = filterTools;
window.clearSearch = clearSearch;