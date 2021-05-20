import { mimeTypeValidator } from './mime-type.validator';
import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { Cliente } from '../cliente.model';
import { ClienteService } from '../cliente.service';
@Component({
  selector: 'app-cliente-inserir',
  templateUrl: "./cliente-inserir.component.html",
  styleUrls: ["./cliente-inserir.component.css"]
})
export class ClienteInserirComponent implements OnInit {

  private modo: string = "criar";
  private idCliente: string;
  public cliente: Cliente;
  public estaCarregando: boolean = false;
  form: FormGroup;
  previewImagem: string;

  constructor (
    private clienteService: ClienteService,
    public route: ActivatedRoute
  ){

  }

  ngOnInit(): void{
    this.form = new FormGroup({
      nome: new FormControl (null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      fone: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      imagem: new FormControl (null, {
        validators: [Validators.required],
        asyncValidators: [mimeTypeValidator]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has("idCliente")){
        this.modo = "editar";
        this.idCliente = paramMap.get("idCliente");
        this.estaCarregando = true;
        //this.cliente = this.clienteService.getCliente(this.idCliente);
       this.clienteService.getCliente(this.idCliente).subscribe(dadosCli => {
         this.estaCarregando = false;
          this.cliente = {
            id: dadosCli._id,
            nome: dadosCli.nome,
            fone: dadosCli.fone,
            email: dadosCli.email,
            imagemURL: dadosCli.imagemURL
          }
          this.form.setValue({
            nome: this.cliente.nome,
            fone: this.cliente.fone,
            email: this.cliente.email,
            imagem: this.cliente.imagemURL
          })
        });
      }
      else{
        this.modo = "criar";
        this.idCliente = null;
      }
    })

  }

  onSalvarCliente(){
    //console.log(form);
    if(this.form.invalid) return;
    this.estaCarregando = true;
    if (this.modo === "criar"){
      this.clienteService.adicionarCliente(
        this.form.value.nome,
        this.form.value.fone,
        this.form.value.email,
        this.form.value.imagem
      );
    }
    else{
      this.clienteService.atualizarCliente(
        this.idCliente,
        this.form.value.nome,
        this.form.value.fone,
        this.form.value.email,
        this.form.value.imagem
      )
    }
    this.form.reset();
  }
  onImagemSelecionada (event: Event){
    const arquivo = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({'imagem': arquivo});
    this.form.get('imagem').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.previewImagem = reader.result as string;
    }
    reader.readAsDataURL(arquivo);
  }
}
