import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ToastController /*Tab, LoadingOptions, NavParams, Platform,*/ } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';
import { HomePage } from "../home/home";
import { SignInPage } from "../sign-in/sign-in";
import { RescuePage } from "../rescue/rescue";
import { Storage } from '@ionic/storage';
/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage implements OnInit {

   ngOnInit(): void {
      // this.deviceService.setCurrentDeviceId("EF:1B:20:A0:16:D6")
   }

   constructor(public nav: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
      public toast: ToastController, public afDB: AngularFireDatabase, private storage: Storage) { }

      ionViewDidLoad() {
   }

   goHomePage(){
      this.nav.push(HomePage, {}, {animate: true} );
   }

   goRescuePage(){
      this.nav.push(RescuePage);
   }

   goSignInPage(){
      this.nav.push(SignInPage);
   }

   screenHeight: any;
  screenWidth: any;

  openUrl() {
    window.open('https://www.nuresp.com.br/', '_system');
  }

  openInstagram() {
    window.open('https://www.instagram.com/nuresp.tmi/', '_system');
  }

  sendMail() {
    window.open('mailto:contato@nuresp.com.br', '_system');
  }

  openFacebook() {
    window.open('https://www.facebook.com/Nuresp-145736639452594/', '_system');
  }

  openPrivacyPolicy() {
    window.open('https://www.nuresp.com.br/privacy.html', '_system');
  }

  presentAlert(title: string, message: string, buttonText: string) {
   let alert = this.alertCtrl.create({
     title: title,
     message: message,
     buttons: [{
       text: buttonText,
       handler: () => {
         this.storage.set('firstTimeOpen', 'no');
       }
     }
     ],
     enableBackdropDismiss: false,
   });
   alert.present();
 }

}
