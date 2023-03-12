import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GraphplotComponent } from './graphplot.component';

describe('GraphplotComponent', () => {
  let component: GraphplotComponent;
  let fixture: ComponentFixture<GraphplotComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GraphplotComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GraphplotComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
