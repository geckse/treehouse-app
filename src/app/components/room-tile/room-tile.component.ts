import { Component, OnInit, Input } from '@angular/core';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

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
      map((x:any) => x.data())
    );

    this.speakers$ = from(room.speaker[0].get()).pipe(
      map((x:any) => x.data())
    );

  }
  get room(): Room { return this._room; }

  constructor() { }

  ngOnInit() {}

}
