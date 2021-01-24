import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Room } from './../../models/Room';
import { RoomService } from './../../services/room-service/room-service';
import { AuthService } from './../../services/auth-service/auth-service';


import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { forkJoin } from 'rxjs';
import { from, merge, of, zip } from 'rxjs';
import { combineAll, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-room',
  templateUrl: './room.page.html',
  styleUrls: ['./room.page.scss'],
})
export class RoomPage implements OnInit {

  creator$;
  speaker$;
  participants$;

  roomId: string;
  room: Observable<Room>;
  roomSync: Room;

  constructor(
    private activatedRoute: ActivatedRoute,
    private auth: AuthService,
    public roomService: RoomService
  ) {
    this.roomId = this.activatedRoute.snapshot.paramMap.get('roomId');
    this.auth.isReady().then( (userId) => {
        this.room = this.roomService.getRoomTest(this.roomId);

        this.room.subscribe((room)=>{

          // @ts-ignore
          this.roomSync = room.payload.data();
          // @ts-ignore
          this.roomSync.id = room.payload.id;

          this.creator$ = from(this.roomSync.creator.get()).pipe(
            map((x: any) => x.data())
          );

          this.speaker$ = forkJoin(this.roomSync.speaker.map(x => from(x.get()))).pipe(
            map(x => x.map((x:any) => x.data()))
          );

          this.participants$ = forkJoin(this.roomSync.participants.map(x => from(x.get()))).pipe(
            map(x => x.map((x:any) => x.data()))
          );

        });

    });
  }

  ngOnInit() {
  }

  joinRoom(){
    return this.roomService.joinRoom(this.roomSync);
  }
  leaveRoom(){
    return this.roomService.leaveRoom(this.roomSync);
  }
}
