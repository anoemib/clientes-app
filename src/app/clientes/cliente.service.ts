import { Injectable } from '@angular/core';
import { Cliente } from './cliente';
import { Region } from './region';
//import { CLIENTES } from './clientes.json';
import { Observable, throwError} from 'rxjs'; //libreria que permite hacer peticiones asincronas.n
import { HttpClient, /* SE REEMPLAZA POR EL INTERCEPTOR HttpHeaders, */ HttpRequest, HttpEvent } from '@angular/common/http';  //se incorpora la libreria Http para hacer uso de los servicios rest. y el headers para declarar el header de los post.
import { map , catchError, tap} from 'rxjs/operators';
import swal from 'sweetalert2';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';
// SE REEMPLAZA POR EL INTERCEPTOR import { AuthService } from '../usuarios/auth.service';



@Injectable(
  //{
  //providedIn: 'root'   Evita agregarlo al app.module.
//}
)
export class ClienteService {  //clase que hace las peticiones y comunicacion con el Backend
private urlEndPoint: string = 'http://localhost:8080/api/clientes';
/* private httpHeaders = new HttpHeaders({'content-type': 'application/json'});  SE PUEDE INCORPORAR EN UN INTERCEPTOR */ //se setean las cabeceras del post

  constructor(private http: HttpClient, private router: Router /* SE REEMPLAZA POR EL INTERCEPTOR , private authService: AuthService */ ) { }  //Se inyecta la dependencia vía constructor. Para poder trabajar con la clase HttpClient

  // getClientes(): Cliente[]{
  //  return CLIENTES;   Este código retorna el arreglo de clientes, de forma no sincrónica.  El código de abajo retorna de forma sincrónica.
  // }

/*

SE COMENTA YA QUE SE REEMPLAZA CON UN  INTECEPTOR.
private agregarAutorizationHeader(){

let token = this.authService.token;

  if (token != null){
    return this.httpHeaders.append('Authorization', 'Bearer ' + token);
  }
  return this.httpHeaders;

}

*/
/*

SE ELIMINA YA QUE SE REEMPLAZA POR EL INTERCEPTOR auth.interceptor

private isNoAutorizado(e): boolean{
  if (e.status == 401){
    if (this.authService.isAuthenticated()){
      this.authService.logout();
    }
    this.router.navigate(['/login']);
    return true;
  }

  if (e.status == 403){
    swal.fire('Acceso Denegado', 'Hola ' + this.authService.usuario.username + ' no tiene acceso a este recurso', 'warning');
    this.router.navigate(['/clientes']);
    return true;
  }
    return false;
}

*/




  getClientes(page: number): Observable <any>{  //retorna un arreglo del tipo observable con atributos de cada uno de este listado del tipo cliente
    //return of(CLIENTES);   //Se comenta ya que se convierte el dato en un flujo de datos. Asincrónico.
  //  return this.http.get<Cliente[]>(this.urlEndPoint)
    //SE retorna desde la variable http, del tipo HttpClient
    //el dato que obtiene con el metodo GET casteado a tipo Clase cliente.
    // Desde la url: urlEndPoin
    //abajo otra opción para el retorno
return this.http.get(this.urlEndPoint+'/page/'+ page ).pipe(
//  map(response => response as Cliente[])); Se comenta para incorporar el ejemplo de minusculas mayusculas con MAP
tap ((response : any) => {
  console.log('clienteService Tap 1');
  (response.content as Cliente[]).forEach(
    cliente => {console.log(cliente.nombre)});
}),
map((response: any) => {
   (response.content as Cliente[]).map(cliente => {
      cliente.nombre = cliente.nombre.toUpperCase();
      cliente.createAt = formatDate(cliente.createAt, 'fullDate', 'es');
    return cliente;
  });
return response;
}),
tap (response => {
  console.log('clienteService 2');
  (response.content as Cliente[]).forEach(
    cliente => {console.log(cliente.nombre)});
}));
  }

/*  Este es el cliente por defecto sin paginador, se comenta al incorporar el paginador en la aplicacion
  getClientes(): Observable <Cliente[]>{  //retorna un arreglo del tipo observable con atributos de cada uno de este listado del tipo cliente
    //return of(CLIENTES);   //Se comenta ya que se convierte el dato en un flujo de datos. Asincrónico.
  //  return this.http.get<Cliente[]>(this.urlEndPoint)
    //SE retorna desde la variable http, del tipo HttpClient
    //el dato que obtiene con el metodo GET casteado a tipo Clase cliente.
    // Desde la url: urlEndPoin
    //abajo otra opción para el retorno
return this.http.get(this.urlEndPoint).pipe(
//  map(response => response as Cliente[])); Se comenta para incorporar el ejemplo de minusculas mayusculas con MAP
tap (response => {
  let clientes = response as Cliente[];
  console.log('clienteService 1');
  clientes.forEach(
    cliente => {console.log(cliente.nombre)});
}),
map(response => {
  let clientes = response as Cliente[];
  return clientes.map(cliente => {
    cliente.nombre = cliente.nombre.toUpperCase();
    cliente.createAt = formatDate(cliente.createAt, 'fullDate', 'es');
    return cliente;
  });

}),
tap (response => {
  console.log('clienteService 2');
  response.forEach(
    cliente => {console.log(cliente.nombre)});
}));
  }
*/


  create (cliente: Cliente) : Observable <Cliente>{
    return this.http.post<Cliente>(this.urlEndPoint, cliente /* SE REEMPLAZA POR INTERCEPTOR , {headers: this.agregarAutorizationHeader()}*/ ).pipe(
            map((response: any) => response.cliente as Cliente),
            catchError(e => {
        /* SE REEMPLAZA POR EL INTERCEPTOR
        if (this.isNoAutorizado(e)){
           return throwError(e);
          }
          */

        if (e.status = 400){
         return throwError(e);
        }
  //se hace esto ya que se retorna el cliente. Se retorna el responsa en formato Cliente
        if (e.error.mensaje){
        console.error(e.error.mensaje);
        }
 //        swal.fire( e.error.mensaje, e.error.error, 'error'); //muestra el error por pantalla
/* Se reemplaza por el interceptor auth*/
        return throwError(e); //retorna un error observable
      })

    );
    //primer parámetro, url, datos, cabeceras.
    //el retorno del post se castea a cliente
  }


 getCliente(id) : Observable <Cliente>{
   return this.http.get<Cliente>( `${this.urlEndPoint}/${id}` /* SE REEMPAZA POR INTERCEPTOR, { headers: this.agregarAutorizationHeader() } */ ).pipe(
     catchError( e =>{
/*  Se reemplaza por el interceptor

               if (this.isNoAutorizado(e)){
                  return throwError(e);
                 }
*/
      if (e.status != 401 && e.error.mensaje ){
         this.router.navigate(['/clientes']);
         console.error(e.error.mensaje); //muestra el error por consola del explorador
      }



// Se reemplaza por el interceptor       swal.fire(e.error.mensaje, e.error.error, 'error'); //muestra el error por pantalla
       return throwError(e); //retorna un error observable
     })
   )
 }


  update(cliente: Cliente): Observable <any>{ //Acá se retorna un Any, ya que se retorna todo el Json. En el create se opera este Json y se retorna el cliente
    return this.http.put<any>(`${this.urlEndPoint}/${cliente.id}`, cliente /* SE REEMPLAZA POR INTERCEPTOR, {headers: this.agregarAutorizationHeader()} */).pipe(
      catchError(e => {

/* Se reemplaza por el interceptor
        if (this.isNoAutorizado(e)){
            return throwError(e);
            }
*/
        if (e.status = 400){
         return throwError(e);
        }
        if (e.error.mensaje){
        console.error(e.error.mensaje);
        }
  //Se reemplaza por el interceptor      swal.fire(e.error.mensaje, e.error.error, 'error'); //muestra el error por pantalla
        return throwError(e); //retorna un error observable
      })
    );
  }

  delete(id : number): Observable <Cliente>{
    return this.http.delete<Cliente>(`${this.urlEndPoint}/${id}`/* SE REEMPLAZA POR UN INTERCEPTOR,  {headers: this.agregarAutorizationHeader()} */).pipe(
      catchError(e => {
/* Se reemplaza por el interceptor

        if (this.isNoAutorizado(e)){
            return throwError(e);
            }
      */
      if (e.error.mensaje){
      console.error(e.error.mensaje);
      }
// Se reemplaza por el interceptor        swal.fire(e.error.mensaje, e.error.error, 'error'); //muestra el error por pantalla
        return throwError(e); //retorna un error observable
      })
    );
  }

  /*

 subirFoto(archivo: File, id): Observable<Cliente>{

    let formData = new FormData();   //clase nativa de javascript, no se importa ninguna libreria, tiene formato multipart/form-formData
    formData.append("archivo", archivo);
    formData.append("id", id);

    // const req = new HttpRequest('POST', 'uplado/file', file, { reportProgress:true});  //ver lección 100, no se implementó se consideró innecesario

    return this.http.post(`${this.urlEndPoint}/upload`, formData).pipe(
      map((response: any) => response.cliente as Cliente),
      catchError(e =>{
        console.error(e.error.mensaje);
        swal.fire(e.error.mensaje, e.error.error, 'error'); //muestra el error por pantalla
        return throwError(e); //retorna un error observable
      })
    );
}

*/


subirFoto(archivo: File, id): Observable<HttpEvent<{}>>{

   let formData = new FormData();   //clase nativa de javascript, no se importa ninguna libreria, tiene formato multipart/form-formData
   formData.append("archivo", archivo);
   formData.append("id", id);
/*  SE REEMPLAZA POR UN INTERCEPTOR PARA INCORPORAR LOS HEADERS
   let httpHeaders = new HttpHeaders();
   let token = this.authService.token;
   if (token != null){
     httpHeaders = httpHeaders.append('Authorization', 'Bearer ' + token);
   }
*/
    const req = new HttpRequest('POST', `${this.urlEndPoint}/upload`, formData,
     {
       reportProgress:true/* SE  REEEMPLAZA POR UN INTERCEPTOR, headers: httpHeaders */
     });

   return this.http.request(req)/* Se reemplaza por el interceptor .pipe(
     catchError(e => {
       this.isNoAutorizado(e);
       return throwError(e);
     })
   ); */
}

getRegiones(): Observable<Region[]>{

  return this.http.get<Region[]>(this.urlEndPoint + '/regiones' /*, SE ELIMINA POR QUE SE REEMPLAZA POR UN INTERCEPTOR { headers: this.agregarAutorizationHeader() }*/) /* .pipe(    //se agrega el headers para incorporar la seguridad del token
    catchError(e => {
      this.isNoAutorizado(e);
      return throwError(e);
    })
  )    SE ELIMINA TODO EL PIPE, LOS ERRORES SE MANEJAN A TRAVÉS DEL INTERCEPTOR AUTH INTERCEPTOR */
}



//
}
