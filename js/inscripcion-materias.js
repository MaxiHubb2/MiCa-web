document.addEventListener("DOMContentLoaded", function() {
  const carreraRadios = document.getElementsByName("carrera");
  const materiaOptions = document.getElementById("materia-options");
  const horarioOptions = document.getElementById("horario-options");
  const btnAgregarMateria = document.getElementById("btn-agregar-materia");
  const btnInscribir = document.getElementById("btn-inscribir");
  const seleccionesContainer = document.getElementById("selecciones-container");
  const materiasSeleccionadas = new Set();
  const tituloMateriasSeleccionadas = document.createElement("h2");

  tituloMateriasSeleccionadas.innerText = "Materias seleccionadas";

  for (let i = 0; i < carreraRadios.length; i++) {
    carreraRadios[i].addEventListener("change", function() {
      const carreraValue = carreraRadios[i].value;
      const materias = obtenerMateriasPorCarrera(carreraValue);

      materiaOptions.innerHTML = "";
      horarioOptions.innerHTML = "";

      if (materias.length > 0) {
        materias.forEach(function(materia) {
          const materiaOption = document.createElement("label");
          materiaOption.innerHTML = `<input type="radio" name="materia" value="${materia}" required>${materia}`;
          materiaOptions.appendChild(materiaOption);
        });

        materiaOptions.disabled = false;
      } else {
        const noMateriasOption = document.createElement("label");
        noMateriasOption.innerText = "No hay materias disponibles para esta carrera";
        materiaOptions.appendChild(noMateriasOption);
        materiaOptions.disabled = true;
      }

      const selectedMateria = materiaOptions.querySelector("input[name='materia']:checked");
      if (selectedMateria) {
        btnInscribir.disabled = false;
      } else {
        btnInscribir.disabled = true;
      }
    });
  }

  materiaOptions.addEventListener("change", function() {
    const selectedMateria = materiaOptions.querySelector("input[name='materia']:checked");

    if (selectedMateria) {
      const horarios = obtenerHorariosPorMateria(selectedMateria.value);

      horarioOptions.innerHTML = "";

      if (horarios.length > 0) {
        horarios.forEach(function(horario) {
          const horarioOption = document.createElement("label");
          horarioOption.innerHTML = `<input type="radio" name="horario" value="${horario}" required>${horario}`;
          horarioOptions.appendChild(horarioOption);
        });

        horarioOptions.disabled = false;
      } else {
        const noHorariosOption = document.createElement("label");
        noHorariosOption.innerText = "No hay horarios disponibles para esta materia";
        horarioOptions.appendChild(noHorariosOption);
        horarioOptions.disabled = true;
      }

      btnInscribir.disabled = true;
    }
  });

  btnAgregarMateria.addEventListener("click", function() {
    const selectedCarrera = document.querySelector("input[name='carrera']:checked");
    const selectedMateria = document.querySelector("input[name='materia']:checked");
    const selectedHorario = document.querySelector("input[name='horario']:checked");

    if (selectedCarrera && selectedMateria && selectedHorario) {
      const materia = selectedMateria.value;
      const horario = selectedHorario.value;

      if (materiasSeleccionadas.has(materia) && horarioSeleccionado(materia, horario)) {
        alert("La materia con el mismo horario ya ha sido seleccionada.");
        return;
      } else if (horarioSeleccionado(materia, horario)) {
        alert("El horario ya ha sido seleccionado para otra materia.");
        return;
      }

      const carrera = selectedCarrera.value.replace(/_/g, " ");
      const seleccion = crearSeleccion(carrera, materia, horario);
      seleccionesContainer.appendChild(seleccion);

      materiasSeleccionadas.add(materia);

      selectedMateria.checked = false;
      selectedHorario.checked = false;

      btnInscribir.disabled = false;
    }
  });

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
      "Tecnicatura_En_Desarrollo_De_Apps": ["Programación Móvil", "Diseño de Interfaces", "Desarrollo de Aplicaciones Híbridas"]
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
      "Desarrollo de Aplicaciones Híbridas": ["Viernes 14:00 - 16:00", "Sábado 12:00 - 14:00"]
    };

    return horariosPorMateria[materia] || [];
  }

  function generarPDFInscripcion(carreras, materias, horarios) {
    const docDefinition = {
      content: [
        { text: "Formulario de Inscripción", style: "header" },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };

    carreras.forEach(function(carrera, index) {
      docDefinition.content.push(
        { text: `Carrera ${index + 1}: ${carrera}`, style: "subheader" },
        { text: `Materia: ${materias[index]}`, style: "body" },
        { text: `Horario: ${horarios[index]}`, style: "body" },
        { text: "", margin: [0, 0, 0, 10] }
      );
    });

    pdfMake.createPdf(docDefinition).download("formulario_inscripcion.pdf");
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
    seleccionText.innerText = `${carrera} - ${materia} - ${horario}`;

    seleccion.appendChild(btnEliminar);
    seleccion.appendChild(seleccionText);

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


});
