document.querySelector('.avatar img').addEventListener('click', function() {
    document.querySelector('.avatar-text').classList.toggle('show');
  });

  function cerrarSesion() {
    window.location.href = "index.html";
  }
  