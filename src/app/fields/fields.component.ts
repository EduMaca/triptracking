import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { ModalComponent } from 'ng2-bs3-modal/ng2-bs3-modal';
import { NotificationService } from '../shared/services/notification/notification.service';
import { Field } from '../shared/models/models';

@Component({
  selector: 'app-fields',
  templateUrl: './fields.component.html',
  styleUrls: ['./fields.component.css']
})
export class FieldsComponent implements OnInit {

  @ViewChild('myModal')
  modal: ModalComponent;

  @ViewChild('modalDelte')
  modal_delete: ModalComponent

 

  public _fields: Array<Field> = [];
  public _field: Field = <Field>{};

  public key: string = '';

  constructor(private _af: AngularFire, private _ns: NotificationService) { 
    this.getFields();
  }

  ngOnInit() {
  }

   modal_delete_open(field) {
    this.modal_delete.open();
    this._field = field;
  }

  getFields() {
    this._af.database.list('/fields').map((fields: Field[]) => fields).subscribe((fs) => {
      this._fields = fs;
    })
  }

  

  createField() {
    this._ns.addToast('Aguarde...', 'Estamos preparando tudo para a criação deste campo!', 'wait');
    if(this._fields.filter(f => this._field.name == f.name && this._field.type == f.type).length > 0) {
      this._ns.clearAll();
      this._ns.addToast('Oppss', 'Esse campo já existe', 'warning');
    } else {
      this._af.database.list('/fields').push(this._field).then((succ) => {
        this._ns.clearAll();
        this._ns.addToast('Ok', 'O campo ' + this._field.name + ' foi adicionado!', 'success');
        this.modal.close();
        this._field = <Field> {};
      }).catch((err) => {
        this._ns.clearAll();
        this._ns.addToast('Oppss', 'Ocorreu um erro ao adicionar este campo! Tente novamente.', 'error');
      })
    }
  }

  deleteField(key:string) {
    this._ns.addToast('Aguarde...', 'Estamos preparando tudo para apagar o campo!', 'wait');
    this._af.database.object('/fields/' + key).remove().then((succ) => {
      this._ns.clearAll();
      this._ns.addToast('Ok', 'Este campo foi removido com sucesso!', 'success');
      this.modal_delete.close();
      this._field = <Field>{};
    }).catch((err) => {
      this._ns.clearAll();
      this._ns.addToast('Oppss', 'Aconteceu algo errado ao tentar apagar o campo!', 'error');
    })
  }

}
