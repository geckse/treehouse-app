import { NgModule } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { RoomTileComponent } from './room-tile/room-tile.component';
import { HeaderComponent } from './header/header.component';
import { UserBubbleComponent } from './user-bubble/user-bubble.component';
import { UserBubbleListComponent } from './user-bubble-list/user-bubble-list.component';

export const components = [
  RoomTileComponent,
  HeaderComponent,
  UserBubbleComponent,
  UserBubbleListComponent
];

export const pipes = [

];

@NgModule({
  declarations: [components, pipes],
  imports: [CommonModule,FormsModule,IonicModule, RouterModule],
  exports: [components, pipes]
})
export class ComponentsModule {}
