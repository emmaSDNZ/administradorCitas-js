//variables html
const mascotaInput      = document.querySelector('#mascota')
const propietarioInput  = document.querySelector('#propietario')
const telefonoInput     = document.querySelector('#telefono')
const fechaInput        = document.querySelector('#fecha')
const horaInput         = document.querySelector('#hora')
const sintomasInput     = document.querySelector('#sintomas')


//interfaz de usuario
const formulario        = document.querySelector('#nueva-cita')
const contenedorCitas   = document.querySelector('#citas');

let editando;

//eventos
eventListener()
function eventListener(){
    mascotaInput.addEventListener('input', datosCitas)
    propietarioInput.addEventListener('input', datosCitas)
    telefonoInput.addEventListener('input', datosCitas)
    fechaInput.addEventListener('input', datosCitas)
    horaInput.addEventListener('input', datosCitas)
    sintomasInput.addEventListener('input', datosCitas)

    formulario.addEventListener('submit', nuevaCita);
}


//CLASES
class Citas{
    constructor(){
        this.citas = []
    }

    agregarCita(cita){
        this.citas= [...this.citas, cita]
    }

    eliminarCita(id){
        this.citas = this.citas.filter(cita => cita.id !== id)
    }
    editarCita(citaActualizada){ 
        this.citas = this.citas.map( cita => cita.id === citaActualizada.id ? citaActualizada : cita)
     }
}

class UI{

    imprimirAlerta(mensaje, tipo){
        //crear el div
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert', 'd-block', 'col-12');

        //agregar clase en base al tipo error
        if(tipo === 'error'){
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
    
        }
        //mensaje de error en el html
        divMensaje.textContent = mensaje

        //agregamos al dom
        document.querySelector('#contenido').insertBefore(divMensaje, document.querySelector('.agregar-cita'));

        //quitamos la alerta
        setTimeout(() => {  divMensaje.remove() }, 2000)
    }
    

    imprimirCitas( {citas} ){

        this.limpiarHTML();
        
        citas.forEach( cita =>{
            const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;

            const divCita = document.createElement('div');
            divCita.classList.add('cita', 'p-3');
            divCita.dataset.id = id;

            //scripting de los elementos de la cita
            const mascotaParrado = document.createElement('h2');
            mascotaParrado.classList.add('card-title', 'font-weight-bolder');
            mascotaParrado.textContent = mascota;

            const propietarioParrafo = document.createElement('p');
            propietarioParrafo.innerHTML= `
                <span class="font-weight-dolder"> Propietario: </span> ${propietario}
            `
            const telefonoParrafo = document.createElement('p');
            telefonoParrafo.innerHTML= `
                <span class="font-weight-dolder"> Telefono: </span> ${telefono}
            `
            const fechaParrafo = document.createElement('p');
            fechaParrafo.innerHTML= `
                <span class="font-weight-dolder"> Fecha: </span> ${fecha}
            `

            const horaParrafo = document.createElement('p');
            horaParrafo.innerHTML= `
                <span class="font-weight-dolder"> Hora: </span> ${hora}
            `

            const sintomasParrafo = document.createElement('p');
            sintomasParrafo.innerHTML= `
                <span class="font-weight-dolder"> Sintomas: </span> ${sintomas}
            `

            //boton para eliminar cita
            const btnElimnar  = document.createElement('button');
            btnElimnar.classList.add('btn', 'btn-danger', 'mr-2');
            btnElimnar.innerHTML = 'Eliminar';

            btnElimnar.onclick = ()  => eliminarCita(id)

            //añadir boton para editar
            const btnEditar  = document.createElement('button');
            btnEditar.classList.add('btn', 'btn-info');
            btnEditar.innerHTML = 'Editar';
            btnEditar.onclick = () => cargarEdicion(cita)

            //agregar los parrados al divCitas
            divCita.appendChild(mascotaParrado);
            divCita.appendChild(propietarioParrafo);
            divCita.appendChild(telefonoParrafo);
            divCita.appendChild(fechaParrafo);
            divCita.appendChild(horaParrafo);
            divCita.appendChild(sintomasParrafo);
            divCita.appendChild(btnElimnar);
            divCita.appendChild(btnEditar);



            //agregar citas al html
            contenedorCitas.appendChild(divCita);

        })
    }

    limpiarHTML(){
        while(contenedorCitas.firstChild){
            contenedorCitas.removeChild(contenedorCitas.firstChild);
        }
    }

}

const ui = new UI();
const administrarCitas = new Citas()


//objeto con la info de la cita
const citaObj = {
    mascota: '',
    propietario: '',
    telefono: '',
    fecha: '',
    hora: '',
    sintomas: '',
}


//agrega datos al objeto de citas 
function datosCitas(e){

    citaObj[e.target.name] = e.target.value
   
}


//valida y agrega una nueva cita a la clase cita
function nuevaCita(e){
    e.preventDefault();

    //estramos la info del objeto citas
    const { mascota, propietario, telefono, fecha, hora, sintomas} = citaObj;

    //validar 
    if(mascota === '' || propietario === '' || telefono === '' || fecha === '' || hora === '' || sintomas === ''){
        ui.imprimirAlerta('Todos los campos son obligatorios', 'error')
        
        return;
    }  


    if(editando){
        //modo edicion
        ui.imprimirAlerta('Editado correctamente')

        //pasar el objeto de la cita
        administrarCitas.editarCita({...citaObj})

        //regresar el texto del boton al texto original
        formulario.querySelector('button[type="submit"]').textContent = 'Crear Cita';

        //quitando edicion
        editando = false;

    }else {
        //modo nueva cita

        
        //generamos un id por cada cita
        citaObj.id = Date.now()

        //creamos una nueva cita
        administrarCitas.agregarCita( {...citaObj} );

        //mensaje de agregado correctamente
        ui.imprimirAlerta('Se agrego correctamente')

    }


    
    //reiniciamos el objeto para la validacion
    reiniciarObjeto()

    //REINICIAMOS EL FORMULARIO
    formulario.reset()

    //mostrat html de citas
    ui.imprimirCitas(administrarCitas)

}

function reiniciarObjeto(){

    citaObj.mascota= '';
    citaObj.propietario= '';
    citaObj.telefono= '';
    citaObj.fecha= '';
    citaObj.hora= '';
    citaObj.sintomas= '';

}

function eliminarCita(id){
    console.log(id);
    //elimnar cita
    administrarCitas.eliminarCita(id);

    //mostras msj
    ui.imprimirAlerta('La cita se elimino de forma correcta')

    //reset citas
    ui.imprimirCitas(administrarCitas)    
}

//CARGA LOS DATOS PARA MODO EDICION
function cargarEdicion(cita) {
    const { mascota, propietario, telefono, fecha, hora, sintomas, id} = cita;
    console.log(cita);
    //llenar inputs
    mascotaInput.value = mascota;
    propietarioInput.value = propietario;
    telefonoInput.value = telefono;
    fechaInput.value = fecha;
    horaInput.value = hora;
    sintomasInput.value = sintomas;

    //llenar el objeto
    citaObj.mascota = mascota;
    citaObj.propietario = propietario;
    citaObj.telefono = telefono;
    citaObj.fecha = fecha;
    citaObj.hora = hora;
    citaObj.sintomas = sintomas;
    citaObj.id = id;

    console.log(citaObj);
    //cambiar texto del btn
    formulario.querySelector('button[type="submit"]').textContent = 'Guardar Cambios';

    editando = true;

}