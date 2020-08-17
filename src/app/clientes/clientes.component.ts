import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
// import { CLIENTES } from './clientes.json';  Se saca el import y se pasa al servicio. Esto para separar aún más el código.
import { ClienteService } from './cliente.service';
import { ModalService } from './detalle/modal.service';

import Swal from 'sweetalert2';
import {tap} from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../usuarios/auth.service';

@Component({
  selector: 'app-clientes',
  templateUrl: './clientes.component.html',
//  styleUrls: ['./clientes.component.css']
})
export class ClientesComponent {  //clase componente que se comunica con la clase html e importa el service para conexión al backend
  clientes : Cliente[];
  paginador: any; //se incorpora para el paginador
  // private clienteService: ClienteService;
  clienteSeleccionado: Cliente;

 //constructor(private clienteService: ClienteService) { } //Se inyecta el cliente Service  para solicitar los datos del backend. Se comenta para incorporar el segundo parámetro de paginación
 //constructor(clienteService: ClienteService) {  //recuerda que el constructor puede declarar atributos de la clase. En la fila anterior se hace de manera abreviada. en lo comentado de manera tradicional. Es lo mismo
//   this.clienteService = clienteService;
// }

constructor(
  private clienteService: ClienteService,
  private modalService: ModalService,
  private activatedRoute: ActivatedRoute,
  public authService: AuthService) {





} //seincorpora el segundo parámetro para paginación


  ngOnInit(): void {  //metodo al iniciar la vista.
  //   this.clientes = CLIENTES; Se elimina ya que se separa de la lógica aún mas con el servicio
  //this.clientes = this.clienteService.getClientes(); Se elimina para incorporar consulta asincrónica.

  //this.clienteService.getClientes().subscribe(
  //  (clientes) { this.clientes = clientes   //funcion anonima
  //  }
  //   );
/*   SE MODIFICA PAR AINCORPORAR EL PAGINADOR.
    this.clienteService.getClientes().subscribe(  //estudiar funcionamiento subscribe!! para hacer peticiones
      clientes => this.clientes = clientes //forma abreviada de la función comentada anteriormente, se retorna clientes y se deja en el listado clientes. que se lee en la vista del componente.
*/


      this.activatedRoute.paramMap.subscribe( params =>{
      let page:number = +params.get('page');
      if(!page){page = 0;}

      this.clienteService.getClientes(page)
      .pipe(
        tap(response => {
          console.log('Cliente Component: Tap 3');
          (response.content as Cliente[]).forEach(
            cliente => {
              console.log(cliente.nombre)
            })
        })
).subscribe(response => {
  this.clientes = response.content as Cliente[];
  this.paginador = response;
})
})

this.modalService.notificarUpload.subscribe(cliente=>{
  this.clientes = this.clientes.map(clienteOriginal => {
    if (cliente.id == clienteOriginal.id){
      clienteOriginal.foto = cliente.foto;
    }
    return clienteOriginal;
  })
});


}


  delete(cliente: Cliente): void {

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger'
      },
      buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
      title: 'Esta seguro?',
      text: `Eliminará al cliente ${cliente.nombre} ${cliente.apellido}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si, eliminar!',
      cancelButtonText: 'No, cancelar!',
      reverseButtons: true
    }).then((result) => {
      if (result.value) {
        this.clientes = this.clientes.filter(cli => cli !== cliente)   //flitra del listado de clientes el cliente actual
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            swalWithBootstrapButtons.fire(
              'Eliminado!',
              'El cliente ha sido eliminado.',
              'success'
            )
          }
        );

      }
    })



  }


  abrirModal(cliente: Cliente){
    this.clienteSeleccionado = cliente;
    this.modalService.abrirModal();
  }

}
