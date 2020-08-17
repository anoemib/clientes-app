import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { DirectivaComponent } from './directiva/directiva.component';
import { ClientesComponent } from './clientes/clientes.component';
import { FormComponent } from './clientes/form.component';  //se registra automáticamente al crear el componente del tipo formulario con sus comportamientos particulares
import { PaginatorComponent } from './paginator/paginator.component';
import { ClienteService } from './clientes/cliente.service';
import { RouterModule, Routes} from '@angular/router';  //se agrega para darle rutas a las paginas, recordar que es singlepage, con esto una ruta url a clientes por ejemplo
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';  //Permite comunicarse con el api rest backend.  Se incorpora en los imports.  Se usa en la clase cliente.service.ts
import { registerLocaleData} from '@angular/common';
import {FormsModule} from '@angular/forms';  //Modulo que permite manipular formularios
import  localeES  from '@angular/common/locales/es';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMomentDateModule } from '@angular/material-moment-adapter';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DetalleComponent } from './clientes/detalle/detalle.component';
import { ModalService } from './clientes/detalle/modal.service';
import { LoginComponent } from './usuarios/login.component';
import { AuthGuard } from './usuarios/guards/auth.guard';
import { RoleGuard } from './usuarios/guards/role.guard';
import { TokenInterceptor } from './usuarios/interceptors/token.interceptor';
import { AuthInterceptor } from './usuarios/interceptors/auth.interceptor';

registerLocaleData(localeES); //se cambia el idioma o locale

const routes: Routes = [
  {path: '', redirectTo: '/clientes', pathMatch:'full'},  //este sería nuestro home redirige a clientes. Hace un pathMatch full con la url
  {path: 'directivas', component:DirectivaComponent},
  {path: 'clientes', component:ClientesComponent},
  {path: 'clientes/page/:page', component:ClientesComponent},
  {path: 'clientes/form', component:FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}}, //Se declaran los guards de autenticación y role, tener en cuenta que se define el parametro data para definir el ROLE PERMITIRDO.
  {path: 'clientes/form/:id', component:FormComponent, canActivate: [AuthGuard, RoleGuard], data: {role: 'ROLE_ADMIN'}}, //se declaran los guards de autenticación
// como comentario se puede dejar todo funcionando en el Roleguard. (autenticación y validacion de autenticación)
//  {path: 'clientes/ver/:id', component:DetalleComponent} Se elimina ya que se transforma la vista en una modal de la vista clientes
  {path: 'login', component:LoginComponent}
];



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    DirectivaComponent,
    ClientesComponent,
    FormComponent,
    PaginatorComponent,
    DetalleComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),  //se agrega el router module para las URL's, esto permite ir por distintas páginas.
    HttpClientModule,
    FormsModule,//modulo para manejo de formularios
    BrowserAnimationsModule,   MatDatepickerModule,  MatMomentDateModule //es para importar material.angular
  ],
  providers: [
    ClienteService,
    ModalService,
    [{provide: LOCALE_ID, useValue: 'es' }],  //internacionalizacion
    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ],  //se declara el interceptor tipo http (permite ejcutar acciones antes de llamar a metodos http, para agregar cabeceras a las peticiones)

  bootstrap: [AppComponent]
})
export class AppModule { }
