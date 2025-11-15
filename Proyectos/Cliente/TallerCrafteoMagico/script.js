// Esperar a que la página cargue
document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELECCIÓN DE ELEMENTOS ---
    const ingredientes = document.querySelectorAll('.ingredient');
    const estaciones = document.querySelectorAll('.div-workspace');

    // Variable para saber qué tipo de ítem arrastramos
    let tipoIngredienteArrastrado = null;

    // --- 2. LÓGICA DE INGREDIENTES (Fuente) ---
    ingredientes.forEach(ingrediente => {

        // Al empezar a arrastrar: guardar ID y TIPO
        ingrediente.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/plain', e.target.id);
            tipoIngredienteArrastrado = e.target.dataset.type;
            e.target.style.opacity = '0.5';
        });

        // Al soltar (sin importar dónde): limpiar todo
        ingrediente.addEventListener('dragend', (e) => {
            tipoIngredienteArrastrado = null;
            e.target.style.opacity = '1';
            estaciones.forEach(estacion => {
                estacion.classList.remove('drag-over-valid', 'drag-over-invalid');
            });
        });
    });

    // --- 3. LÓGICA DE ESTACIONES (Destino) ---
    estaciones.forEach(estacion => {

        // Al pasar por encima: validar y dar feedback visual
        estacion.addEventListener('dragover', (e) => {
            e.preventDefault(); // ¡Obligatorio!
            
            const tipoAceptado = e.currentTarget.dataset.accepts;
            
            if (tipoIngredienteArrastrado === tipoAceptado) {
                e.currentTarget.classList.add('drag-over-valid');
                e.currentTarget.classList.remove('drag-over-invalid');
            } else {
                e.currentTarget.classList.add('drag-over-invalid');
                e.currentTarget.classList.remove('drag-over-valid');
            }
        });

        // Al salir de la zona: limpiar feedback
        estacion.addEventListener('dragleave', (e) => {
            e.currentTarget.classList.remove('drag-over-valid', 'drag-over-invalid');
        });

        // Al soltar el ítem: craftear
        estacion.addEventListener('drop', (e) => {
            e.preventDefault();
            e.currentTarget.classList.remove('drag-over-valid', 'drag-over-invalid');

            const tipoAceptado = e.currentTarget.dataset.accepts;

            // Comprobación final
            if (tipoIngredienteArrastrado === tipoAceptado) {
                // 1. Consumir ingrediente
                const idElemento = e.dataTransfer.getData('text/plain');
                const elementoArrastrado = document.getElementById(idElemento);
                if (elementoArrastrado) {
                    elementoArrastrado.remove();
                }
                // 2. Actualizar contador
                actualizarContador(tipoAceptado);
            }
        });
    });


    // --- 4. FUNCIÓN AUXILIAR (Actualizar Almacén) ---
    function actualizarContador(tipoProducto) {
        let contadorElemento;

        switch (tipoProducto) {
            case 'madera':
                contadorElemento = document.getElementById('count-flechas');
                break;
            case 'metal':
                contadorElemento = document.getElementById('count-acero');
                break;
            case 'polvora':
                contadorElemento = document.getElementById('count-bombas');
                break;
            default:
                return;
        }

        let valorActual = parseInt(contadorElemento.textContent);
        contadorElemento.textContent = valorActual + 1;
    }

});