import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RouterTabsComponent } from './router-tabs.component';

describe('RouterTabsComponent', () => {
  let component: RouterTabsComponent;
  let fixture: ComponentFixture<RouterTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RouterTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RouterTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
