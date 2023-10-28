import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PointsBarComponent } from './points-bar.component';

describe('PointsBarComponent', () => {
  let component: PointsBarComponent;
  let fixture: ComponentFixture<PointsBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PointsBarComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PointsBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
