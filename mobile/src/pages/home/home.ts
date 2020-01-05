import { Component, OnInit/*, ChangeDetectorRef, HostListener*/ } from '@angular/core';
import { IonicPage, NavController, LoadingController, AlertController, ToastController /*Tab, LoadingOptions, NavParams, Platform,*/ } from 'ionic-angular';
import { AngularFireDatabase } from '@angular/fire/database';

//Pages
import { LoginPage } from '../login/login';
import { ConfigPage } from '../config/config';
import { TrainingInstructionsPage } from '../training-instructions/training-instructions';
import { DeviceConnectPage } from '../device-connect/device-connect';
import { PmiInstructionsPage } from '../pmi-instructions/pmi-instructions';
import { TrainingPage } from '../training/training';
import { PmiPage } from '../pmi/pmi';

//Services
import { Subscription } from "rxjs/Rx";
import { DeviceService } from '../../services/device-service';
import { CRMService } from '../../providers/crm-service';

import { Vibration } from '@ionic-native/vibration/ngx';
import { Storage } from '@ionic/storage'


//import { app } from 'firebase';

//declare var google: any;

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
})
export class HomePage implements OnInit {

  ngOnInit(): void {
    // this.deviceService.setCurrentDeviceId("EF:1B:20:A0:16:D6")

  }

  privacyText: string;

  // loading object
  loading: any;
  unpairedDevices: any;
  pairedDevices: any;
  gettingDevices: Boolean;
  isConnected: boolean = false;
  subscription: Subscription = new Subscription();
  constructor(public nav: NavController, public alertCtrl: AlertController, public loadingCtrl: LoadingController,
    public toast: ToastController, public afDB: AngularFireDatabase,
    private deviceService: DeviceService, private crmService: CRMService, private vibration: Vibration, private storage: Storage) {

    this.privacyText = '<div style="overflow: scroll !important;">\
                        Este termo representa um adendo aos \
                        <a href="https://www.nuresp.com.br/privacy.html">Termos e Instruções de Uso e Política \
                        de Privacidade</a>.\
                        <br><br>\
                        Este aplicativo coleta dados relativos aos exercícios respiratórios\
                        realizados no equipamento VirtuAir via Bluetooth, mais especificamente \
                        de pressão e ciclo inspiratório, bem como a quantidade de inspirações \
                        realizadas durante o treinamento.\
                        <br><br>\
                        Esses dados são enviados para a nuvem da Nuresp de maneira anônima onde são encriptados e então vinculados \
                        ao equipamento VirtuAir utilizado pelo usuário para realização dos\
                        exercícios. Nesse momento esses dados são disponibilizados ao profissional \
                        responsável que realizou o cadastro do usuário na plataforma para que \
                        ele possa acompanhar a evolução do treinamento muscular respiratório \
                        remotamente para fins de ajustes de protocolo de treinamento.\
                        <br><br>\
                        Para estabelecer a conexão como equipamento VirtuAir, o aplicativo \
                        também precisa das permissões de uso do Bluetooth e Localização para \
                        procurar pelos dispositivos VirtuAir próximos. Esses dados não são \
                        armazenados, tampouco compartilhados com a Nuresp ou qualquer outro parceiro.\
                        </div>';
  }

  ionViewDidEnter() {

    //Verifica se é a primeira vez que o app é aberto
    this.storage.ready()
      .then(() => {
        this.storage.get('firstTimeOpen').then((val) => {
          if (val === null) {
            this.presentAlert('Dados e privacidade', this.privacyText, 'Concordo e quero continuar');
          }
          //console.log('Answer is ' + val);
        });
      });

    //console.log("Page: Home");
  }

  vibrateOnClick() {
    this.vibration.vibrate(30);
  }

  screenHeight: any;
  screenWidth: any;

  //@HostListener('window:resize', ['$event'])
  //getScreenSize(event?) {
  //  this.screenHeight = window.innerHeight * window.devicePixelRatio;
  //  this.screenWidth = window.innerWidth * window.devicePixelRatio;
  //console.log(this.screenHeight, this.screenWidth);
  //}

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Aguarde um momento...'
    });
    this.loading.present();
  }

  showConnect() {
    this.loading = this.loadingCtrl.create({
      content: 'Tentando conectar ao aparelho...'
    });
    this.loading.present();
  }

  hideLoading() {
    this.loading.dismiss();
  }

  goLoginPage() {
     this.nav.push(LoginPage)
  }

  goTrainingInstructionsPage() {
    this.nav.push(TrainingInstructionsPage)

  }

  goPmiInstructionsPage() {
    this.nav.push(PmiInstructionsPage);
  }

  goDeviceConnectPage() {
    this.nav.push(DeviceConnectPage, {
    });
  }

  goTrainingPage() {
    this.nav.push(TrainingPage, {
    });
  }

  goPmiPage() {
    this.nav.push(PmiPage, {
    });
  }

  goConfigPage() {
    this.nav.push(ConfigPage, {
    });
  }

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

  isDeviceSelected() {
    return this.deviceService.isConnected();
  }


  async testSaveTrainningAndPMIResultToDatabase() {
    try {
      let serial = await this.deviceService.getSerialId()

      await this.crmService.setCurrentSerial(serial.valueOf());

      await this.crmService.saveTrainingResult({ med: 1, efficacy: 2 })

      await this.crmService.savePMIResult(7)

      //console.log('ok')
    } catch (error) {
      //console.error(error)
    }
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
