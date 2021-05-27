import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private httpClient: HttpClient
  ) {

  }

  criarUsuario (email: string, password: string){
    const authData: AuthData = {email, password}; //syntax sugar
    this.httpClient.post('http://localhost:3000/api/usuario/signup', authData)
    .subscribe(resposta => {
      console.log(resposta);
    })
  }

  login (email: string, password: string){
    const authData: AuthData = {email, password};
    this.httpClient.post ("http://localhost:3000/api/usuario/login", authData)
    .subscribe(resposta => {
      console.log(resposta);
    })
  }
}
