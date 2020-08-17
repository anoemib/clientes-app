import { Injectable, EventEmitter } from '@angular/core';

//@Injectable({
//  providedIn: 'root'
//})
export class ModalService {

modal: boolean;

private _notificarUpload = new EventEmitter<any>();

  constructor() { }

  get notificarUpload(): EventEmitter<any>{
    return this._notificarUpload;     //esto permite noticar cuando se sube una foto para que se actualice el listado de clientes. No es totalmente necesasrio.
  }

  abrirModal(){
    this.modal = true;
  }

  cerrarModal(){
    this.modal = false;
  }
}
