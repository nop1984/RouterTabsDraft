import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynTabsComponent } from './dyn-tabs.component';

describe('DynTabsComponent', () => {
  let component: DynTabsComponent;
  let fixture: ComponentFixture<DynTabsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynTabsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
