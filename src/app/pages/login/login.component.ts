import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { Usuario } from 'src/app/models/Usuario.model';

import { AuthService } from 'src/app/services/auth.service';

import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  usuario: Usuario;
  recordar: boolean = false;

  constructor(
    private _authService: AuthService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.usuario = new Usuario();

    if (localStorage.getItem('email')) {
      this.usuario.email = localStorage.getItem('email');
      this.recordar = true;
    }
  }

  login(form: NgForm): void {
    if (form.invalid) { return; }

    Swal.fire({
      allowOutsideClick: false,
      type: 'info',
      text: 'Espere por favor...'
    });
    Swal.showLoading();

    this._authService.login(this.usuario).subscribe(
      resp => {
        Swal.close();

        if (this.recordar) localStorage.setItem('email', this.usuario.email);

        this.router.navigate(['/home']);
      },
      err => {
        Swal.fire({
          title: 'Auth Error',
          type: 'error',
          text: err.error.error.message
        });
      }
    );
  }

}
