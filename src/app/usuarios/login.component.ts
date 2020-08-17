import { Component, OnInit } from '@angular/core';
import { Usuario } from './usuario';
import swal from 'sweetalert2';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  titulo: string = "Por favor Sign-In!"
  usuario:Usuario;

  constructor( private authService : AuthService, private router :Router) {  //Se pasa como inyección el authService
    this.usuario = new Usuario();
   }

  ngOnInit(): void {
    if(this.authService.isAuthenticated()){
      swal.fire('Login', 'Hola ' + this.authService.usuario.username + ' ya estás autenticado', 'info' ); 
      this.router.navigate(['/clientes']);

    }


  }

  login(): void {
    console.log(this.usuario);
    if (this.usuario.username == null || this.usuario.password == null){
      swal.fire ('Error Login', 'Username o Password vacías!', 'error');
      return;

    }



    this.authService.login(this.usuario).subscribe(
    response => {

      console.log(response);

    //  let payLoad = JSON.parse(atob(response.access_token.split(".")[1]));
    //  console.log(payLoad);  se cambia por el metodo getter y setter de la clase authservice.

      this.authService.guardarUsuario(response.access_token);  //Se guardan en una sessionStoage en el navegador.
      this.authService.guardarToken(response.access_token);

      let usuario = this.authService.usuario;  //Se accede al getter de authService para obtener el usuario.

      this.router.navigate(['/clientes']);
      swal.fire('Login', 'Hola ' + usuario.username + ' has iniciado sesión con éxito! ', 'success' );
    },
    err => {
      if (err.status == 400){
        swal.fire('Error Login', 'Usuario o clave incorrectas!', 'error');
      }
    });  //Como es observable, creamos la subscripción
  }



}
