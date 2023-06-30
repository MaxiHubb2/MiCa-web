document.addEventListener("DOMContentLoaded", function() {
  const carreraSelect = document.getElementById("carrera-select");
  const materiaSelect = document.getElementById("materia-select");
  const horarioSelect = document.getElementById("horario-select");
  const btnAgregarMateria = document.getElementById("btn-agregar-materia");
  const btnInscribir = document.getElementById("btn-inscribir");
  const seleccionesContainer = document.getElementById("selecciones-container");
  
  const materiasSeleccionadas = new Set();
  const tituloMateriasSeleccionadas = document.createElement("h2");

  tituloMateriasSeleccionadas.innerText = "Materias seleccionadas";

  carreraSelect.addEventListener("change", function() {
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

     });

  materiaSelect.addEventListener("change", function() {
    const selectedMateria = materiaSelect.value;

    if (selectedMateria) {
      const horarios = obtenerHorariosPorMateria(selectedMateria);

      horarioSelect.innerHTML = "<option value=''>Selecciona un horario</option>";

      if (horarios.length > 0) {
        horarios.forEach(function(horario) {
          const horarioOption = document.createElement("option");
          horarioOption.value = horario;
          horarioOption.innerText = horario;
          horarioSelect.appendChild(horarioOption);
        });

        horarioSelect.disabled = false;
      } else {
        const noHorariosOption = document.createElement("option");
        noHorariosOption.innerText = "No hay horarios disponibles para esta materia";
        horarioSelect.appendChild(noHorariosOption);
        horarioSelect.disabled = true;
      }

      btnInscribir.disabled = true;
    }
  });

  btnAgregarMateria.addEventListener("click", function() {
    const selectedCarrera = carreraSelect.value;
    const selectedMateria = materiaSelect.value;
    const selectedHorario = horarioSelect.value;
  
    if (selectedCarrera && selectedMateria && selectedHorario) {
      const materia = selectedMateria;
      const horario = selectedHorario;
  
      if (materiasSeleccionadas.has(materia) && horarioSeleccionado(materia, horario)) {
        alert("La materia con el mismo horario ya ha sido seleccionada.");
        return;
      } else if (horarioSeleccionado(materia, horario)) {
        alert("El horario ya ha sido seleccionado para otra materia.");
        return;
      }
  
      const carrera = selectedCarrera.replace(/_/g, " ");
      const seleccion = crearSeleccion(carrera, materia, horario);
  
      const columna = getCarreraColumna(selectedCarrera);
      const seleccionAnterior = columna.querySelector(".seleccion");
      const mensajeSinMaterias = columna.querySelector(".mensaje-sin-materias");
  
      if (!seleccionAnterior) {
        columna.querySelector(".titulo-columna").classList.remove("hide");
  
        if (mensajeSinMaterias) {
          mensajeSinMaterias.classList.add("hide");
        }
      }
  
      columna.appendChild(seleccion);
      materiasSeleccionadas.add(materia);
  
      materiaSelect.value = "";
      horarioSelect.value = "";
  
      btnInscribir.disabled = false;
  
      document.querySelector("#selecciones-container").style.display = "grid";
    } else {
      alert("Debes seleccionar una carrera, materia y horario.");
    }
  });

  document.addEventListener("click", function(event) {
    const target = event.target;
    if (target.classList.contains("btn-eliminar")) {
      const seleccion = target.parentElement;
      const columna = seleccion.parentElement;
      columna.removeChild(seleccion);
  
      const materiasEnColumna = columna.getElementsByClassName("seleccion");
      const mensajeSinMaterias = columna.querySelector(".mensaje-sin-materias");
  
      if (materiasEnColumna.length === 0 && mensajeSinMaterias) {
        mensajeSinMaterias.classList.remove("hide");
      }
  
      const materia = seleccion.querySelector(".nombre-materia").innerText;
      materiasSeleccionadas.delete(materia);
  
      if (materiasSeleccionadas.size === 0) {
        btnInscribir.disabled = true;
        document.querySelector("#selecciones-container").style.display = "none";
      }
    }
  });
    
  
  
  
  function getCarreraColumna(carrera) {
    if (carrera === "Tecnicatura_En_Desarrollo_De_Apps") {
      return document.getElementById("columna-apps");
    } else if (carrera === "Tecnicatura_En_Desarrollo_Web") {
      return document.getElementById("columna-web");
    }
    return null;
  }
  

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

      carreras.push(carrera);
      materias.push(materia);
      horarios.push(horario);
    });

    generarPDFInscripcion(carreras, materias, horarios);

    seleccionesContainer.innerHTML = "";

    materiasSeleccionadas.clear();

    btnInscribir.disabled = true;
  } else {
    alert("Debes seleccionar al menos una materia antes de generar el PDF de inscripción.");
  }
});


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

  function generarPDFInscripcion(carreras, materias, horarios) {
    const docDefinition = {
      content: [
        { text: "Materias inscriptas", style: "header" },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
          alignment: 'center' // Agregar esta línea

        }
      }
    };

    carreras.forEach(function(carrera, index) {
      docDefinition.content.push(
        { text: `Carrera: ${carrera}`, style: "subheader" },
        { text: `Materia: ${materias[index]}`, style: "body" },
        { text: `Horario: ${horarios[index]}`, style: "body" },
        { text: "", margin: [0, 0, 0, 10] }
      );
    });

    pdfMake.createPdf(docDefinition).download("Inscripcion exitosa!");
  }

  function crearSeleccion(carrera, materia, horario) {
    const seleccion = document.createElement("div");
    seleccion.className = "seleccion";
    seleccion.setAttribute("data-carrera", carrera);
    seleccion.setAttribute("data-materia", materia);
    seleccion.setAttribute("data-horario", horario);
  
    const btnEliminar = document.createElement("button");
    btnEliminar.className = "btn-eliminar";
    btnEliminar.innerHTML = "&#10060;";
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
  
  carreraSelect.addEventListener("change", actualizarMaterias);
  
  // Llamar a la función al cargar la página
  actualizarMaterias();
  
  document.addEventListener("DOMContentLoaded", function() {
    const carreraSelect = document.getElementById("carrera-select");
    const materiaSelect = document.getElementById("materia-select");
    const horarioSelect = document.getElementById("horario-select");
  
    carreraSelect.addEventListener("mouseover", function() {
      addHoverEffect(materiaSelect);
      addHoverEffect(horarioSelect);
    });
  
    carreraSelect.addEventListener("mouseout", function() {
      removeHoverEffect(materiaSelect);
      removeHoverEffect(horarioSelect);
    });
  
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
  
    function removeHoverEffect(selectElement) {
      const options = selectElement.options;
      for (let i = 0; i < options.length; i++) {
        const option = options[i];
        option.style.backgroundColor = "";
      }
    }
  });
  
});