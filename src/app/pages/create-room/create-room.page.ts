import { Component, OnInit } from '@angular/core';

import { Room } from './../../models/Room';
import { RoomService } from './../../services/room-service/room-service';
import { AuthService } from './../../services/auth-service/auth-service';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-create-room',
  templateUrl: './create-room.page.html',
  styleUrls: ['./create-room.page.scss'],
})
export class CreateRoomPage implements OnInit {

  room: Room;

  constructor(private roomService: RoomService, private auth: AuthService, private modalController: ModalController) { }

  ngOnInit() {
    this.room = {
      title: "",
      creator: this.auth.currentUserRef.ref,
      speaker: [this.auth.currentUserRef.ref],
      moderators: [],
      participants: []
    } as Room;
  }

  createRoom(){
    this.roomService.addRoom(this.room).then((saved)=>{
      this.modalController.dismiss({
        success: true,
        data: saved
      });
    });
  }

  dismiss(){
    this.modalController.dismiss({
      success: false,
      data: null
    });
  }

}
