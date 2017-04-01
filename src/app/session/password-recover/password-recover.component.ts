import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire, FirebaseApp } from 'angularfire2';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { AuthModel } from '../../shared/models/authentication';

@Component({
  selector: 'app-password-recover',
  templateUrl: './password-recover.component.html',
  styleUrls: ['./password-recover.component.css']
})
export class PasswordRecoverComponent implements OnInit {

  public _authData: AuthModel = <AuthModel>{};
  public _auth: any;

  constructor(private _ns: NotificationService, @Inject(FirebaseApp) _fa, private _r: Router) { 
    this._auth = _fa.auth();
  }

  ngOnInit() {
    
  }

  submit() {
    this._ns.addToast('Aguarde...', 'Estamos processando suas informações!', 'wait');
    this._auth.sendPasswordResetEmail(this._authData.email).then((res) => {
      this._ns.clearAll();
      this._ns.addToast('Ok', 'Um e-mail foi enviado para você recuperar sua senha', 'success');
      this._r.navigate(['/session/sign-in']);
    }).catch((err) => {
      this._ns.addToast('Oppss', 'Um erro ocorreu ao tentar enviar o e-mail para você! Tente novamente.', 'error');
    })
  }

}
