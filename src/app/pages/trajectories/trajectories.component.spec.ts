import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajectoriesComponent } from './trajectories.component';

describe('TrajectoriesComponent', () => {
  let component: TrajectoriesComponent;
  let fixture: ComponentFixture<TrajectoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TrajectoriesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TrajectoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
