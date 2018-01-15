import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DynTable } from './dyn-table.component';

describe('DynTable2Component', () => {
  let component: DynTable;
  let fixture: ComponentFixture<DynTable>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DynTable ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DynTable);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
