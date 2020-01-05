import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ConfigPage } from './config';

@NgModule({
  declarations: [
    //PmiInstructionsPage,
  ],
  imports: [
    IonicPageModule.forChild(ConfigPage),
  ],
})
export class ConfigPageModule {}
