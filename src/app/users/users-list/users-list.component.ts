import { Component, OnInit, OnDestroy } from '@angular/core';
import { ISearchResponse } from 'src/app/models/iSearchResponse';
import { UsersService } from 'src/app/services/users/users.service';
import { IUser } from 'src/app/models/iUser';
import { HttpParams } from '@angular/common/http';
import { timeout } from 'q';
import { Subscribable, Subscription } from 'rxjs';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css']
})
export class UsersListComponent implements OnInit, OnDestroy {
  pageLimit = 15;
  listCompleted = false;
  freshRecords = true;
  isLoading = false;
  onScrollTriggered  = false;
  lastKey = '';
  searchText = '';

  modalScrollDistance = 2;
  modalScrollThrottle = 50;

  userListSubscription: Subscription;
  afterUpdateSubscription: Subscription;
  searchTextSubscription: Subscription;


  usersList: IUser[];
  constructor(private usersService: UsersService) {
  }

  // get users list
  loadList(params: HttpParams) {
    this.isLoading = true;
    this.userListSubscription = this.usersService.getList(params).subscribe( result => {
        setTimeout(() => {
          this.onScrollTriggered = false;
          this.usersList = !this.freshRecords ? this.usersList.concat(result.Items) : result.Items;
          result.lastEvaluatedKey === undefined ? this.listCompleted = true : this.listCompleted = false;
          this.lastKey = result.lastEvaluatedKey ? result.lastEvaluatedKey.id + ',' + result.lastEvaluatedKey.name : '';
          this.isLoading = false;
          this.freshRecords = false;
        }, 1000);

    }, err => {
      this.isLoading = false;
    });
  }

  ngOnInit() {
    this.loadList(this.setParams());
    
    this.afterUpdateSubscription = this.usersService.afterAddUpdateUserSub.subscribe(result => {
      this.usersList.forEach((element, index) => {
        if (element.id === result.id) {
          this.usersList[index] = Object.assign({}, result);
        }
      });
    });

    this.searchTextSubscription = this.usersService.searchUserObser.subscribe( result => {
      this.searchText = result;
      this.freshRecords = true;
      this.loadList(this.setParams());
    });
  }

  // called on edit click
  onClickShowModel(user: IUser) {
    this.usersService.userObserv.next(user);
  }

  // set query params for get request
  setParams(): HttpParams {
    return new HttpParams().set('limit', this.pageLimit.toString())
      .set('lKey', this.lastKey)
      .set('search', this.searchText);
  }

  // function gets called when scroll reached bottom
  onScroll() {
    if (!this.listCompleted && !this.onScrollTriggered) {
      this.onScrollTriggered = true;
      this.loadList(this.setParams());
    }
  }

  // set image to status column based of users status
  setStatusImage(ststus: string) {
    switch (ststus) {
      case 'Pending':
            return '../../../assets/ico_pending.svg';
            break;
      case 'Inactive':
            return '../../../assets/ico_inactive.svg';
            break;
      case 'Active':
          return '../../../assets/ico_active.svg';
          break;
    }
  }

  ngOnDestroy(){
    this.userListSubscription.unsubscribe();
    this.afterUpdateSubscription.unsubscribe();
    this.searchTextSubscription.unsubscribe();
  }

}
