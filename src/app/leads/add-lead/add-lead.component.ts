import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { database } from 'firebase';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { AuthInfo } from '../../shared/services/auth/auth-info';
import { Lead, Person, LeadStatus, User } from '../../shared/models/models';

declare var $:any;
declare var AppVendors: any;
declare var AppForms: any;

@Component({
  selector: 'app-add-lead',
  templateUrl: './add-lead.component.html',
  styleUrls: ['./add-lead.component.css']
})
export class AddLeadComponent implements OnInit {

  public _lead_info: Lead = <Lead>{};
  public _person_info: Person = <Person>{};
  public _currentUser: User = <User> {};
  public _source: string = "";
  public _medium: string = "";

  public _another_info: Array<any> = [];
  public _another_info_type: string = 'number';
  public _formKey: string = "";

  constructor(private _af: AngularFire, private _ns: NotificationService, private _ai: AuthInfo, private _r: Router) { 
    this._ai.getInfo().subscribe((ai) => {
      this._currentUser = ai;
      this.getFormInfo();
    })
  }

  ngOnInit() {
    AppVendors.initialize();
    AppForms.initialize();
  }

  getFormInfo() {
    this._af.database.list('/forms/' + this._currentUser.accountId).first().subscribe((form) => {
      this._formKey = form[0].$key;
    })
  }

  addInfoFields(type) {
    this._another_info.push({name: "", value: "", type: type, $key: this._another_info.length + 1});
  }

  removeField(key) {
    this._another_info.splice(this._another_info.indexOf(this._another_info.filter(x => x.$key == key)), 1);
  }

  submit() {
    this._ns.addToast('Aguarde...', 'Estamos preparando o seu contato', 'wait');
    if(this._another_info.length > 0) {
      let another_info_array = {};
      this._another_info.forEach((info) => {
        another_info_array[info.name] = info.value;
      })
      this._person_info.data = another_info_array;
      
    }

    this._af.database.list('/people').$ref.orderByChild("email").equalTo(this._person_info.email).limitToFirst(1).once('value').then((snap) => {
        if(snap.numChildren() > 0) {
          snap.forEach((snp) => {
            this.createLead(snp.key);
          })
        } else {
          this._af.database.list('/people').push(this._person_info).then((person) => {
            this.createLead(person.key);
          })
        }
    })
  }

  createLead(pKey) {
    let self = this;
    if(pKey != null) {
      this._lead_info.formKey = this._formKey;
      this._lead_info.personKey = pKey;
      this._lead_info.status = LeadStatus.received;
      this._lead_info.createdAt = database.ServerValue.TIMESTAMP;
      this._lead_info.data = {"analytics": {"trafic_info": {"source": self._source, "medium": self._medium}}};
      this._af.database.list('/leads/' + this._currentUser.accountId).push(this._lead_info).then((suc) => {
        this._ns.clearAll();
        this._ns.addToast('Ok', 'Um novo contato foi criado com sucesso!', 'success');
        this._r.navigate(['/leads', suc.key]);
      }).catch((err) => {
        this._ns.clearAll();
        this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar criar seu contato! Tente novamente.', 'error');
      })
    } else {
      this._ns.clearAll();
      this._ns.addToast('Oppss', 'Aconteceu um erro inesperado! Tente novamente.', 'error');
    }
  }

}
