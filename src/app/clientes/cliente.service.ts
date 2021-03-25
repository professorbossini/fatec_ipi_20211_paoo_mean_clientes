import { Injectable } from '@angular/core';
import { Cliente } from './cliente.model';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({providedIn: 'root'})
export class ClienteService{
  private clientes: Cliente[] = [];
  private listaClientesAtualizada = new Subject <Cliente[]> ();

  constructor (private httpClient: HttpClient){

  }

  getClientes(): void{
    this.httpClient.get<{mensagem: string, clientes: Cliente[]}>('http://localhost:3000/api/clientes').subscribe(
      (dados) => {
        this.clientes = dados.clientes;
        this.listaClientesAtualizada.next([...this.clientes])
      }
    )
    //return [...this.clientes];
  }

  adicionarCliente(nome: string, fone: string, email: string){
    const cliente: Cliente = {
      nome: nome,
      fone: fone,
      email: email
    }
    this.httpClient.post<{mensagem: string}>('http://localhost:3000/api/clientes', cliente).subscribe(
      (dados) => {
        console.log(dados.mensagem)
        this.clientes.push(cliente)
        this.listaClientesAtualizada.next([...this.clientes])
      }
    )
  }

  getListaDeClientesAtualizadaObservable() {
    return this.listaClientesAtualizada.asObservable();
  }
}
