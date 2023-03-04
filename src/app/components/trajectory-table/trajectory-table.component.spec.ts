import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoryTableComponent } from './trajectory-table.component';

describe('TrajectoryTableComponent', () => {
  let component: TrajectoryTableComponent;
  let fixture: ComponentFixture<TrajectoryTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrajectoryTableComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrajectoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
