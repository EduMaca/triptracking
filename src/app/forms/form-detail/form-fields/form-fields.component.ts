import { Component, OnInit, Input } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Router, NavigationEnd } from '@angular/router';
import { AuthInfo } from '../../../shared/services/auth/auth-info';
import { NotificationService } from '../../../shared/services/notification/notification.service';

import { Form, Field } from '../../../shared/models/models';
declare var $:any;
declare var AppVendors: any;

@Component({
  selector: 'app-form-fields',
  templateUrl: './form-fields.component.html',
  styleUrls: ['./form-fields.component.css']
})
export class FormFieldsComponent implements OnInit {

  @Input() formId;
  @Input() accountId;

  public _allFields: Array<Field> = [];
  public _allFormFields: Array<Field> = [];

  constructor(private _af: AngularFire, private _ai: AuthInfo, private _ns: NotificationService, private _r: Router) {
    this._r.events.subscribe((e) => {
      if (e instanceof NavigationEnd) {
          this.getAllFields();
          this.getFormFields();
      }

    })

  }

  ngOnInit() {
    AppVendors.initialize();
  }


  getAllFields() {
    var self = this;
    this._af.database.list('/fields').map((fields: Field[]) => fields).subscribe((field) => {
      this._allFields = field;
    })
  }

  getFormFields() {
    this._af.database.list('/formFields/' + this.formId).subscribe((fields) => {
      this._allFormFields = fields;
      this._allFields.forEach(field => {
        if (this._allFormFields.filter(ff => field.name === ff.name).length > 0)
          field["checked"] = true;
        else
          field["checked"] = false;
      })
    })
  }

  onChange(field) {
    this._ns.addToast('Aguarde', 'Estamos fazendo as alterações necessárias', 'wait');
    if (field.checked) {
      delete field.checked;
      this._af.database.list('/formFields/' + this.formId).push(field).then((suc) => {
        this._ns.clearAll();
        this._ns.addToast('Ok', 'Adicionamos o campo ' + field.name + ' no seu formulário!', 'success');
      }).catch((err) => {
        this._ns.clearAll();
        this._ns.addToast('Oppss', 'Erro ao tentar adicionar o campo ' + field.name + ' ao formulário', 'error');
      })
    } else {
      let $key = this._allFormFields.find(f => field.name == f.name).$key;
      this._af.database.list('/formFields/' + this.formId).remove($key).then((suc) => {
        this._ns.clearAll();
        this._ns.addToast('Ok', 'Removemos o campo ' + field.name + ' do seu formulário!', 'success');
      }).catch((err) => {
        this._ns.clearAll();
        this._ns.addToast('Oppss', 'Erro ao tentar remover o campo ' + field.name + ' do formulário', 'error');
      })
    }
  }

}
