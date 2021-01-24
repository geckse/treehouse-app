import { Component, OnInit, Input } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {

  @Input() page: string = "default";

  constructor(private navCtrl: NavController) { }

  ngOnInit() {}

  goHome() {
    this.navCtrl.navigateBack('/home');
  }

}
