import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSubaccountComponent } from './new-subaccount.component';

describe('NewSubaccountComponent', () => {
  let component: NewSubaccountComponent;
  let fixture: ComponentFixture<NewSubaccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewSubaccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSubaccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
