import { Component, OnInit, TemplateRef, ViewChild, OnDestroy } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { NgForm } from '@angular/forms';

import { UsersService } from 'src/app/services/users/users.service';
import { IUser } from 'src/app/models/iUser';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-model',
  templateUrl: './user-model.component.html',
  styleUrls: ['./user-model.component.css']
})
export class UserModelComponent implements OnInit, OnDestroy {
  modalRef: BsModalRef;
  config = {
    keyboard: false,
    ignoreBackdropClick: true,
    class: 'modal-dialog-centered modal-md'
  };
  modalSubscription: Subscription;
  createSubscription: Subscription;
  putSubscription: Subscription;

  @ViewChild('template', { static: true }) template: TemplateRef<any>;
  user: IUser = {
    name: '',
    mobile: '',
    email: '',
    id: '',
    roleType: '',
    status: ''
  };
  isSubmited = false;
  showLoader = false;
  successMessage = '';

  strAction = 'Add';

  constructor(private modalService: BsModalService,
              private userService: UsersService) {

  }

  ngOnInit() {
    this.modalSubscription = this.userService.showUserPopup.subscribe(result => {
      this.user = Object.assign({}, result);
      this.user.id ? this.strAction = 'Edit': this.strAction= 'Add';
      this.openModal();
    });
  }

  hideModal() {
    this.modalRef.hide();
  }

  onSussess() {
    this.successMessage = 'Record had been saved.';
    setTimeout(() => {
      this.hideModal();
      this.showLoader = false;
      this.successMessage = '';
    }, 1000);
  }

  onError(error) {
    this.showLoader = false;
  }

  openModal() {
    this.modalRef = this.modalService.show(this.template, this.config );
  }

  onSubmitClick(f: NgForm) {
    this.isSubmited = true;
    if (f.valid) {
      this.showLoader = true;
      if (this.user && this.user.id === '') {
        this.user.status = 'Active';
        this. createSubscription = this.userService.create(this.user).subscribe(result => {
          this.onSussess();
        }, this.onError);
      } else {
        this.putSubscription = this.userService.put(this.user.id ,this.user).subscribe(result => {
          this.userService.afterAddUpdateUserSub.next(result);
          this.onSussess();
        }, this.onError);
      }
    }
  }

  ngOnDestroy() {
    this.modalSubscription.unsubscribe();
    this.createSubscription.unsubscribe();
    this.putSubscription.unsubscribe();
  }
}
