import { Component, OnInit, Input } from '@angular/core';

import { Room } from '../../models/Room';

@Component({
  selector: 'room-tile',
  templateUrl: './room-tile.component.html',
  styleUrls: ['./room-tile.component.scss'],
})
export class RoomTileComponent implements OnInit {

  _room: Room;
  @Input()
  set room(room: Room) {
    this._room = room;

    console.log(room);
    console.log('--- creator ----');
    // @ts-ignore
    console.log(this._room.creator.id);
    console.log( this._room.creator.firestore.data().userRef.get() );

  }
  get room(): Room { return this._room; }

  constructor() { }

  ngOnInit() {}

}
