import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VoterPage } from './voter.page';

describe('VoterPage', () => {
  let component: VoterPage;
  let fixture: ComponentFixture<VoterPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VoterPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VoterPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
