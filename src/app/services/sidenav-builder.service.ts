import { Injectable } from '@angular/core';
import { SidenavItem } from '../components/sidenav/sidenav-item/sidenav-item.component';

@Injectable({
  providedIn: 'root'
})
export class SidenavBuilderService {

  constructor() { }

  buildSidenav():SidenavItem[]{
    var sidenavItems: SidenavItem[] = []

    sidenavItems.push(
      {enabled:true,path:'users',icon:'people',selected:true, tooltip:'Users'}
    )
    sidenavItems.push(
      {enabled:true,path:'movements',icon:'timeline',selected:false,tooltip:'Movements'}
    )
    
    sidenavItems.push(
      {enabled:true,path:'info',icon:'info',selected:false,tooltip:'Informations'}
    )
    sidenavItems.push(
      {enabled:true,path:'settings',icon:'settings',selected:false,tooltip:'Settings'}
    )

    return sidenavItems
  }
}
