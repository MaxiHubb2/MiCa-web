document.addEventListener("DOMContentLoaded", function() {
  const carreraRadios = document.getElementsByName("carrera");
  const materiaOptions = document.getElementById("materia-options");
  const horarioOptions = document.getElementById("horario-options");
  const btnInscribir = document.getElementById("btn-inscribir");

  // Agregar evento de cambio a los radios de carrera
  for (let i = 0; i < carreraRadios.length; i++) {
    carreraRadios[i].addEventListener("change", function() {
      const carreraValue = carreraRadios[i].value;

      // Obtener las materias según la carrera seleccionada
      const materias = obtenerMateriasPorCarrera(carreraValue);

      // Limpiar las opciones de materias y horarios
      materiaOptions.innerHTML = "";
      horarioOptions.innerHTML = "";

      // Crear opciones de materias
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

      // Deshabilitar el botón de inscripción
      btnInscribir.disabled = true;
    });
  }

  materiaOptions.addEventListener("change", function() {
    const selectedMateria = materiaOptions.querySelector("input[name='materia']:checked");

    if (selectedMateria) {
      const horarios = obtenerHorariosPorMateria(selectedMateria.value);

      // Limpiar las opciones de horarios
      horarioOptions.innerHTML = "";

      // Crear opciones de horarios
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

      // Deshabilitar el botón de inscripción
      btnInscribir.disabled = true;
    }
  });

  horarioOptions.addEventListener("change", function() {
    const selectedHorario = horarioOptions.querySelector("input[name='horario']:checked");

    if (selectedHorario) {
      // Habilitar el botón de inscripción
      btnInscribir.disabled = false;
    } else {
      // Deshabilitar el botón de inscripción
      btnInscribir.disabled = true;
    }
  });

  btnInscribir.addEventListener("click", function() {
    const selectedCarrera = document.querySelector("input[name='carrera']:checked");
    const selectedMateria = document.querySelector("input[name='materia']:checked");
    const selectedHorario = document.querySelector("input[name='horario']:checked");

    if (selectedCarrera && selectedMateria && selectedHorario) {
      // Generar el PDF de inscripción
      generarPDFInscripcion(selectedCarrera.value, selectedMateria.value, selectedHorario.value);
    }
  });

  function obtenerMateriasPorCarrera(carrera) {
    // Aquí puedes hacer una llamada a una API o acceder a una base de datos para obtener las materias según la carrera seleccionada
    // Por ahora, usaremos datos de ejemplo

    const materiasPorCarrera = {
      "Tecnicatura_En_Desarrollo_Web": ["Programación I", "Programación II", "Bases de Datos", "Diseño Web"],
      "Tecnicatura_En_Desarrollo_De_Apps": ["Programación Móvil", "Diseño de Interfaces", "Desarrollo de Aplicaciones Híbridas"]
    };

    return materiasPorCarrera[carrera] || [];
  }

  function obtenerHorariosPorMateria(materia) {
    // Aquí puedes hacer una llamada a una API o acceder a una base de datos para obtener los horarios según la materia seleccionada
    // Por ahora, usaremos datos de ejemplo

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

  function generarPDFInscripcion(carrera, materia, horario) {
    const docDefinition = {
      content: [
        { text: "Formulario de Inscripción", style: "header" },
        { text: "Carrera: " + carrera },
        { text: "Materia: " + materia },
        { text: "Horario: " + horario },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10]
        }
      }
    };

    pdfMake.createPdf(docDefinition).download("formulario_inscripcion.pdf");
  }
});
