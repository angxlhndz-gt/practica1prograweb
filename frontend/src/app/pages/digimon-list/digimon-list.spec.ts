import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DigimonList} from './digimon-list';

describe('DigimonList', () => {
  let component: DigimonList;
  let fixture: ComponentFixture<DigimonList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DigimonList]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DigimonList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
