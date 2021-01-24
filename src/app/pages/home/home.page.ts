import { Component, OnInit } from '@angular/core';

import { Room } from './../../models/Room';
import { RoomService } from './../../services/room-service/room-service';

import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {

  rooms: Observable<Room[]>;

  constructor(private roomService: RoomService) {}

  ngOnInit(){
    this.rooms = this.roomService.getRooms();
    this.roomService.getRooms().pipe(take(1)).toPromise().then((rooms)=>{
      console.log(rooms);
    });
  }

}
