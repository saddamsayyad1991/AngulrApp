import { Component, OnInit, TemplateRef } from '@angular/core';
import { UsersService } from 'src/app/services/users/users.service';
import { IUser } from 'src/app/models/iUser';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';


@Component({
  selector: 'app-users-header',
  templateUrl: './users-header.component.html',
  styleUrls: ['./users-header.component.css']
})
export class UsersHeaderComponent  {
  searchtext = '';
  constructor(private userService: UsersService) {

  }

  onClickShowModel() {
    const user: IUser = {
      email: '',
      name: '',
      id: '',
      mobile: '',
      roleType: '',
      status: ''
    };

    this.userService.userObserv.next(user);
  }

  onEnter() {
    this.userService.searchUserSub.next(this.searchtext);
  }

}
