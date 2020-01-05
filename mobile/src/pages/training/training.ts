import { ApplicationRef, Component, OnInit, ViewChild, Renderer, ElementRef } from '@angular/core';
import { NativeAudio } from "@ionic-native/native-audio/ngx";
import { IonicPage, LoadingController, NavController, NavParams, ToastController } from 'ionic-angular';
import { HomePage } from "../home/home";
import { TrainingResultPage } from '../training-result/training-result';
import { DeviceService } from '../../services/device-service';
import { Subscription } from 'rxjs';

import { Vibration } from '@ionic-native/vibration/ngx';
//import { EventListener } from '@angular/core/src/debug/debug_node';

/**
 * Generated class for the TrainingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-training',
  templateUrl: 'training.html',
})
export class TrainingPage implements OnInit {

  @ViewChild('innerCircle', { read: ElementRef }) innerCircle;

  ngOnInit(): void {
    //this.deviceService.setCurrentDeviceId("EF:1B:20:A0:16:D6")
  }

  trainingCounter: number;
  samples: number[];
  ignoreSample: boolean;

  graphPrescaler: number;

  //Variaves de controle da coleta
  readonly threshold: number = 100;
  isMeasuring: boolean;
  meanBuffer: number[];

  started: boolean;

  enableStartButton: boolean;

  reccomendedInspirations: number;
  reccomendedTime: number;

  motivationText: String;

  //Controla o tamanho máximo do incentivador.
  private maximalValue: number;

  subscription: Subscription

  loading: any

  constructor(public nav: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController, public ref: ApplicationRef,
    private nativeAudio: NativeAudio, private deviceService: DeviceService,
    private vibration: Vibration, private renderer: Renderer) {

    this.resetCycle();
    this.meanBuffer = [];

    this.maximalValue = 7.0;

    this.trainingCounter = 30;
    this.isMeasuring = false;
    this.started = false;
    this.ignoreSample = false;

    this.reccomendedInspirations = 30;
    this.reccomendedTime = 100;

    this.motivationText = "estamos prontos?"

    this.enableStartButton = false;

    this.graphPrescaler = 0;

  }

  ionViewWillEnter() {
    //console.log("Page: Training");
  }

  ionViewDidEnter() {
    this.setInnerCircleSize(102);
    setTimeout(() => {
      this.closeInnerCircle();
      this.enableStartButton = true;
    }, 1000);
  }

  ionViewWillLeave() {
    this.deviceService.stopReadingPressureValues()
      .catch(() => { /* Não precisou desativar o notify */ });
  }

  vibrateOnClick() {
    this.vibration.vibrate(30);
  }

  //Ativa as notificações da característica de pressão e lê os valores
  startReadingData() {
    this.started = true;
    this.setMotivationText("inspire fundo!");

    //let noActivityTimeout = setTimeout(() => {
    //  this.nav.popToRoot();
    //}, 30);

    let onNewValueReceived = pressureBuffer => {

      let value = pressureBuffer;

      const VALUE_THRESHOLD: number = 7.0;

      let part1 = (value & 0x0000FFFF) / 10;
      let part2 = (value >>> 16) / 10;

      //Descarta as amostras em caso de valores errados
      if (part1 < 500 && part2 < 500 && !this.ignoreSample) {
        //this.setMotivationText(part2.toFixed(1));

        //Atualiza o incentivador 5 vezes por segundo, com a média dos
        //dois últimos valores recebidos
        this.graphPrescaler += 2;
        if (this.graphPrescaler % 20 == 0) {

          if (((part1 + part2) / 2) > 2) {
            this.modifyInnerCircle((part1 + part2) / 2);
            this.graphPrescaler = 0;
            //console.log(part2)
          }
        }

        //verifica se duas amostras passaram do limite
        if (part1 >= VALUE_THRESHOLD && part2 >= VALUE_THRESHOLD && !this.isMeasuring) {
          this.isMeasuring = true;
        }

        if (this.isMeasuring) {

          //Acumula as amostras
          this.samples.push(part1);
          this.samples.push(part2);

          let auxMaximalValue = (part1 + part2) / 2;

          if (auxMaximalValue > this.maximalValue) {
            this.maximalValue = auxMaximalValue;
          }

          if (this.samples.length === this.reccomendedTime) {
            this.nativeAudio.play('beep', () => { /* */ });
            this.setMotivationText("expire!");
          }

          //verifica se duas amostras passaram do limite
          if ((part1 < VALUE_THRESHOLD && part2 < VALUE_THRESHOLD) || this.samples.length >= (this.reccomendedTime * 3)) {
            this.isMeasuring = false;
            this.ignoreSample = true;

            this.closeInnerCircle();
            this.ref.tick();

            //Espera pelo menos 1.5s
            if (this.samples.length >= this.reccomendedTime) {
              let sampleCounter = this.samples.length;

              let quartile: number = Math.floor(sampleCounter / 4);
              let tempMean: number = this.samples[quartile - 1];

              //Analisa os 50% centrais
              for (let i = quartile; i <= this.samples.length - quartile; i++) {
                tempMean = (tempMean + this.samples[i]) / 2;
              }

              this.meanBuffer.push(tempMean);

              this.trainingCounter = 30 - this.meanBuffer.length;

              //Atualiza o incentivador
              this.closeInnerCircle();
              this.ref.tick();

              setTimeout(() => {
                this.resetCycle();
                //this.startReadingData();
                this.ignoreSample = false;
              }, 500);

              if (this.trainingCounter == 0) {
                this.finish();
              }
            }
            else {
              this.closeInnerCircle();
              setTimeout(() => {
                this.resetCycle();
                //this.startReadingData();
                this.ignoreSample = false;
              }, 500);
            }
          }
        }

      }
    }

    if (this.subscription != null) {
      this.subscription.unsubscribe();
    }

    this.deviceService.startReadingPressureValues()
      .then(observable => {
        this.subscription = observable.subscribe(onNewValueReceived)
      })
      .catch(error => {
        let toast = this.toastCtrl.create({
          message: "Falha ao se comunicar com o dispositivo.",
          duration: 3000,
          cssClass: 'error'
        })

        //console.error('Read Start Fail: ', error)
        toast.present()
      })
  }

  //Reinicia os valores para o próximo ciclo
  resetCycle() {
    this.samples = [];
    this.setMotivationText("inspire fundo!");
  }

  //Configura o círculo de incentivo para o tamanho mínimo
  closeInnerCircle() {
    this.setInnerCircleSize(0);
  }

  //Modifica o tamanho do círculo de incentivo
  setInnerCircleSize(percentage: number) {
    //Coloca na faixa 62 até 100
    percentage = percentage * 38 / 100 + 62;

    //Garante o tamanho mínimo
    if (percentage < 62) {
      percentage = 62;
    }

    if (percentage > 100) {
      percentage = 100;
    }

    percentage = percentage * 98 / 100;

    this.renderer.setElementStyle(this.innerCircle.nativeElement, 'width', percentage.toString() + '%');
    this.renderer.setElementStyle(this.innerCircle.nativeElement, 'height', percentage.toString() + '%');
    this.ref.tick();
  }

  //Modifica o círculo de incentivo de acordo com o valor recebido,
  //e atualiza o valor máximo do círculo.
  modifyInnerCircle(value: number) {
    let modifier = value * 100 / this.maximalValue;
    this.setInnerCircleSize(modifier);
  }

  finish() {
    //Para a coleta de dados
    this.deviceService.stopReadingPressureValues()
      .then(() => {
        //console.log("OkiDoki");
      })
      .catch(() => {
        //console.log("Not so Doki...")
      });

    //Faz os cálculos necessários
    if (this.meanBuffer.length >= 5) {
      let med: number = 0;

      for (let i = 0; i < this.meanBuffer.length; i++) {
        med += this.meanBuffer[i];
      }

      med = (med / this.meanBuffer.length);

      let efforts = this.meanBuffer.length;

      this.resetCycle();
      this.meanBuffer = [];
      this.started = false;

      this.nav.push(TrainingResultPage, {
        med: this.round(med, 1),
        eff: efforts
      });

    } else {
      this.nav.setRoot(HomePage);
    }
  }

  async goTrainingResultPage() {
    try {

      let toast = this.toastCtrl.create({
        message: "Finalizado",
        duration: 3000,
        cssClass: 'success'
      })

      toast.present()
    } catch (error) {
      //console.error(`falha ao desconectar`, error)
    }

  }

  round(value, precision) {
    var multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  setMotivationText(str: String) {
    this.motivationText = str;
    this.ref.tick();
  }

}