import { ApplicationRef, Component, ViewChild, Renderer, ElementRef /*NgZone, OnInit*/ } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, LoadingController } from 'ionic-angular';
import { PmiResultPage } from '../pmi-result/pmi-result';
import { HomePage } from "../home/home";
import { NativeAudio } from "@ionic-native/native-audio/ngx";
import { Subscription } from 'rxjs';
import { DeviceService } from '../../services/device-service';
import { Vibration } from '@ionic-native/vibration/ngx';

/**
 * Generated class for the PmiPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-pmi',
  templateUrl: 'pmi.html',
})
export class PmiPage {

  @ViewChild('histogramImg', { read: ElementRef }) histogramImg;
  @ViewChild('histogramColor', { read: ElementRef }) histogramColor;

  //Buffer de amostras
  samples: number[];

  subscription: Subscription
  loading: any

  //Variáveis do contador entre testes
  private countingDown: boolean = false;
  private countdown: number;

  //Controla o tamanho máximo do incentivador.
  private maximalValue: number;

  instructionText: string;
  testText: string;

  isMeasuring: boolean = false;
  measurementValue: number[] = [];
  maxValues: number[] = [0, 0, 0];
  graphPrescaler: number;

  enableStartButton: boolean = false;

  constructor(public nav: NavController, public navParams: NavParams,
    public toastCtrl: ToastController, public loadingCtrl: LoadingController,
    private nativeAudio: NativeAudio, public applicationRef: ApplicationRef, private deviceService: DeviceService,
    private vibration: Vibration, private renderer: Renderer) {

    this.samples = [];
    this.countdown = 59;
    this.maximalValue = 7.0;

    this.testText = "teste " + this.getEffortCounter();
    this.instructionText = "estamos prontos?";

    this.graphPrescaler = 0;
  }

  ionViewDidLoad() {
    this.isMeasuring = false;
    this.samples = [];
    //console.log("Page: PMI")
  }

  ionViewDidEnter() {
    this.setHistogramHeight(100);
    this.colorizeHistogram(100);

    setTimeout(() => {
      this.resetHistogram();
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

  startReadingData() {
    this.enableStartButton = false;
    this.instructionText = "inspire com força!";
    this.applicationRef.tick();

    let onNewValueReceived = pressureBuffer => {

      const VALUE_THRESHOLD: number = 7.0;
      const TIME_THRESHOLD: number = 200;

      let value = pressureBuffer;

      let part1 = (value & 0x0000FFFF) / 10;
      let part2 = (value >>> 16) / 10;

      //Descarta as amostras em caso de valores errados
      if (part1 < 500 && part2 < 500) {
        //setInstructionText(part2.toFixed(1));

        //Atualiza o incentivador 5 vezes por segundo, com a média dos
        //dois últimos valores recebidos
        this.graphPrescaler += 2;
        if (this.graphPrescaler % 20 == 0) {

          if (((part1 + part2) / 2) > 2) {
            this.modifyHistogram((part1 + part2) / 2);
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

          if (this.samples.length === TIME_THRESHOLD) {
            this.nativeAudio.play('ding', () => { /* */ });
          }

          //verifica se duas amostras passaram do limite
          if ((part1 < VALUE_THRESHOLD && part2 < VALUE_THRESHOLD) || this.samples.length >= TIME_THRESHOLD * 3) {
            this.isMeasuring = false;

            //Para a coleta de dados
            this.deviceService.stopReadingPressureValues()
              .then(() => {
                if (this.subscription != null) {
                  this.subscription.unsubscribe();
                }
                //console.log("OkiDoki");
              })
              .catch(() => {
                //console.log("Not so Doki...")
              })
              .finally(() => {
                let validMeasurement: boolean = false;

                //verifica o tempo
                if (this.samples.length >= TIME_THRESHOLD) {
                  let maxInOneSecond = 0;
                  let mean = this.samples[0];

                  validMeasurement = true;

                  //Corre todo o vetor
                  for (let i = 0; i < (this.samples.length - 100); i++) {
                    //Analisa o segundo de maior média
                    for (let j = i; j < (i + 100); j++) {
                      mean = (mean + this.samples[j]) / 2;
                    }
                    if (maxInOneSecond < mean) {
                      maxInOneSecond = mean;
                    }
                  }

                  //Guarda o valor para exibição
                  this.measurementValue.push(maxInOneSecond);

                  //Guarda os três maiores valores em ordem decrescente
                  if (maxInOneSecond > this.maxValues[0]) {
                    //Maior
                    this.maxValues[2] = this.maxValues[1];
                    this.maxValues[1] = this.maxValues[0];
                    this.maxValues[0] = maxInOneSecond;
                  }
                  else if (maxInOneSecond > this.maxValues[1]) {
                    //Segundo maior
                    this.maxValues[2] = this.maxValues[1];
                    this.maxValues[1] = maxInOneSecond;
                  }
                  else if (maxInOneSecond > this.maxValues[2]) {
                    //Terceiro maior
                    this.maxValues[2] = maxInOneSecond;
                  }

                  //Confere se há reprodutibilidade de pelo menos 3, e que o último valor não é o maior
                  if (this.measurementValue.length >= 3) {
                    if (this.maxValues[1] >= (this.maxValues[0] * 0.8) &&
                      this.maxValues[2] >= (this.maxValues[0] * 0.8) &&
                      this.measurementValue[this.measurementValue.length - 1] <= this.maxValues[0]) {
                      this.finish(this.maxValues[0], true);
                    }
                  }
                }

                //Caso não seja o último teste, reinicia
                if (this.measurementValue.length < 6) {
                  this.restartTest(validMeasurement);
                }
                else {
                  this.finish(this.maxValues[0], false);
                }

              })
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
        //console.error(`falha ao conectar ao dispositivo`, error)
        let toast = this.toastCtrl.create({
          message: "Falha ao conectar",
          duration: 3000,
          cssClass: 'error'
        })

        toast.present()
      })

  }

  //Informa se o teste foi válido ou não, reinicia as variáveis do teste e o histograma
  restartTest(validity: boolean) {
    this.samples = [];
    this.countdown = 59;
    this.countingDown = true;

    if (validity) {
      this.testText = "teste válido";
    }
    else {
      this.testText = "teste inválido";
    }

    this.instructionText = "descanse por ";

    this.resetHistogram();

    this.applicationRef.tick();

    setTimeout(() => {
      this.countTime();
    }, 1000);
  }

  //Muda a intensidade do vermelho do histograma
  colorizeHistogram(percentage: number) {
    percentage = percentage / 100;

    this.renderer.setElementStyle(this.histogramColor.nativeElement, 'opacity', percentage.toString());
  }

  //Reinicia o tamanho do histograma
  resetHistogram() {
    this.setHistogramHeight(0);
    this.colorizeHistogram(0);
  }

  //Modifica o tamanho do histograma
  setHistogramHeight(percentage: number) {
    //Coloca na faixa 62 até 100
    percentage = percentage * 95 / 100 + 5;

    if (percentage > 100) {
      percentage = 100;
    }

    if (percentage < 5) {
      percentage = 5;
    }

    percentage = percentage * 88 / 100;

    this.renderer.setElementStyle(this.histogramImg.nativeElement, 'height', percentage.toString() + '%');
    this.renderer.setElementStyle(this.histogramColor.nativeElement, 'height', percentage.toString() + '%');
  }

  //Modifica o histograma de acordo com o valor de pressão recebido.
  //O valor máximo é atualizado de acordo com os valores recebidos.
  modifyHistogram(value: number) {
    let modifier = value * 100 / this.maximalValue;

    this.setHistogramHeight(modifier);
    this.colorizeHistogram(modifier);
  }

  countTime() {

    if (this.decreaseCounter()) {
      this.vibration.vibrate(500);
      this.enableStartButton = true;
      this.countingDown = false;
      this.testText = "teste " + this.getEffortCounter();
      this.instructionText = "estamos prontos?"
      this.applicationRef.tick();
    }
    else {
      setTimeout(() => {
        this.countTime();
      }, 1000);
    }

    this.applicationRef.tick();
  }

  decreaseCounter(): boolean {
    this.countdown--;
    if (this.countdown < 0) {
      this.countdown = 59;
      return true;
    }
    return false;
  }

  getCountdownText(): string {
    let tmp = this.countdown + " segundos!"
    return tmp;
  }

  async finishAndGoPmiResultPage() {
    try {
      await this.deviceService.disconnect()

      let toast = this.toastCtrl.create({
        message: "Finalizado",
        duration: 3000,
        cssClass: 'success'
      })

      toast.present()

      this.nav.push(PmiResultPage, {
        result: 10
      });

    } catch (error) {
      //console.error(`falha ao finalizar`, error)
    }


  }

  showToast(msg: string) {
    let toast = this.toastCtrl.create({
      message: msg,
      duration: 4000
    });
    toast.present();
  }

  round(value, precision): number {
    var multiplier = Math.pow(10, precision || 0);

    if (typeof value != "number") {
      value = 0;
    }

    let ret = Math.round(value * multiplier) / multiplier;

    return ret;
  }

  earlyFinish() {
    this.finish(this.maxValues[0], false);
  }

  finish(result: number, reproductibility: boolean) {
    if (this.measurementValue.length < 3) {
      this.nav.setRoot(HomePage);
    }
    else {
      this.nav.push(PmiResultPage, {
        result: this.round(result, 1),
        repro: reproductibility
      });
    }
  }

  //Retorna o valor de uma manobra válida na posição determinada
  getMeasurementValue(index: number): number {
    if (this.measurementValue[index] == null) {
      return 0;
    }
    return this.round(this.measurementValue[index], 1);
  }

  //Retorna se há uma manobra válida na posição determinada
  isMeasurementeValueReady(index: number): boolean {
    if (this.measurementValue[index] == null) {
      return false;
    }
    return true;
  }

  //Retorna o número de manobras já realizadas
  getEffortCounter(): number {
    return (this.measurementValue.length + 1);
  }

  isCountingDown(): boolean {
    return this.countingDown;
  }

  setInstructionText(str: string) {
    this.instructionText = str;
    this.applicationRef.tick();
  }

}
