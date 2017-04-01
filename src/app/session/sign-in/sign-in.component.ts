import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { AuthModel } from '../../shared/models/authentication';
import { NotificationService } from '../../shared/services/notification/notification.service';


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit {
  public _authData: AuthModel = <AuthModel>{};

  constructor(private _af: AngularFire, private _r: Router, private _ns: NotificationService) { 
  }

  ngOnInit() {
  }

  submit() {
    this._ns.addToast('Um momento', 'Estamos verificando as informações fornecidas', 'wait');
    this._af.auth.login(this._authData).then((response) => {
      this._ns.clearAll();
      this._ns.addToast('Ok', 'As informações fornecidas estão corretas', 'success');
      this._r.navigate(['/']);
    }).catch((err) => {
      this._ns.addToast('Oppss', 'As informações fornecidas estão incorretas', 'error');
    })
  }

}
