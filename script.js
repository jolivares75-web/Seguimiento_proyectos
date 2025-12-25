// 1. CARGA Y PROCESAMIENTO DEL CSV
fetch("seguimiento_proyectos.csv")
    .then(response => response.text())
    .then(data => {
        const filas = data.trim().split("\n");
        if (filas.length === 0) return;

        // Detectamos los encabezados (usando punto y coma)
        const headers = filas[0].split(";").map(h => h.trim());

        const tabla = document.getElementById("tablaProyectos");
        tabla.innerHTML = ""; // Limpiamos la tabla

        // --- Generamos el ENCABEZADO (Thead) ---
        const thead = document.createElement("thead");
        const trHead = document.createElement("tr");
        
        headers.forEach(header => {
            const th = document.createElement("th");
            th.textContent = header;
            trHead.appendChild(th);
        });
        
        thead.appendChild(trHead);
        tabla.appendChild(thead);

        // --- Generamos el CUERPO (Tbody) ---
        const tbody = document.createElement("tbody");

        for (let i = 1; i < filas.length; i++) {
            if (filas[i].trim() === "") continue;

            const valores = filas[i].split(";");
            const tr = document.createElement("tr");

            headers.forEach((header, index) => {
                const td = document.createElement("td");
                const valor = valores[index] ? valores[index].trim() : "";

                // Lógica A: Barras de Progreso (si la columna tiene un %)
                if (header.includes("%") && valor !== "") {
                    const numero = parseInt(valor.replace("%", "")) || 0;
                    
                    const barraContenedor = document.createElement("div");
                    barraContenedor.style.backgroundColor = "#e0e0e0";
                    barraContenedor.style.borderRadius = "5px";
                    barraContenedor.style.overflow = "hidden";
                    
                    const barraProgreso = document.createElement("div");
                    barraProgreso.style.width = numero + "%";
                    barraProgreso.style.backgroundColor = "#2980b9";
                    barraProgreso.style.color = "white";
                    barraProgreso.style.textAlign = "center";
                    barraProgreso.style.fontSize = "12px";
                    barraProgreso.style.padding = "2px 0";
                    barraProgreso.textContent = valor;

                    barraContenedor.appendChild(barraProgreso);
                    td.appendChild(barraContenedor);

                } 
                // Lógica B: Texto normal y Formato Condicional
                else {
                    td.textContent = valor;

                    // Colores según estado
                    const estado = valor.toUpperCase();

                    if (estado === "PENDIENTE") {
                        td.style.color = "#e67e22"; // Naranja
                        td.style.fontWeight = "bold";
                    } 
                    else if (estado === "TERMINADO" || estado === "APROBADO") {
                        td.style.color = "#27ae60"; // Verde
                        td.style.fontWeight = "bold";
                    }
                    else if (estado === "RECHAZADO" || estado === "DETENIDO") {
                        td.style.color = "#c0392b"; // Rojo
                        td.style.fontWeight = "bold";
                    }
                }

                tr.appendChild(td);
            });

            tbody.appendChild(tr);
        }
        tabla.appendChild(tbody);
    })
    .catch(error => console.error("Error cargando el CSV:", error));


// 2. LÓGICA DEL BUSCADOR (FILTRO EN TIEMPO REAL)
document.getElementById("inputBusqueda").addEventListener("keyup", function() {
    const valorBusqueda = this.value.toLowerCase();
    const filas = document.querySelectorAll("#tablaProyectos tbody tr");

    filas.forEach(fila => {
        const textoFila = fila.textContent.toLowerCase();
        
        if (textoFila.includes(valorBusqueda)) {
            fila.style.display = ""; // Mostrar
        } else {
            fila.style.display = "none"; // Ocultar
        }
    });
});