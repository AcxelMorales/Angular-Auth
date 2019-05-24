import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Usuario } from '../models/Usuario.model';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty';
  private apiKey = '';
  userToken: string;

  // Crear Usuario
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY] 

  // Login
  // https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword?key=[API_KEY] 

  constructor(
    private http: HttpClient
  ) {
    this.readToken();
  }

  logout(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expire');
  }

  login(usuario: Usuario): Observable<Object> {
    const authData = {
      ...usuario,
      returnSecureToken: true
    };

    return this.http.post(`${this.url}/verifyPassword?key=${this.apiKey}`, authData).pipe(
      map((resp: any) => {
        this.saveToken(resp['idToken']);
        return resp;
      })
    );
  }

  singUp(usuario: Usuario): Observable<void> {
    const authData = {
      // email: usuario.email,
      // password: usuario.password,
      ...usuario, // esta expreción representa lo mismo de la parte de arriba
      returnSecureToken: true
    };

    return this.http.post(`${this.url}/signupNewUser?key=${this.apiKey}`, authData).pipe(
      map((resp: any) => {
        this.saveToken(resp['idToken']);
        return resp;
      })
    );
  }

  private saveToken(idToken: string): void {
    this.userToken = idToken;
    localStorage.setItem('token', idToken);

    let hoy = new Date();
    hoy.setSeconds(3600);

    localStorage.setItem('expire', hoy.getTime().toString());
  }

  private readToken(): string {
    if (localStorage.getItem('token')) {
      this.userToken = localStorage.getItem('token');
    } else {
      this.userToken = '';
    }

    return this.userToken;
  }

  isLog(): boolean {
    if (this.userToken.length < 2) return false;

    const expire = Number(localStorage.getItem('expire'));
    const expireDate = new Date();
    expireDate.setTime(expire);

    if (expireDate > new Date()) return true;
    else return false;
  }

}
