import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { database } from 'firebase';
import { AuthInfo } from '../../shared/services/auth/auth-info';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { Lead, User, Person, LeadStatus, Proposal, Revenue } from '../../shared/models/models';

declare var $: any;
declare var AppVendors: any;

@Component({
  selector: 'app-lead-detail',
  templateUrl: './lead-detail.component.html',
  styleUrls: ['./lead-detail.component.css']
})
export class LeadDetailComponent implements OnInit {

  public _lead: Lead = <Lead>{};
  public _currentUser: User = <User>{};
  public _proposal: Proposal = <Proposal>{};
  public _currentLeadId: string = "";
  public _lead_status: any = LeadStatus;

  constructor(private _af: AngularFire, private _ns: NotificationService, private _ar: ActivatedRoute, private _ai: AuthInfo) {
    this._ar.params.subscribe((p) => {
      this._currentLeadId = p["id"];
      this._ai.getInfo().subscribe((ai) => {
        this._currentUser = ai;
        this.getLeadInfo(this._currentLeadId);
      })
    })
  }

  ngOnInit() {
    AppVendors.initialize();
  }

  getLeadInfo(id: string) {
    this._af.database.object('/leads/' + this._currentUser.accountId + '/' + id).map((lead: Lead) => lead).subscribe((ob) => {
      this._lead = ob;
      this._lead.data = this._lead.data;
      this._af.database.object('/people/' + this._lead.personKey).map((p: Person) => p).subscribe((person) => {
        this._lead.person = person;
        this._lead.person.data = this._lead.person.data;
      })
    })
  }

  changeLeadStatusByProposal(evt) {
    this._lead.status = evt.status;
    this._lead.proposal = evt.proposal;
    this._lead.proposal.closed = (evt.proposal.closed) ? true : false;
    this._proposal = this._lead.proposal;
    this.changeLeadStatus(this._lead);
  }

  changeLeadStatus(lead: Lead) {
    this._ns.addToast('Aguarde...', 'Estamos convertendo seu contato em uma venda!', 'wait');
    this._af.database.object('/revenues/' + lead.$key).$ref.on('value', ((snap) => {
      if (snap.numChildren() > 0) {
        this.updateLead(lead);
      } else {
        if (this._proposal.closed || lead.status == LeadStatus.done) {
          let revenue: Revenue = <Revenue>{ closed: true, price: this._proposal.price, createdAt: database.ServerValue.TIMESTAMP };
          this._af.database.object('/revenues/' + lead.$key).set(revenue).then((succe) => {
            this.updateLead(lead);
          }).catch((err) => {
            this._ns.clearAll();
            this._ns.addToast('Oppss', 'Ocorreu um erro na transformação do seu contato!', 'error');
          })
        } else {
          this.updateLead(lead);
        }
      }
    }))
  }

  updateLead(lead: Lead) {
    delete lead.person;
    delete lead.proposal;
    delete lead.revenue;

    this._af.database.object('/leads/' + this._currentUser.accountId + '/' + this._currentLeadId).update(lead).then((succ) => {
      this._ns.clearAll();
      this._ns.addToast('Ok', 'Parabéns! Seu contato se tornou uma venda.', 'success');
    }).catch((err) => {
      this._ns.clearAll();
      this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar atualizar o status do seu contato.', 'error');
    })
  }

  getProposal(proposal: Proposal) {
    this._proposal = {
      closed: (proposal.closed) ? proposal.closed : false,
      $key: proposal.$key,
      price: proposal.price,
      leadKey: this._currentLeadId,
      createdAt: proposal.createdAt,
      description: proposal.description
    };
    this._lead.proposal = this._proposal;
  }


}
