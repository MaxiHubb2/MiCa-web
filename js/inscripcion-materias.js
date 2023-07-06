document.addEventListener("DOMContentLoaded", function() {
  // Obtener referencias a los elementos del DOM
  const carreraSelect = document.getElementById("carrera-select");
  const materiaSelect = document.getElementById("materia-select");
  const horarioSelect = document.getElementById("horario-select");
  const btnAgregarMateria = document.getElementById("btn-agregar-materia");
  const btnInscribir = document.getElementById("btn-inscribir");
  const seleccionesContainer = document.getElementById("selecciones-container");

  // Crear un conjunto para almacenar las materias seleccionadas
  const materiasSeleccionadas = new Set();
  // Crear un elemento de título para mostrar las materias seleccionadas
  const tituloMateriasSeleccionadas = document.createElement("h2");
  tituloMateriasSeleccionadas.innerText = "Materias seleccionadas";

  // Función que se ejecuta cuando se cambia la opción de carrera
  carreraSelect.addEventListener("change", function() {
    // Obtener el valor seleccionado en el select de carrera
    const carreraValue = carreraSelect.value;
    // Obtener las materias disponibles para la carrera seleccionada
    const materias = obtenerMateriasPorCarrera(carreraValue);

    // Limpiar los select de materia y horario
    materiaSelect.innerHTML = "<option value=''>Selecciona una materia</option>";
    horarioSelect.innerHTML = "<option value=''>Selecciona un horario</option>";

    // Si hay materias disponibles para la carrera, agregarlas al select de materia
    if (materias.length > 0) {
      materias.forEach(function(materia) {
        const materiaOption = document.createElement("option");
        materiaOption.value = materia;
        materiaOption.innerText = materia;
        materiaSelect.appendChild(materiaOption);
      });

      materiaSelect.disabled = false;
    } else {
      // Si no hay materias disponibles, mostrar un mensaje en el select de materia
      const noMateriasOption = document.createElement("option");
      noMateriasOption.innerText = "No hay materias disponibles para esta carrera";
      materiaSelect.appendChild(noMateriasOption);
      materiaSelect.disabled = true;
    }
    horarioSelect.disabled = true;

    // Obtener la materia seleccionada en el select de materia
    const selectedMateria = materiaSelect.value;
    // Habilitar o deshabilitar el botón de inscribir según si hay una materia seleccionada o no
    if (selectedMateria) {
      btnInscribir.disabled = false;
    } else {
      btnInscribir.disabled = true;
    }
  });

  // Función que se ejecuta cuando se cambia la opción de materia
  materiaSelect.addEventListener("change", function() {
    // Obtener la materia seleccionada en el select de materia
    const selectedMateria = materiaSelect.value;

    // Si hay una materia seleccionada
    if (selectedMateria) {
      // Obtener los horarios disponibles para la materia seleccionada
      const horarios = obtenerHorariosPorMateria(selectedMateria);

      // Limpiar el select de horario
      horarioSelect.innerHTML = "<option value=''>Selecciona un horario</option>";

      // Si hay horarios disponibles, agregarlos al select de horario y mostrar la caja de horarios
      if (horarios.length > 0) {
        horarios.forEach(function(horario) {
          const horarioOption = document.createElement("option");
          horarioOption.value = horario;
          horarioOption.innerText = horario;
          horarioSelect.appendChild(horarioOption);
        });

        // Habilitamos la caja de horarios
        horarioSelect.disabled = false;

        // Mostramos la caja de horarios
        const cajaHorario = document.querySelector(".cajita-horario");
        cajaHorario.classList.remove("oculto");
      } else {
        const noHorariosOption = document.createElement("option");
        noHorariosOption.innerText = "No hay horarios disponibles para esta materia";
        horarioSelect.appendChild(noHorariosOption);

        // Deshabilitamos la caja de horarios
        horarioSelect.disabled = true;

        // Ocultamos la caja de horarios
        const cajaHorario = document.querySelector(".cajita-horario");
        cajaHorario.classList.add("oculto");
      }
    } else {
      // Si no hay materia seleccionada, deshabilitamos y ocultamos la caja de horarios
      horarioSelect.innerHTML = "<option value='' selected>Elige una materia primero</option>";
      horarioSelect.disabled = true;
      const cajaHorario = document.querySelector(".cajita-horario");
      cajaHorario.classList.add("oculto");
    }

      btnInscribir.disabled = true;
    }
  );

  // Listener para el botón "Agregar Materia"
btnAgregarMateria.addEventListener("click", function() {
  // Obtener los valores seleccionados de carrera, materia y horario
  const selectedCarrera = carreraSelect.value;
  const selectedMateria = materiaSelect.value;
  const selectedHorario = horarioSelect.value;

  // Verificar si se han seleccionado todos los campos necesarios
  if (selectedCarrera && selectedMateria && selectedHorario) {
    const materia = selectedMateria;
    const horario = selectedHorario;

    // Verificar si la materia ya ha sido seleccionada con el mismo horario
    if (materiasSeleccionadas.has(materia) && horarioSeleccionado(materia, horario)) {
      alert("La materia con el mismo horario ya ha sido seleccionada.");
      return;
    } else if (horarioSeleccionado(materia, horario)) {
      alert("El horario ya ha sido seleccionado para otra materia.");
      return;
    }

    const carrera = selectedCarrera.replace(/_/g, " ");

    // Crear la selección de carrera, materia y horario
    const seleccion = crearSeleccion(carrera, materia, horario);

    // Obtener la columna correspondiente a la carrera seleccionada
    const columna = getCarreraColumna(selectedCarrera);

    // Obtener la selección anterior y el mensaje de sin materias
    const seleccionAnterior = columna.querySelector(".seleccion");
    const mensajeSinMaterias = columna.querySelector(".mensaje-sin-materias");

    // Mostrar o ocultar elementos según corresponda
    if (!seleccionAnterior) {
      columna.querySelector(".titulo-columna").classList.remove("hide");

      if (mensajeSinMaterias) {
        mensajeSinMaterias.classList.add("hide");
      }
    }

    // Agregar la selección a la columna
    columna.appendChild(seleccion);

    // Agregar la materia al conjunto de materias seleccionadas
    materiasSeleccionadas.add(materia);

    // Limpiar los campos de selección de materia y horario
    materiaSelect.value = "";
    horarioSelect.value = "";

    // Habilitar el botón de inscribir
    btnInscribir.disabled = false;

    // Mostrar el contenedor de selecciones
    document.querySelector("#selecciones-container").style.display = "grid";
  } else {
    alert("Debes seleccionar una carrera, materia y horario.");
  }
});

 // Obtener la columna correspondiente a una carrera
function getCarreraColumna(carrera) {
  if (carrera === "Tecnicatura_En_Desarrollo_De_Apps") {
    return document.getElementById("columna-apps");
  } else if (carrera === "Tecnicatura_En_Desarrollo_Web") {
    return document.getElementById("columna-web");
  }
  return null;
}

 // Listener para el evento "click" en cualquier parte del documento
document.addEventListener("click", function(event) {
  const target = event.target;
  
  // Verificar si se ha hecho clic en el botón de eliminar
  if (target.classList.contains("btn-eliminar")) {
    const seleccion = target.parentElement;
    const columna = seleccion.parentElement;
    
    // Eliminar la selección de la columna
    columna.removeChild(seleccion);

    // Obtener las materias restantes en la columna y el mensaje de sin materias
    const materiasEnColumna = columna.getElementsByClassName("seleccion");
    const mensajeSinMaterias = columna.querySelector(".mensaje-sin-materias");
    
    // Verificar si ya no hay materias en la columna y mostrar el mensaje de sin materias
    if (materiasEnColumna.length === 0 && mensajeSinMaterias) {
      mensajeSinMaterias.classList.remove("hide");
    }
    
    // Obtener el nombre de la materia eliminada
    const materia = seleccion.querySelector(".nombre-materia").innerText;
    
    // Eliminar la materia del conjunto de materias seleccionadas
    materiasSeleccionadas.delete(materia);
    
    // Verificar si ya no hay materias seleccionadas en ninguna columna
    if (materiasSeleccionadas.size === 0) {
      // Deshabilitar el botón de inscribir
      btnInscribir.disabled = true;
      
      // Ocultar el contenedor de selecciones
      document.querySelector("#selecciones-container").style.display = "none";
    }
  }
});





  //Desde este boton se genera el archivo pdf
  
  btnInscribir.addEventListener("click", function() {
    const selecciones = seleccionesContainer.getElementsByClassName("seleccion");
  
    if (selecciones.length > 0) {
      const seleccionesArray = Array.from(selecciones);
      const carreras = [];
      const materias = [];
      const horarios = [];
  
      seleccionesArray.forEach(function(seleccion) {
        const carrera = seleccion.getAttribute("data-carrera");
        const materia = seleccion.getAttribute("data-materia");
        const horario = seleccion.getAttribute("data-horario");
  
        carreras.push(carrera);   // Agrega la carrera actual al array de carreras
        materias.push(materia);   // Agrega la materia actual al array de materias
        horarios.push(horario);   // Agrega el horario actual al array de horarios
      });

      generarPDFInscripcion(carreras, materias, horarios); // Genera el PDF de inscripción con los datos seleccionados

      seleccionesContainer.innerHTML = "";  // Limpia el contenedor de selecciones
  
      materiasSeleccionadas.clear();  // Limpia el conjunto de materias seleccionadas
  
      btnInscribir.disabled = true;  // Deshabilita el botón de inscripción
  
      document.querySelector("#selecciones-container").style.display = "none";  // Oculta el contenedor de selecciones
  
    } else {
      alert("Debes seleccionar al menos una materia antes de generar el PDF de inscripción.");
    }
  });

  function generarPDFInscripcion(carreras, materias, horarios) {
    const docDefinition = {
      content: [
        { text: "Materias inscriptas", style: "header" }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center'
        },
        subheader: {
          fontSize: 14,
          bold: true,
          margin: [0, 10, 0, 5]
        },
        leyenda: {
          fontSize: 12,
          margin: [0, 10, 0, 10],
          alignment: 'center'
        },
        body: {
          fontSize: 14,
          margin: [0, 0, 0, 10]
        }
      }
    };
    const leyenda = {
      text: "Maximiliano Rabenko te has inscripto a estas materias. Te pedimos aguardar a la fecha de la verificación de materias para conocer el aula asignada.\n\nGuarda este pdf como comprobante de inscripción!",
      style: "leyenda",
      margin: [0, 20, 0, 10]
    };
  
    const materiasSeleccionadas = [];
  
    carreras.forEach(function(carrera, index) {
      materiasSeleccionadas.push(
        { text: `Carrera: ${carrera}`, style: "subheader" },   // Agrega la carrera actual al array de materias seleccionadas
        { text: `Materia: ${materias[index]}`, style: "body" },   // Agrega la materia actual al array de materias seleccionadas
        { text: `Horario: ${horarios[index]}`, style: "body" }   // Agrega el horario actual al array de materias seleccionadas
      );
    });
  
    docDefinition.content.push(...materiasSeleccionadas, leyenda);   // Agrega las materias seleccionadas y la leyenda al contenido del documento
  
    pdfMake.createPdf(docDefinition).download("Inscripcion exitosa!");   // Descarga el PDF generado
  }

// hasta aca



function obtenerMateriasPorCarrera(carrera) {
  const materiasPorCarrera = {
    "Tecnicatura_En_Desarrollo_Web": ["Programación I", "Programación II", "Bases de Datos", "Diseño Web"],
    "Tecnicatura_En_Desarrollo_De_Apps": ["Programación Móvil", "Diseño de Interfaces", "Informatica"]
  };

  return materiasPorCarrera[carrera] || [];
}

function obtenerHorariosPorMateria(materia) {
  const horariosPorMateria = {
    "Programación I": ["Lunes 8:00 - 10:00", "Miércoles 10:00 - 12:00"],
    "Programación II": ["Martes 14:00 - 16:00", "Jueves 16:00 - 18:00"],
    "Bases de Datos": ["Lunes 10:00 - 12:00", "Miércoles 14:00 - 16:00"],
    "Diseño Web": ["Martes 10:00 - 12:00", "Jueves 10:00 - 12:00"],
    "Programación Móvil": ["Viernes 8:00 - 10:00", "Sábado 10:00 - 12:00"],
    "Diseño de Interfaces": ["Viernes 10:00 - 12:00", "Sábado 8:00 - 10:00"],
    "Informatica": ["Viernes 14:00 - 16:00", "Sábado 12:00 - 14:00"]
  };

  return horariosPorMateria[materia] || [];
}



function crearSeleccion(carrera, materia, horario) {
  const seleccion = document.createElement("div");
  seleccion.className = "seleccion";
  seleccion.setAttribute("data-carrera", carrera);
  seleccion.setAttribute("data-materia", materia);
  seleccion.setAttribute("data-horario", horario);

  const btnEliminar = document.createElement("button");
  btnEliminar.className = "btn-eliminar";
  btnEliminar.innerHTML = "<i class='fas fa-trash-alt trash-icon'></i>";
  btnEliminar.style.color = "red";
  btnEliminar.addEventListener("click", function() {
    seleccion.remove();
    materiasSeleccionadas.delete(materia);
  });

  const seleccionText = document.createElement("span");
  seleccionText.innerText = `${materia} - ${horario}`;

  seleccion.appendChild(seleccionText);
  seleccion.appendChild(btnEliminar);

  return seleccion;
}


function horarioSeleccionado(materia, horario) {
  const selecciones = seleccionesContainer.getElementsByClassName("seleccion");
  const seleccionesArray = Array.from(selecciones);
  
  for (let i = 0; i < seleccionesArray.length; i++) {
    const seleccion = seleccionesArray[i];
    const seleccionMateria = seleccion.getAttribute("data-materia");
    const seleccionHorario = seleccion.getAttribute("data-horario");
    
    if (materia === seleccionMateria && horario === seleccionHorario) {
      return true;
    }
  }

  return false;
}

seleccionesContainer.appendChild(tituloMateriasSeleccionadas);

document.querySelector('.avatar img').addEventListener('click', function() {
  document.querySelector('.avatar-text').classList.toggle('show');
});

function actualizarMaterias() {
  const carreraValue = carreraSelect.value;
  const materias = obtenerMateriasPorCarrera(carreraValue);

  materiaSelect.innerHTML = "<option value=''>Selecciona una materia</option>";
  horarioSelect.innerHTML = "<option value=''>Selecciona un horario</option>";

  if (materias.length > 0) {
    materias.forEach(function(materia) {
      const materiaOption = document.createElement("option");
      materiaOption.value = materia;
      materiaOption.innerText = materia;
      materiaSelect.appendChild(materiaOption);
    });

    materiaSelect.disabled = false;
  } else {
    const noMateriasOption = document.createElement("option");
    noMateriasOption.innerText = "No hay materias disponibles para esta carrera";
    materiaSelect.appendChild(noMateriasOption);
    materiaSelect.disabled = true;
  }
  horarioSelect.disabled = true;

  const selectedMateria = materiaSelect.value;
  if (selectedMateria) {
    btnInscribir.disabled = false;
  } else {
    btnInscribir.disabled = true;
  }
}

// Evento para actualizar las materias cuando se cambia la opción de la carrera seleccionada
carreraSelect.addEventListener("change", actualizarMaterias);

// Llamar a la función al cargar la página
actualizarMaterias();


// Evento DOMContentLoaded para ejecutar el código cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", function() {
  const carreraSelect = document.getElementById("carrera-select");
  const materiaSelect = document.getElementById("materia-select");
  const horarioSelect = document.getElementById("horario-select");
  
  // Agregar efecto hover a las opciones del select carreraSelect
  carreraSelect.addEventListener("mouseover", function() {
    addHoverEffect(materiaSelect);
    addHoverEffect(horarioSelect);
  });

  carreraSelect.addEventListener("mouseout", function() {
    removeHoverEffect(materiaSelect);
    removeHoverEffect(horarioSelect);
  });

  // Función para agregar el efecto hover a las opciones de un select
  function addHoverEffect(selectElement) {
    const options = selectElement.options;
    let delay = 0;

    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      option.addEventListener("mouseover", function() {
        setTimeout(function() {
          option.style.backgroundColor = "violet";
        }, delay);
        delay += 300;
      });
      option.addEventListener("mouseout", function() {
        option.style.backgroundColor = "";
      });
    }
  }

  // Función para quitar el efecto hover de las opciones de un select
  function removeHoverEffect(selectElement) {
    const options = selectElement.options;
    for (let i = 0; i < options.length; i++) {
      const option = options[i];
      option.style.backgroundColor = "";
    }
  }
});

});


// Función para cerrar sesión y redirigir a la página "index.html"
function cerrarSesion() {
  window.location.href = "index.html";
}
// Evento para actualizar el texto en función del ancho de la ventana
window.addEventListener('resize', function() {
  var textoInscripcion = document.querySelector('.content .article-inscripcion-materia p');
  var windowWidth = window.innerWidth;
  if (windowWidth >= 150 && windowWidth <= 460) {
    textoInscripcion.textContent = 'Carreras Inscriptx';
  } else {
    textoInscripcion.textContent = 'Podes inscribirte a las materias según tu carrera';
  }
});

document.addEventListener('DOMContentLoaded', function() {
// Obtenemos la referencia al elemento .mi-carrera-text
const miCarreraText = document.querySelector('.mi-carrera-text');

// Función para actualizar el texto del elemento miCarreraText
function actualizarTextoMiCarrera(texto) {
  miCarreraText.textContent = texto;
}

// Actualizamos el texto al cargar la página
actualizarTextoMiCarrera('Mi Carrera - Inscripción a materias');

if (window.innerWidth >= 600) {
  inscripcionMateriasLink.addEventListener('click', function() {
    actualizarTextoMiCarrera('Mi Carrera - Inscripción a materias');
  });
}

});