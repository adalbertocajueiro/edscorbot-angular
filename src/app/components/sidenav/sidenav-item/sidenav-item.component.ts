import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';



export type SidenavItem = {
  selected: boolean,
  path: string,
  icon: string,
  enabled:boolean,
  tooltip:string
}

@Component({
  selector: 'app-sidenav-item',
  templateUrl: './sidenav-item.component.html',
  styleUrls: ['./sidenav-item.component.scss']
})


export class SidenavItemComponent implements OnInit {

  @Input()
  item: SidenavItem = {selected:false,path:'',icon:'',enabled:true,tooltip:''};

  @Output()
  onClick:EventEmitter<SidenavItem> = new EventEmitter<SidenavItem>();

  constructor() { }

  ngOnInit(): void {
  }

  clicked(){
    this.item.selected = true;
    this.onClick.emit(this.item);
  }
}
