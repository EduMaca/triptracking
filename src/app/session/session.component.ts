import { Component, OnInit } from '@angular/core';


declare var $:any;

@Component({
  selector: 'app-session',
  templateUrl: './session.component.html',
})
export class SessionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    $("#base").css({"padding-left":0});
    $("#content").css({"padding-top":0});
  }

}
