import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewvoterPage } from './newvoter.page';

describe('NewvoterPage', () => {
  let component: NewvoterPage;
  let fixture: ComponentFixture<NewvoterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewvoterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewvoterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
