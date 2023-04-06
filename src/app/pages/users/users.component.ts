import { Component, OnInit } from '@angular/core';
import { JavaService } from 'src/app/services/java.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit{
  constructor(private javaService:JavaService, private localStorageService:LocalStorageService){}
  
  loggedUser!:any

  ngOnInit(): void {
    this.loggedUser = this.localStorageService.getLoggedUser()
    //console.log('user',this.loggedUser)
    this.javaService.getUsers().subscribe(
      {
        next: (res) => { console.log('users',res)},
        error: (err) => { console.log('users error',err)}
      }
    )
  }

}
