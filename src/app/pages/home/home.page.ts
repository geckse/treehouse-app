import { Component, OnInit } from '@angular/core';

import { Room } from './../../models/Room';
import { RoomService } from './../../services/room-service/room-service';

import { ModalController, IonRouterOutlet } from '@ionic/angular';

import { CreateRoomPage } from './../create-room/create-room.page';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  rooms: Observable<Room[]>;

  constructor(private roomService: RoomService, private modalController: ModalController, private routerOutlet: IonRouterOutlet) {}

  ngOnInit(){
    this.rooms = this.roomService.getRooms();
    this.roomService.getRooms().pipe(take(1)).toPromise().then((rooms)=>{
      console.log(rooms);
    });
  }

  async openCreatePage() {
   const modal = await this.modalController.create({
     component: CreateRoomPage,
     cssClass: 'create-room-modal',
     swipeToClose: true,
     presentingElement: this.routerOutlet.nativeEl
   });
   return await modal.present();
  }

}
