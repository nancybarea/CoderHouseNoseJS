const socket = io(); // Ya podemos empezar a usar los sockets desde el cliente

//*******************************************************
//FUNCIONES
//GETDATA --> devuelve un objeto con todos los productos 
async function getData (url) {
    console.log("INICIO getData")
    try{
        const rtaFech = await fetch(url);
        if (!rtaFech.ok){
            throw{error: rtaFech.status, statusText: rtaFech.statusText}
        }
        let rtaObjeto = await rtaFech.json();
        return rtaObjeto;
    }
    catch(error){
        console.error(error)
    }
  }

//POSDATA --> devuelve un objeto con el producto nuevo + id asignado.
async function postData (url,data) {
    console.log("INICIO postData");
    console.log("postData: llamada x fetch a POST url");
    try{
    // Opciones por defecto estan marcadas con un *
    const response = await fetch(url, {
      method: "POST", // *GET, POST, PUT, DELETE, etc.
      headers: { "Content-Type": "application/json; charset=utf-8"},
      body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    let respuesta = await response.json();
    console.log("postData: respuesta con id asignado al producto");
    console.log(respuesta);
    return respuesta.error != undefined ?  respuesta : {error: "error en funcion postData al querer agregar el nuevo producto"};
    }
    catch(error){
        console.error(error);
    }
  }

//ADDMESSAGE --> boton agregar producto ---> obtiene datos del form, llama posdata y manda msg al Server.js y vacia form
async function addMessage(e){
    console.log("INICIO addMessage");
    // cancela el evento de submit
    e.preventDefault(); 
    // obtengo los datos ingresados en el formulario
    let nuevoMensaje = {
        title: document.getElementById("nombre").value,
        price: document.getElementById("precio").value,
        thumbnail: document.getElementById("fotoUrl").value
    };
    console.log("addMessage: obtengo los datos del nuevo producto:");
    console.log(nuevoMensaje)
    //llamo a fx postData para que me genere id al nuevo producto
    console.log("addMessage: llama a la funcion postData");
    let rtaAgregarProducto = await postData('api/productos', nuevoMensaje);
    rtaAgregarProducto != null ? socket.emit("msgNuevoProducto", {status: "ok"}) : socket.emit("msgNuevoProducto", {status: "no ok"});
    //borro los datos del formulario y lo vuelvo a dejar vacio
    document.getElementById("nombre").value="";
    document.getElementById("precio").value="";
    document.getElementById("fotoUrl").value="";
}

//RENDERLISTADOPRODUCTOS --> actualiza listado de productos
async function renderListadoProductos(data) {
    console.log("INICIO renderListadoProductos (index.js): actualizar listado productos en pantalla")
    console.log(data);
    //let rtaAgregarProducto = await getData('api/productos');
    //console.log("RETORNO renderListadoProductos (index.js): rta de getData")
    //console.log(rtaAgregarProducto);
    //rtaAgregarProducto != null ? socket.emit("msgNuevoProducto", {status: "ok"}) : socket.emit("msgNuevoProducto", {status: "no ok"});
}


//*******************************************************
//Detecta cuando clickean el boton submit con id=altaProducto
window.addEventListener("DOMContentLoaded", async () => {    
    console.log("LOG addEventListener: inicio") 
    let altaProducto = document.getElementById("altaProducto");
    altaProducto.addEventListener("click", addMessage);    
})
  
//*******************************************************
// Cliente
socket.on('msgTodosProductos', data => {
    console.log("INICIO socket.on - msgTodosProductos (index.js)");
    console.log("listado productos: ");
    console.log(data);
    console.log("Actualizar datos del listado");
    renderListadoProductos(data);
})





