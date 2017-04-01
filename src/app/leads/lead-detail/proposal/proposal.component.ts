import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { database } from 'firebase';
import { NotificationService } from '../../../shared/services/notification/notification.service';
import { Lead, LeadStatus, Proposal } from '../../../shared/models/models';

@Component({
  selector: 'app-proposal',
  templateUrl: './proposal.component.html',
  styleUrls: ['./proposal.component.css']
})
export class ProposalComponent implements OnInit {

  @Input() lead_id: string;
  @Output() changeLeadStatus: EventEmitter<any> = new EventEmitter();
  @Output() haveProposal: EventEmitter<Proposal> = new EventEmitter();

  public proposal_setting: boolean = false;
  public _proposal: Proposal = <Proposal>{};

  constructor(private _af: AngularFire, private _ns: NotificationService) { }

  ngOnInit() {
    this.getProposal();
    this.onRevenueAdded();
  }

  getProposal() {
    this._af.database.object('/proposals/' + this.lead_id).$ref.once('value').then((val) => {
      val.forEach((proposal) => {
        if(proposal.val().createdAt != null) {
          this._proposal = proposal.val();
          this._proposal.$key = proposal.key;
          this.haveProposal.emit(this._proposal);
        }
      })
    })
  }

  cancelPropose() {
    this._proposal = <Proposal>{};
    this.proposal_setting = !this.proposal_setting;
  }

  onRevenueAdded() {
    this._af.database.object('/revenues/' + this.lead_id).$ref.on('child_changed', ((snap) => {
     this._proposal.closed = true;
     this.updateProposal();
    }))
  }

  saveProposal() {
    this._ns.addToast('Aguarde...', 'Estamos criando uma proposta para seu cliente!', 'wait');
    this._proposal.createdAt = database.ServerValue.TIMESTAMP;
    this._af.database.list('/proposals/' + this.lead_id).push(this._proposal).then((succ) => {
      if (this._proposal.closed) {
        this._af.database.list('/revenues/' + this.lead_id).push({ price: this._proposal.price, createdAt: database.ServerValue.TIMESTAMP }).then((succ) => {
          
          this.changeLeadStatus.emit({status: LeadStatus.done, proposal: this._proposal});
          this._ns.clearAll();
          this._ns.addToast('Ok', 'Sua proposta foi cadastrada com êxito!', 'success');
        }).catch((err) => {
          this._ns.clearAll();
          this._ns.addToast('Oppss', 'Ocorreu um erro ao cadastrar sua propoata! Tente novamente.', 'error');
        })
      } else {
        this._proposal.$key = succ.key;
        this.changeLeadStatus.emit({status: LeadStatus.responsed, proposal: this._proposal});
        this._ns.clearAll();
        this._ns.addToast('Ok', 'Sua proposta foi cadastrada com êxito!', 'success');
      }
    }).catch((err) => {
      this._ns.clearAll();
      this._ns.addToast('Oppss', 'Ocorreu um erro ao cadastrar sua propoata! Tente novamente.', 'error');
    });
    this.proposal_setting = !this.proposal_setting;

  }

  updateProposal() {
    this._af.database.object('/proposals/' + this.lead_id + '/' + this._proposal.$key).set({
      closed: true,
      description: this._proposal.description,
      price: this._proposal.price,
      createdAt: this._proposal.createdAt,
      leadKey: this.lead_id
    }).then((succ) => {

    }).catch((err) => {})
  }



}
