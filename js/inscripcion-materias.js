document.addEventListener("DOMContentLoaded", function() {
  
  // Definición de las materias por carrera
  const materiasPorCarrera = {
    Tecnicatura_En_Desarrollo_Web: {
      materias: ['Programacion_basica_1', 'Introduccion_al_diseño_grafico', 'Informatica_general'],
      horarios: [
        ['Martes y Jueves: 08:00 a 12:00 hs', 'Lunes y Miercoles: 19:00 a 23:00 hs'],
        ['Viernes: 08:00 a 12:00 hs', 'Jueves: 19:00 a 23:00 hs'],
        ['Lunes: 08:00 a 12:00 hs y Sabados: 14:00 a 18:00 hs']
      ],
      comisiones: ['1', '2', '3'],
    },
    Tecnicatura_En_Desarrollo_De_Apps: {
      materias: ['Programacion_avanzada', 'Diseño_de_aplicaciones_moviles', 'Base_de_datos'],
      horarios: [
        ['Lunes y Miercoles: 08:00 a 12:00 hs', 'Martes y Jueves: 19:00 a 23:00 hs'],
        ['Miercoles: 19:00 a 23:00 hs', 'Viernes: 08:00 a 12:00 hs'],
        ['Jueves: 08:00 a 12:00 hs y Sabados: 14:00 a 18:00 hs']
      ],
      comisiones: ['A', 'B', 'C'],
    },
  };

  // Obtener elementos del DOM
  const carreraSelect = document.getElementById("carrera");
  const materiaSelect = document.getElementById("materia");
  const horarioSelect = document.getElementById("horario");
  const comisionDetails = document.getElementById("comision-details");
  const agregarButton = document.getElementById("agregar");
  const seleccionList = document.getElementById("seleccion-list");
  const seleccionContainer = document.getElementById("seleccion-container");
  const inscribirseButton = document.getElementById("inscribirse");

  // Variable para almacenar las selecciones del usuario
  const selecciones = {};

  // Evento change en la selección de carrera
  carreraSelect.addEventListener("change", function () {
    // Obtener la carrera seleccionada
    const carrera = carreraSelect.value;

    // Obtener las materias correspondientes a la carrera seleccionada
    const materias = materiasPorCarrera[carrera] && materiasPorCarrera[carrera].materias || [];

    // Limpiar el listado de materias, horarios y los detalles de comisión
    materiaSelect.innerHTML = "";
    horarioSelect.innerHTML = "";
    comisionDetails.textContent = "";

    // Habilitar o deshabilitar el campo de selección de materia
    materiaSelect.disabled = carrera === "";
    horarioSelect.disabled = true;

    if (carrera === "") {
      // Agregar opción inicial en el campo de selección de materias cuando no se ha seleccionado una carrera
      const initialOption = document.createElement("option");
      initialOption.value = "";
      initialOption.text = "Elige una carrera primero";
      materiaSelect.appendChild(initialOption);
    } else {
      // Agregar opción inicial en blanco en el campo de selección de materias cuando se ha seleccionado una carrera
      const emptyOption = document.createElement("option");
      emptyOption.value = "";
      emptyOption.text = "Elige una materia";
      materiaSelect.appendChild(emptyOption);

      // Generar las opciones de materias
      for (let i = 0; i < materias.length; i++) {
        const materia = materias[i];
        const option = document.createElement("option");
        option.value = materia;
        option.text = materia.replace(/_/g, " ");
        materiaSelect.appendChild(option);
      }
    }
  });

  // Evento change en la selección de materia
  materiaSelect.addEventListener("change", function () {
    const carrera = carreraSelect.value;
    const materia = materiaSelect.value;
    const index = materiasPorCarrera[carrera] ? materiasPorCarrera[carrera].materias.indexOf(materia) : -1;

    if (index !== -1) {
      const horarios = materiasPorCarrera[carrera].horarios[index] || [];
      const comisiones = materiasPorCarrera[carrera].comisiones;

      // Limpiar el listado de horarios
      horarioSelect.innerHTML = "";

      // Habilitar o deshabilitar el campo de selección de horario
      horarioSelect.disabled = materia === "";

      // Agregar opción inicial en el campo de selección de horarios
      const initialOption = document.createElement("option");
      initialOption.value = "";
      initialOption.text = "Elige horario";
      horarioSelect.appendChild(initialOption);

      // Generar las opciones de horarios
      for (let i = 0; i < horarios.length; i++) {
        const horario = horarios[i];
        const option = document.createElement("option");
        option.value = horario;
        option.text = horario;
        horarioSelect.appendChild(option);
      }

      const comision = comisiones[index] ? comisiones[index] : "";
      comisionDetails.textContent = "Comisión: " + comision;
    } else {
      horarioSelect.innerHTML = "";
      comisionDetails.textContent = "";
    }
  });

  // Evento click en el botón "Agregar selección"
  agregarButton.addEventListener("click", function () {
    const carrera = carreraSelect.value;
    const materia = materiaSelect.value;
    const horario = horarioSelect.value;

    if (carrera !== "" && materia !== "" && horario !== "") {
      // Verificar si hay alguna selección existente en el mismo horario
      const seleccionEnMismoHorario = Object.values(selecciones).find((seleccion) => {
        return (
          seleccion.horario === horario
        );
      });

      if (seleccionEnMismoHorario) {
        alert("Ya has seleccionado otra materia en este horario");
        return;
      }

      // Crear una selección con los datos elegidos
      const seleccion = {
        carrera: carrera.replace(/_/g, " "),
        materia: materia.replace(/_/g, " "),
        horario: horario
      };

      // Agregar la selección al objeto selecciones
      const id = generarIdUnico();
      selecciones[id] = seleccion;

      // Crear un elemento de lista para mostrar la selección en el DOM
      const listItem = document.createElement("li");
      listItem.id = id;
      listItem.innerHTML = `
        <span class="cruz" onclick="eliminarSeleccion('${id}')">&#10006;</span>
        <span>${seleccion.carrera} - ${seleccion.materia} - ${seleccion.horario}</span>
      `;

      // Agregar el elemento de lista al contenedor
      seleccionList.appendChild(listItem);

      // Mostrar el contenedor de selecciones
      seleccionContainer.style.display = "block";
    } else {
      alert("Completa todos los campos");
    }
  });

  // Evento click en el botón "Inscribirse"
inscribirseButton.addEventListener("click", function () {
  // Crear un arreglo de selecciones para pdfmake
  const seleccionArray = Object.values(selecciones).map((seleccion) => {
    return [seleccion.carrera, seleccion.materia, seleccion.horario];
  });

  // Definir la estructura del documento PDF
  const docDefinition = {
    content: [
      { text: 'Inscripción a materias', style: 'header' },
      { text: 'Selecciones:', style: 'subheader' },
      {
        table: {
          headers: ['Carrera', 'Materia', 'Horario'],
          body: seleccionArray
        },
        style: 'table'
      }
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        marginBottom: 20
      },
      subheader: {
        fontSize: 14,
        bold: true,
        marginTop: 10,
        marginBottom: 10
      },
      table: {
        margin: [0, 5, 0, 15] // Margen superior, derecho, inferior e izquierdo
      }
    }
  };
  
  // Generar el PDF con pdfmake
  const pdfDoc = pdfMake.createPdf(docDefinition);
  pdfDoc.download('inscripcion_materias.pdf');
});


  // Función para generar un ID único
  function generarIdUnico() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Función para eliminar una selección
  function eliminarSeleccion(id) {
    // Eliminar la selección del objeto selecciones
    delete selecciones[id];

    // Eliminar el elemento de lista del DOM
    const listItem = document.getElementById(id);
    if (listItem) {
      seleccionList.removeChild(listItem);
    }

    // Si no hay más selecciones, ocultar el contenedor
    if (Object.keys(selecciones).length === 0) {
      seleccionContainer.style.display = "none";
    }
  }

});
