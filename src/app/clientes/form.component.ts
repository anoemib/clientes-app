import { Component, OnInit } from '@angular/core';
import { Cliente } from './cliente';
import { ClienteService } from './cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import swal from 'sweetalert2';
import { Region } from './region';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {


  public cliente: Cliente = new Cliente()
  public titulo:string = "Crear Cliente"
  public errores:string[];
  public regiones: Region[];
//se crea la instancia cliente de la clase Cliente.
//se puede manipular en el form.component.Html de forma dinámica



  constructor(private clienteService: ClienteService, private router : Router , private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.cargarCliente();
    this.cargarRegiones();
  }

  public cargarCliente() : void {
    this.activatedRoute.params.subscribe(
        params => {
          let id = params['id']
          if (id){
            this.clienteService.getCliente(id).subscribe(
              (cliente)  => this.cliente = cliente
            )
          }
        }
    );

  }

    public cargarRegiones(): void{
      this.clienteService.getRegiones().subscribe(
        regiones => this.regiones = regiones  //el parametro que estamos recibiendo es regiones. Es decir si existe regiones seteamos a this.regiones = regiones. Es asincrónico.
      );
    }

  public create(): void {  //se llama al metodo desde la interfaz
  //  console.log("Clicked")
     console.log(this.cliente)

   this.clienteService.create(this.cliente).subscribe(   //permite monitorear cambios en el parámetro cliente, si hay cambios se ejecuta el código entre parentecis.
     cliente =>{
       this.router.navigate(['/clientes'])
     swal.fire('Nuevo Cliente', `El cliente ${cliente.nombre} ha sido creado con éxito`, 'success')
   }, //se va a redirigir a la pagina de clientes, para eso es el route

   err=> { //segundo parámetro del subscribe, es el error
     this.errores = err.error.errors as string[];
     console.error('Código de error desde el Backend: ' + err.status);
     console.error(err.error.errors);
   }
   )
  }

public update() :void{  //si se actualiza cliente, se ejecuta el código adentro.

  console.log(this.cliente);


  this.clienteService.update(this.cliente).subscribe(
json => {
  this.router.navigate(['/clientes'])
  swal.fire('Cliente Actualizado', `${json.mensaje}: ${json.cliente.nombre}`, 'success')
    }, //se va a redirigir a la pagina de clientes, para eso es el route

    err=> { //segundo parámetro del subscribe, es el error
      this.errores = err.error.errors as string[];
      console.error('Código de error desde el Backend: ' + err.status);
      console.error(err.error.errors);
    }
  )
}

public compararRegion(o1:Region,o2:Region): boolean{
  if (o1 === undefined && o2 === undefined ){ return true; }
  return (o1 == null || o2 == null)? false : (o1.id == o2.id)? true: false;
}



}
