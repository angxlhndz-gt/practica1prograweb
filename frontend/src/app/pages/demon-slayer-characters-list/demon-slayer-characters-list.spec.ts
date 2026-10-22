import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DemonSlayerCharactersList} from './demon-slayer-characters-list';

describe('DemonSlayerCharactersList', () => {
  let component: DemonSlayerCharactersList;
  let fixture: ComponentFixture<DemonSlayerCharactersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DemonSlayerCharactersList]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DemonSlayerCharactersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
