import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { AuthInfo } from '../../shared/services/auth/auth-info';
import { NotificationService } from '../../shared/services/notification/notification.service';

import { Form, Field, EntityStatus } from '../../shared/models/models';

@Component({
  selector: 'app-form-detail',
  templateUrl: './form-detail.component.html',
  styleUrls: ['./form-detail.component.css']
})
export class FormDetailComponent implements OnInit {

  @ViewChild('myModal')
  modal: ModalComponent;

  public _currentId: string = "";
  public _currentAccountId;
  public _form: Form = <Form>{};
  public form_editing: boolean = false;
  public key: string = '';

  constructor(private _ac: ActivatedRoute, private _r: Router, private _af: AngularFire, private _ai: AuthInfo, private _ns: NotificationService) {
    this.getCurrentId();
    this._r.events.subscribe((r) => {
      if (r instanceof NavigationEnd) {
        this._ai.getInfo().subscribe((i) => {
          this._currentAccountId = i.accountId;
          this.getCurrentForm();
        })
      }
    })
  }

  ngOnInit() {
  }

  getCurrentId() {
    this._ac.params.subscribe((p) => {
      if (p["id"] != null)
        this._currentId = p["id"];
      else
        this._r.navigate(['/forms'])
    })
  }

  getCurrentForm() {
    this._af.database.object('/forms/' + this._currentAccountId + '/' + this._currentId).map((form: Form) => form).subscribe((f) => {
      this._form = f;
    })
  }

  deactivateForm() {
    this._ns.addToast('Aguarde...', 'Estamos desativando este formulário', 'wait');
    this._form.status = EntityStatus.disabled;
    this._af.database.list('/forms/' + this._currentAccountId).update(this._currentId, this._form).then((suc) => {
      this._ns.clearAll();
      this._ns.addToast('Ok', 'Desativamos esse formulário para você', 'success');
    }).catch((err) => {
      this._ns.clearAll();
      this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar desativar esse formulário', 'error');
    })
  }

  activateForm() {
    this._ns.addToast('Aguarde...', 'Estamos desativando este formulário', 'wait');
    if (this._form.status == EntityStatus.disabled) {
      this._form.status = EntityStatus.active;
      this._af.database.list('/forms/' + this._currentAccountId).update(this._currentId, this._form).then((suc) => {
        this._ns.clearAll();
        this._ns.addToast('Ok', 'Ativamos esse formulário para você', 'success');
      }).catch((err) => {
        this._ns.clearAll();
        this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar ativar esse formulário', 'error');
      })
    } else {
      this._ns.clearAll();
      this._ns.addToast('Eita', 'Algo deu errado! Vimos que esse formulário já está ativo.', 'warning');
    }
  }

  deleteForm() {
    this._ns.addToast('Aguarde...', 'Estamos apagando seu formulário.', 'wait');
    this._af.database.list('/formFields/' + this.key).remove().then((succ) => {
      this._af.database.list('/forms/' + this._currentAccountId).remove(this.key).then((suc) => {
        this._ns.clearAll();
        this.modal.close();
        this._ns.addToast('Ok', 'O formulário foi apagado com sucesso!', 'success');
        this._r.navigate(['/forms']);
      }).catch((err) => {
        this._ns.clearAll();
        this._ns.addToast('Oppss', 'Ocorreu um erro ao apagar o formulário!', 'error');
      })
    }).catch((err) => {
      this._ns.clearAll();
      this._ns.addToast('Oppss', 'Ocorreu um erro ao apagar o formulário!', 'error');
    })
  }

  eventEmitDoubleClick() {
    this.form_editing = !this.form_editing;
  }

  saveForm() {
    this._ns.addToast('Aguarde...', 'Estamos atualizando este formulário.', 'wait');
    this._af.database.object('/forms/' + this._currentAccountId + '/' + this._currentId).update(this._form).then((suc) => {
      this._ns.clearAll();
      this.form_editing = false;
      this._ns.addToast('Ok', 'Seu formulário foi atualizado com sucesso!', 'success');
    }).catch((err) => {
      this._ns.clearAll();
      this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar atualizar as informações do seu formulário.', 'error');
    })
  }

}
