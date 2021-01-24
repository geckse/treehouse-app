import { Component, OnInit, Input } from '@angular/core';
import { forkJoin } from 'rxjs';
import { from, merge, of, zip } from 'rxjs';
import { combineAll, map, switchMap } from 'rxjs/operators';

@Component({
  selector: 'user-bubble-list',
  templateUrl: './user-bubble-list.component.html',
  styleUrls: ['./user-bubble-list.component.scss'],
})
export class UserBubbleListComponent implements OnInit {

  userList$;

  title: string = "test";

  _list: any[];
  @Input()
  set list(list: any) {
    this._list = list;
    console.log(this._list);
    this.userList$ = forkJoin(this._list.map(x => from(x.get()))).pipe(
      map(x => x.map((x:any) => x.data()))
    );
  }
  get list(): any { return this._list; }

  constructor() { }

  ngOnInit() {}

}
