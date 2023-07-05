function cerrarSesion() {
    window.location.href = "index.html";
  }
  
  document.querySelector('.avatar img').addEventListener('click', function() {
    document.querySelector('.avatar-text').classList.toggle('show');
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
      const historialAcademicoLink = document.querySelector('#historial-academico-link');
    historialAcademicoLink.addEventListener('click', function() {
      actualizarTextoMiCarrera('Mi Carrera - Historial académico');
    });
  }
  });
  