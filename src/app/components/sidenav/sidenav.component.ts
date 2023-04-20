import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { SidenavBuilderService } from 'src/app/services/sidenav-builder.service';
import { SidenavItem } from './sidenav-item/sidenav-item.component';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
@Input()
  items:SidenavItem[] = []

  constructor(private sidenavService:SidenavBuilderService, private router:Router) { }

  ngOnInit(): void {
    this.items = this.sidenavService.buildSidenav()
    this.findoutRoute()
  }

  findoutRoute(){
    var split = window.location.pathname.split('/')
    var pathname = ''
    if (split.length >= 4){
      pathname = split[4]
    } else {
      pathname = split[1]
    }

    if (!pathname.includes("login") && !pathname.includes("message") && !pathname.includes("logout")){
      var selectedItem = this.items.filter( item => item.path == pathname)
      if(selectedItem.length > 0){
        this.items.map( (i) => {
          if(i.path != pathname){
            i.selected = false;
          } else {
            i.selected = true;
          }
        }) 
      } else {
        this.items.map( (i) => {
          if(i.path != 'settings'){
            i.selected = false;
          } else {
            i.selected = true;
          }
        })
      }
    }
    
  }

  changeSelected(item:SidenavItem){
    this.items.map( (i) => {
      if(i.path != item.path){
        i.selected = false;
      } 
    })
    this.router.navigate(["/",item.path]);
  }
}
