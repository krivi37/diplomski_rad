import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FlashMessagesService } from 'angular2-flash-messages';
import { AdminService } from 'src/app/services/admin.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  users: Array<any>;
  usersVisible: boolean;
  addUserFormVisible: boolean;
  name: string;
  surname: string;
  email: string;
  username: string;
  password: string;
  secretQ: string;
  secretA: string;
  type: string;
  department: string;


  constructor(private flashMessage: FlashMessagesService, private adminService: AdminService) { }

  ngOnInit(): void {
    this.usersVisible = false;
    this.type = 'worker';
    this.adminService.getUsers().subscribe((data: any) => {
      if (!data.success) {
        console.log(data.msg);
        return false;
      }
      else {
        this.users = data.users;
      }
    });
  }

  toggleUsersVisible(): void {
    this.usersVisible = !this.usersVisible;
  }

  deleteUser(user: any): void {
    this.adminService.deleteUser(user).subscribe((data: any) => {
      if (!data.success) {
        console.log(data.msg);
        return false;
      }
      else {
        this.adminService.getUsers().subscribe((data: any) => {
          if (!data.success) {
            console.log(data.msg);
            return false;
          }
          else {
            this.flashMessage.show("Uspješno izbrisan korisnik", { cssClass: 'alert-success', timeout: 4000 });
            this.users = data.users;
          }
        });
      }
    });
  }

  toggleAddUsers(): void {
    this.addUserFormVisible = !this.addUserFormVisible;
  }

  registerUser(){
    const newUser = {
      name: this.name,
      surname: this.surname,
      email: this.email,
      username: this.username,
      password: this.password,
      secretQ: this.secretQ,
      secretA: this.secretA,
      type: this.type,
      department: this.department
    }

    if ((newUser.name == undefined || newUser.name == '') || (newUser.surname == undefined || newUser.surname == '') || (newUser.email == undefined || newUser.email == '')
      || (newUser.username == undefined || newUser.username == '') || (newUser.password == undefined || newUser.password == '') ||
      (newUser.secretQ == undefined || newUser.secretQ == '') || (newUser.secretA == undefined || newUser.secretA == '') ||
      (newUser.department == undefined || newUser.department == '')) {
      this.flashMessage.show("Sva polja moraju biti popunjena", { cssClass: 'alert-danger', timeout: 4000 });
      return false;
    }
    this.adminService.registerUser(newUser).subscribe((data: any) => {
      if (!data.success) {
        console.log(data.msg);
        return false;
      }
      else {
        this.adminService.getUsers().subscribe((data: any) => {
          if (!data.success) {
            console.log(data.msg);
            return false;
          }
          else {
            this.flashMessage.show("Uspješno dodat novi korisnik", { cssClass: 'alert-success', timeout: 4000 });
            this.users = data.users;
          }
        });
      }
    });
  }

}
