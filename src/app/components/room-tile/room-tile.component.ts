import { Component, OnInit, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { from, merge, of, zip } from 'rxjs';
import { combineAll, map, switchMap } from 'rxjs/operators';

import { NavController } from '@ionic/angular';

import { Room } from '../../models/Room';

@Component({
  selector: 'room-tile',
  templateUrl: './room-tile.component.html',
  styleUrls: ['./room-tile.component.scss'],
})
export class RoomTileComponent implements OnInit {

  creator$;
  speakers$;

  _room: Room;
  @Input()
  set room(room: Room) {
    this._room = room;
    this.creator$ = from(room.creator.get()).pipe(
      map((x: any) => x.data())
    );

    this.speakers$ = forkJoin(room.speaker.map(x => from(x.get()))).pipe(
      map(x => x.map((x:any) => x.data()))
    );
  }
  get room(): Room { return this._room; }

  constructor(private navCtrl: NavController) {  }

  ngOnInit() { }

  enterRoom() {
    if(this._room && this._room.id){
      this.navCtrl.navigateForward('/room/'+this._room.id);
    }
  }

}
