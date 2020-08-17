import { Component, OnInit, Input } from '@angular/core';
import { Cliente } from '../cliente';
import { ClienteService} from  '../cliente.service'
import { ModalService } from './modal.service';

import { ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { HttpEventType } from '@angular/common/http';
import { AuthService } from '../../usuarios/auth.service';


@Component({
  selector: 'detalle-cliente',
  templateUrl: './detalle.component.html',
  styleUrls: ['./detalle.component.css']
})
export class DetalleComponent implements OnInit {

//cliente : Cliente;  //se reemplaza con el decorador más abajo para incorporar la modal. El dato del cliente se inyecta a través de la vista por eso abajo se agrega decorador
@Input() cliente:Cliente; //dato inyectado desde la vista cliente.component.ts
titulo : String = "Detalle del cliente";
fotoSeleccionada : File;
progreso: number =0;  //para reportar el progreso de la subida del archivo


constructor(
  private clienteService: ClienteService,
  public modalService: ModalService,
  private activatedRoute: ActivatedRoute,
  public authService: AuthService) { }


  ngOnInit(): void {/*

    SE COMENTA, YA QUE A PARTIR DE AHORA LA VARIABLE cliente SE SETEA A TRAVÉS DE LA VISTA CLIENTE.COMPONENT.HTML. VER EL ANOTATION @INPUT DE LA VARIABLE

    this.activatedRoute.paramMap.subscribe(
      params => {
        let id:number = +params.get('id');  //se castea el parametro "id" a tipo number
        if (id){
          this.clienteService.getCliente(id).subscribe(
          cliente => {
            this.cliente = cliente;
          });
        }

      }
    );   //se subscribe para monitorear el cambio del id. Para obtener el detalle del cliente.
*/
  }


seleccionarFoto(event){
  this.progreso = 0;  //Se reinicia el progreso a cero cada vez que se seleccione la foto.
  this.fotoSeleccionada = event.target.files[0];
  console.log(this.fotoSeleccionada);
  if (this.fotoSeleccionada.type.indexOf('image') < 0){
    swal.fire('Error Seleccionar imagen', 'El archivo debe ser de tipo imagen', 'error');
    this.fotoSeleccionada = null;
  }
}

/*
subirFoto(){

  if (!this.fotoSeleccionada){
    swal.fire('Error Upload', 'Debe seleccionar una foto', 'error');
  }else{

  this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
  .subscribe(
    cliente => {
      this.cliente = cliente;
         swal.fire('La foto se ha subido completamente', `La foto se ha subido con éxito: ${this.cliente.foto}`, 'success')
    }
  );
}
}

*/


/*
subirFoto(){

  if (!this.fotoSeleccionada){
    swal.fire('Error Upload', 'Debe seleccionar una foto', 'error');
  }else{

  this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
  .subscribe(
    cliente => {
          this.cliente = cliente;
         swal.fire('La foto se ha subido completamente', `La foto se ha subido con éxito: ${this.cliente.foto}`, 'success')
    }
  );
}
}
*/


subirFoto(){

  if (!this.fotoSeleccionada){
    swal.fire('Error Upload', 'Debe seleccionar una foto', 'error');
  }else{

  this.clienteService.subirFoto(this.fotoSeleccionada, this.cliente.id)
  .subscribe(
    event => {
      if (event.type === HttpEventType.UploadProgress){
        this.progreso = Math.round((event.loaded/event.total)*100);
      }else if (event.type ===HttpEventType.Response){
        let response: any = event.body;
        this.cliente = response.cliente as Cliente;

        this.modalService.notificarUpload.emit(this.cliente);  //Emitidor de evento para que se actualice el listado en la lista de clientes



        swal.fire('La foto se ha subido completamente', response.mensaje, 'success');
      }
          //this.cliente = cliente;

    }
  );
}
}

cerrarModal(){
  this.modalService.cerrarModal();
  this.fotoSeleccionada = null;
  this.progreso = 0;
  ;
}


}
