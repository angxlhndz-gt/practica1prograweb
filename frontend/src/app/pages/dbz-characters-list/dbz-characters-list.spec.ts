import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DbzCharactersList } from './dbz-characters-list';

describe('DbzCharactersList', () => {
  let component: DbzCharactersList;
  let fixture: ComponentFixture<DbzCharactersList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DbzCharactersList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DbzCharactersList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
