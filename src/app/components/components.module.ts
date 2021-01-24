import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

export const components = [

];

export const pipes = [

];

@NgModule({
  declarations: [components, pipes],
  imports: [CommonModule,FormsModule,IonicModule, RouterModule],
  exports: [components, pipes]
})
export class ComponentsModule {}
