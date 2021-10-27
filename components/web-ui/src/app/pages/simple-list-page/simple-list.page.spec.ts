import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleListPage } from './simple-list.page';

describe('SimpleListPageComponent', () => {
  let component: SimpleListPage;
  let fixture: ComponentFixture<SimpleListPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleListPage ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleListPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
