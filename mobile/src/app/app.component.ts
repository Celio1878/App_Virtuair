import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { AlertController } from 'ionic-angular';
import { ViewChild } from '@angular/core';
//import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';

// import pages
import { LoginPage } from '../pages/login/login';
//import { SignInPage } from '../pages/sign-in/sign-in';
//import { RescuePage } from '../pages/rescue/rescue';
//import { HomePage } from '../pages/home/home';
//import { PmiInstructionsPage } from '../pages/pmi-instructions/pmi-instructions'
//import { PmiPage } from '../pages/pmi/pmi';
//import { PmiResultPage } from "../pages/pmi-result/pmi-result";
//import { TrainingInstructionsPage } from '../pages/training-instructions/training-instructions'
//import { TrainingPage } from '../pages/training/training';
//import { TrainingResultPage } from '../pages/training-result/training-result'

import { NativeAudio } from "@ionic-native/native-audio/ngx";
import { DeviceService } from '../services/device-service';

import { Storage } from '@ionic/storage'
import { from } from 'rxjs';
//import { InAppBrowser } from '@ionic-native/in-app-browser/ngx'

@Component({
  templateUrl: 'app.html',
  queries: {
    nav: new ViewChild('content')
  }
})
export class MyApp {
  rootPage: any;
  nav: any;

  alertShown: boolean;

  constructor(public platform: Platform,
    splashScreen: SplashScreen,
    private nativeAudio: NativeAudio,
    private deviceService: DeviceService,
    private storage: Storage,
    private alertCtrl: AlertController) {

    this.alertShown = false;

    //Verifica se a plataforma est� pronta
    platform.ready().then(() => {

      this.storage.ready()
        .then(() => {
          this.storage.get('lastConnectedDevice')
            .then((devId) => {
              if (devId != null) {
                console.log(devId);
              }
            });
        })

      //Inicia o "ding"
      this.nativeAudio.unload('ding')
        .catch(() => { })
        .finally(() => {
          this.nativeAudio.preloadSimple('ding', 'assets/sounds/ding.mp3')
            .catch((err) => {
              //console.error("ding error: " + err)
            });
        });

      //Inicia o "beep"
      this.nativeAudio.unload('beep')
        .catch(() => { })
        .finally(() => {
          this.nativeAudio.preloadSimple('beep', 'assets/sounds/beep.mp3')
            .catch((err) => {
              //onsole.error("beep error: " + err)
            });
        });

      //Atualiza o status do BLE e Localização
      this.deviceService.checkStatus();

      //Verifica se est� em primeiro ou segundo plano
      platform.resume.subscribe((result) => {
        console.log("Front");
      });
      platform.pause.subscribe((result) => {
        console.log("Back");
      });

      this.platform.registerBackButtonAction(() => {
        if (this.nav.canGoBack()) {
          this.nav.pop();
        }
        else {
          if (this.alertShown == false) {
            this.presentConfirm();
          }
        }
      }, 0);

      splashScreen.hide();

      this.nav.setRoot(LoginPage);

    });

  }


  presentConfirm() {
    let alert = this.alertCtrl.create({
      title: 'Confirme a saída',
      message: 'Você quer sair?',
      buttons: [
        {
          text: 'Canclear',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
            this.alertShown = false;
          }
        },
        {
          text: 'Sim, sair.',
          handler: () => {
            console.log('Yes clicked');
            this.deviceService.disconnect()
            .catch(() => {
              console.log('Moio');
            })
            .finally(() => {
              this.platform.exitApp();
            })

          }
        }
      ]
    });
    alert.present().then(() => {
      this.alertShown = true;
    });
  }

}

