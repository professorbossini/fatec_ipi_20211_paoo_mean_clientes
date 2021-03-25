import { Component, OnInit, OnDestroy } from '@angular/core';

import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service'
import { Subscription } from 'rxjs'
@Component({
  selector: 'app-cliente-lista',
  templateUrl: './cliente-lista.component.html',
  styleUrls: ['./cliente-lista.component.css']
})
export class ClienteListaComponent implements OnInit, OnDestroy {

  clientes: Cliente[] = []
  private clientesSubscription: Subscription;

  constructor(private clienteService: ClienteService) {

  }



  ngOnInit(): void {
    this.clienteService.getClientes();
    this.clientesSubscription = this.clienteService.getListaDeClientesAtualizadaObservable().subscribe(
      (clientes: Cliente[]) => {
        this.clientes = clientes;
      }
    )
  }

  ngOnDestroy(): void{
    this.clientesSubscription.unsubscribe();
  }

}
