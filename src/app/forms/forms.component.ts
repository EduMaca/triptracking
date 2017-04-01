import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { NotificationService } from '../shared/services/notification/notification.service';
import { AuthInfo } from '../shared/services/auth/auth-info';
import { Form, User, EntityStatus } from '../shared/models/models';

@Component({
  selector: 'app-forms',
  templateUrl: './forms.component.html',
  styleUrls: ['./forms.component.css'],
  providers: [AuthInfo]
})
export class FormsComponent implements OnInit {
  public _currentUser: User = <User>{};
  public _formList: Array<Form> = [];
  public _form: Form = <Form>{};
  public _formStats: any = EntityStatus;

  constructor(private _af: AngularFire, private _ns: NotificationService, private _ai: AuthInfo, private _r: Router) {
    this._ai.getInfo().subscribe((auth) => {
      this._currentUser = auth;
      this.getForms();
    })
  }


  ngOnInit() {
  }


  newForm() {
    this._ns.addToast('Aguarde...', 'Estamos criando o formulário para você', 'wait');
    this._form.status = EntityStatus.active;
    this._form.name = "Formulário";
    this._af.database.list('/forms/' + this._currentUser.accountId).push(this._form).then((form) => {
      this._ns.clearAll();
      this._ns.addToast('Ok', 'Criamos um novo formulário para você!', 'success');
    }).catch((err) => {
      this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar criar o formulário! Tente novamente', 'error');
    })
  }

  getForms() {
    this._af.database.list('/forms/' + this._currentUser.accountId).map((form: Form[]) => form).subscribe((f) => {
      this._formList = f;
    });
  }

}
