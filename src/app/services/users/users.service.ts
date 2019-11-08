import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { BaseHttpService } from '../baseHttp.service';
import { IUser } from '../../models/iUser';
import { Subject, observable } from 'rxjs';


@Injectable({
    providedIn: 'root'
})
export class UsersService extends BaseHttpService<IUser> {
    userObserv = new Subject<IUser>();
    showUserPopup = this.userObserv.asObservable();

    afterAddUpdateUserSub = new Subject<IUser>();
    afterAddUpdateUserObser = this.afterAddUpdateUserSub.asObservable();

    searchUserSub = new Subject<string>();
    searchUserObser = this.searchUserSub.asObservable();

    constructor(private http: HttpClient) {
        super(http, 'https://4jogr1c9tg.execute-api.ap-south-1.amazonaws.com/dev/', 'users');
    }
}
