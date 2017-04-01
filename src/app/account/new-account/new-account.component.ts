import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire } from 'angularfire2';
import { NotificationService } from '../../shared/services/notification/notification.service';
import { Account, AccountTypes} from '../../shared/models/models';

@Component({
  selector: 'app-new-account',
  templateUrl: './new-account.component.html',
  styleUrls: ['./new-account.component.css']
})
export class NewAccountComponent implements OnInit {

  public _account: Account = <Account>{};
  public _accountTypes: any = AccountTypes;

  constructor(private _r: Router, private _af: AngularFire, private _ns: NotificationService) { }

  ngOnInit() {
  }

  submit() {
    this._ns.addToast('Processando...', 'Aguarde enquanto conferimos as informações.', 'wait');
    this._account.users = 1;
    this._af.auth.subscribe((auth_info) => {
      this._af.database.list('/accounts/').push(this._account).then((account_inserted) => {
        this._af.database.object('/users/'+auth_info.uid).update({accountId: account_inserted.key}).then((user_updated) => {
          this._ns.clearAll();
          this._ns.addToast('Ok', 'Estamos prontos para comerçar. Use com todo carinho!', 'success');
          this._r.navigate(['/']);
        }).catch((err) => {
          this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar criar suas informações de perfil', 'error');
          this._af.database.object('/accounts/'+account_inserted.key).remove();
        })
      }).catch((err) => {
          this._ns.addToast('Oppss', 'Ocorreu um erro ao tentar criar suas informações de perfil', 'error');
      })
    })
  }

}
