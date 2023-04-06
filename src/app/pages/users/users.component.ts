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
  users:any[] = []

  ngOnInit(): void {
    this.loggedUser = this.localStorageService.getLoggedUser()
    //console.log('user',this.loggedUser)
    this.javaService.getUsers().subscribe(
      {
        next: (res) => { 
          console.log('users',res)
          this.users = res as any[]
        },
        error: (err) => { console.log('users error',err)}
      }
    )
  }

  changeRole(event:any,user:any){
    user.role.roleName = this.getSelectedOption(event.target.options)?.innerText
    this.javaService.updateUser(user).subscribe(
      {
        next: (res)=> {
          console.log('usuario atualizado', res)
        },
        error: (err) => {
          console.log('error', err)
        }
      }
    )
  }

  changeEnabled(event:any,user:any){
    user.enabled = event.target.checked
    this.javaService.updateUser(user).subscribe(
      {
        next: (res)=> {
          console.log('usuario atualizado', res)
        },
        error: (err) => {
          console.log('error', err)
        }
      }
    )
  }

  getSelectedOption(options:HTMLOptionsCollection){
    return options.item(options.selectedIndex)
  }
}
