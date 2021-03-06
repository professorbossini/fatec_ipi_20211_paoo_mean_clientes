import { UsuarioService } from './../usuario.service';
import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

  public estaCarregando: boolean = false;

  constructor(
    private usuarioService: UsuarioService
  ) {

   }

  ngOnInit(): void {
  }

  onSignup(form: NgForm): void {
    if (form.invalid) return;
    this.usuarioService.criarUsuario(form.value.email, form.value.password);
  }

}
