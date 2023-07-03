function cerrarSesion() {
    window.location.href = "index.html";
  }
  
  document.querySelector('.avatar img').addEventListener('click', function() {
    document.querySelector('.avatar-text').classList.toggle('show');
  });
