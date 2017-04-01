import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { AuthInfo } from '../shared/services/auth/auth-info';
import { NotificationService } from '../shared/services/notification/notification.service';
import { Person, Lead, LeadStatus, User } from '../shared/models/models';

declare var $: any;
declare var AppVendors: any;
declare var AppForms: any;

@Component({
  selector: 'app-leads',
  templateUrl: './leads.component.html',
  styleUrls: ['./leads.component.css']
})
export class LeadsComponent implements OnInit {

  public _currentUser: User = <User>{};
  public _leads: Array<Lead> = [];
  public _personKeys: Array<string> = [];

  constructor(private _af: AngularFire, private _ai: AuthInfo, private _ns: NotificationService) {
    this._ai.getInfo().subscribe((ai) => {
      this._currentUser = ai;
      this.getAllLeads();
    });
  }

  ngOnInit() {
    AppVendors.initialize();
    AppForms.initialize();
  }

  getAllLeads() {
    this._af.database.list('/leads/' + this._currentUser.accountId)
      .map((gettedLeads: Lead[]) => gettedLeads).subscribe((data) => {
        data.forEach((lead_data) => {
          this._personKeys.push(lead_data.$key);
          let nLead: Lead = {
            $key: lead_data.$key,
            formKey: lead_data.formKey,
            personKey: lead_data.personKey,
            status: lead_data.status,
            data: lead_data.data,
          };
          this._leads.push(nLead);
        })
        if (this._personKeys.length > 0) {
          this._af.database.list('/people').$ref.orderByKey().endAt(this._personKeys[this._personKeys.length - 1]).once('value').then((snap) => {
            snap.forEach((al) => {
              this._leads.filter(l => l.personKey == al.key).forEach((lead) => {
                let person: Person = {
                  $key: al.key,
                  name: al.val().name,
                  email: al.val().email,
                  data: al.val().data
                };
                lead.person = person;
              })
            })
          })
        }

      });

    let person_lead_data = {
      mensagem: "Olá, gostaria de saber quanto custa uma consultoria para meu hotel. Tenho 40 apartamentos e preciso melhorar minhas reservas diretas!",
      analytics: {
        url: "www.tripdigital.com.br/consultoria",
        page_title: "Aumente suas reservas com uma consultoria grátis",
        trafic_info: {
          source: "google",
          medium: "cpc",
          campaign: "consultoria-gratis"
        }
      }
    };


  }

}
