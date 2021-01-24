import { Component, OnInit, Input } from '@angular/core';

import { User } from '../../models/User';
import { UserService } from './../../services/user-service/user-service';
import { RoomService } from './../../services/room-service/room-service';
import { AuthService } from './../../services/auth-service/auth-service';

@Component({
  selector: 'user-bubble',
  templateUrl: './user-bubble.component.html',
  styleUrls: ['./user-bubble.component.scss'],
})
export class UserBubbleComponent implements OnInit {

  @Input() user: User;

  constructor(private userService: UserService, private roomService: RoomService, private auth: AuthService) { }

  ngOnInit() {}

  onPartyClick(){
    if(this.user.uid == this.auth.currentUser.uid){
      this.roomService.bringMeBeer().then(()=>{
        // yes, we have beer
      });
    }
  }

}
