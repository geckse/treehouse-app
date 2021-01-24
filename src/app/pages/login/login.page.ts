import { Component, OnInit, ViewChild } from '@angular/core';
import { AlertController, LoadingController, ModalController, NavController, ToastController, IonRouterOutlet } from '@ionic/angular';

import { AuthService } from './../../services/auth-service/auth-service';
import { CanActivate, ActivatedRouteSnapshot,Router,  RouterStateSnapshot } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loading: any;

  email: string;
  password: string;

  constructor(
    private auth: AuthService,
    private alertCtrl: AlertController,
    private loadingCtrl: LoadingController,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    public router: Router,
    public navCtrl: NavController,
    private routerOutlet: IonRouterOutlet) { }

    ngOnInit() {
    }


    /*async openPasswordReset() {
      const modal = await this.modalCtrl.create({
        component: PasswordResetPage,
        swipeToClose: true,
        presentingElement: this.routerOutlet.nativeEl
      });
      await modal.present();
    }*/

    async performLogin() {

      const loading = await this.loadingCtrl.create({
        message: 'Loading'+'...',
        duration: 12000
      });
      await loading.present();

      // perform login
      this.auth.emailLogin(this.email,this.password).then( async (user) => {
        if (user) {
          await loading.dismiss();
          // success
          this.navCtrl.navigateRoot('/home',{ replaceUrl: true });
        } else {
          // feedback
          let alert = await this.alertCtrl.create({
            header: 'Login failed',
            subHeader: 'Password or Email doesn\'t match',
            buttons: ['Try again']
          });
          await alert.present();
          await loading.dismiss();
        }
      },
      async (error) => {
        console.log(error);
        // feedback
        let alert = await this.alertCtrl.create({
          header: 'Login failed',
          subHeader: 'Password or Email doesn\'t match',
          buttons: ['Try again']
        });
        await alert.present();
        await loading.dismiss();
      });
    }

  }
