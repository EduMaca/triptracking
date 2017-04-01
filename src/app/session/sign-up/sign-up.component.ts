import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { NotificationService } from '../../shared/services/notification/notification.service';

import { User } from '../../shared/models/models';
import { AuthModel } from '../../shared/models/authentication';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  public _user: User = <User>{};
  public _authData: AuthModel = <AuthModel>{};

  constructor(private _af: AngularFire, private _ns: NotificationService, private _r: Router) { }

  ngOnInit() {
  }

  submit() {
    this._af.auth.createUser(this._authData).then((success) => {
      let uid = success.uid;
      if(uid != null) {
        success.auth.updateProfile({displayName: this._user.full_name, photoURL: ''}).then((updated) => {
          this._ns.addToast('Ok', 'Seu usuário foi criado com sucesso! Comece fazendo login.', 'success');
          this._r.navigate(['/session/sign-in']);
        }).catch((err) => {
          this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar criar seu perfil. Contate o suporte ou tente novamente. Nome do erro: ' + err.name, 'error');
        })
      }
    }).catch((err) => {
      this._ns.addToast('Oppss', 'Algo errado aconteceu na criação do seu usuário' + err.message, 'error');
    })
  }

}
