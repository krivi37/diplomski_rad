import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SecretquestionComponent } from './secretquestion.component';

describe('SecretquestionComponent', () => {
  let component: SecretquestionComponent;
  let fixture: ComponentFixture<SecretquestionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SecretquestionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SecretquestionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
