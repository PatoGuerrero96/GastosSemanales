//Variables y selectores
const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');

//eventos
eventListeners();
function eventListeners(){
    document.addEventListener('DOMContentLoaded',preguntarPresupuesto);
    formulario.addEventListener('submit', agregarGasto);
}

//clases
class Presupuesto{
    constructor(presupuesto){
        this.presupuesto = Number(presupuesto);
        this.restante= Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto){
this.gastos = [...this.gastos,gasto];
this.calcularRestante();
    }

    calcularRestante(){
        const gastado = this.gastos.reduce( (total,gasto ) => total+ gasto.cantidad, 0);
        this.restante = this.presupuesto -gastado;

    }

    eliminarGasto(id){
        this.gastos = this.gastos.filter(gasto => gasto.id !== id);
        this.calcularRestante();
    }


}

class UI{
insertarPresupuesto(cantidad){
    //extrayendo los valores
    const {presupuesto, restante } =cantidad;
    //agregar al html
    document.querySelector('#total').textContent =presupuesto;
    document.querySelector('#restante').textContent =restante;

    

}
imprimirAlerta(mensaje, tipo){
    //crear div
    const divMensaje= document.createElement('div');
    divMensaje.classList.add('text-center','alert');

    if(tipo==='error'){
        divMensaje.classList.add('alert-danger');
    }else{
        divMensaje.classList.add('alert-success');
    }
    //mensaje de error
    divMensaje.textContent= mensaje;

    //insertar en el HTML
    document.querySelector('.primario').insertBefore(divMensaje, formulario);

    //quitar del html
    setTimeout(() => {
        divMensaje.remove();
    }, 3000);


}

mostrarGastos(gastos){
    this.limparHTML();
//Iterar sobre los gastos
gastos.forEach(gasto => {

const { cantidad, nombre, id} = gasto;

//crear un li
const nuevoGasto =document.createElement('li');
nuevoGasto.className= 'list-group-item d-flex justify-content-between aling-items-center';
nuevoGasto.dataset.id=id;

//agregar el html del gasto
nuevoGasto.innerHTML = `
${nombre}
<span class="badge badge-primary ">$ ${cantidad}</span>
`;

//boton para borrar el gasto
const btnBorrar = document.createElement('button');
btnBorrar.classList.add('btn','btn-danger','borrar-gasto');
btnBorrar.innerHTML='Borrar &times;'
btnBorrar.onclick =() =>{
    eliminarGasto(id);
}
nuevoGasto.appendChild(btnBorrar)

//agregar al html
gastoListado.appendChild(nuevoGasto);

});


}

limparHTML(){
    while(gastoListado.firstChild){
        gastoListado.removeChild(gastoListado.firstChild);
    }
}
actualizarRestante(restante){
    document.querySelector('#restante').textContent =restante;
}

comprobarPresupuesto(presupuestObj){
    const {presupuesto, restante} = presupuestObj; 

    const restanteDiv = document.querySelector('.restante');
    // Comprobar 25%
    if((presupuesto / 4) > restante){
        restanteDiv.classList.remove('alert-success','alert-warning');
        restanteDiv.classList.add('alert-danger');

    } else if ((presupuesto/2 )> restante){
        restanteDiv.classList.remove('alert-success');
        restanteDiv.classList.add('alert-warning');

    } else {
        restanteDiv.classList.remove('alert-danger', 'alert-warning');
        restanteDiv.classList.add('alert-success');
    }

    // si el total es menor a 0;

    if(restante<=0){
        ui.imprimirAlerta('Se agoto el presupuesto','error');
    }
}
}

//instanciar
const ui = new UI();
let presupuesto;

//funciones

function preguntarPresupuesto(){
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');
    console.log(Number(presupuestoUsuario));

    if(presupuestoUsuario ===''||presupuestoUsuario=== null|| isNaN(presupuestoUsuario)||presupuestoUsuario <= 0 ){
        window.location.reload();
    }
    //presupuesto valido
    presupuesto = new Presupuesto(presupuestoUsuario);
    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}

//Añade gastos 
function agregarGasto(e){
    e.preventDefault();

    //leer los datos del formulario
    const nombre = document.querySelector('#gasto').value;
    const cantidad= Number(document.querySelector('#cantidad').value);

    //validar
    if(nombre === '' || cantidad ===''){
        ui.imprimirAlerta('Ambos campos son obligatorios','error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)){
        ui.imprimirAlerta('Cantidad no valida', 'error');
        return;

    }else{

    //Generar un objeto con el gasto
    const gasto = {nombre, cantidad , id: Date.now() };
     //añade un nuevo gasto
    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregado Correctamente')

    //imprimir gastos
    const {gastos, restante}= presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    //Reiniciar el formulario
    formulario.reset();
}
}

function eliminarGasto(id){

    // elimina el objeto
    presupuesto.eliminarGasto(id);

    //elimina los gastos del html
    const { gastos, restante } =presupuesto;
    ui.mostrarGastos(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

}