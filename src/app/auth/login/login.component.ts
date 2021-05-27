import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { UsuarioService } from '../usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  estaCarregando: boolean = false;

  onLogin (form: NgForm): void {
    this.usuarioService.login(form.value.email, form.value.password);
  }

  constructor(private usuarioService: UsuarioService) { }

  ngOnInit(): void {
  }

}
