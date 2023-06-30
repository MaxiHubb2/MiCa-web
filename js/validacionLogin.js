
function validar() {
    let error = false;
    let mensajeDeError = "";

    if (document.getElementById("Nombre de usuario").value == '') {
        error = true;
        mensajeDeError += "<p><br>El nombre de usuario no puede estar vacío</p>"
        localStorage.setItem("nombre", document.getElementById("Nombre de usuario"));

    } if (document.getElementById("Contraseña").value == '') {
        error = true;
        mensajeDeError += "<p><br>La contraseña no puede estar vacía</p>"
    }
    
    if (error) {
        document.getElementById("mensaje").innerHTML = mensajeDeError;
        return false;

    } else {
            return true;
        
        }
    
}

$('#submit').click(function(){

    if(validar()){
        window.location.assign("home.html");
    }
    
  
  });