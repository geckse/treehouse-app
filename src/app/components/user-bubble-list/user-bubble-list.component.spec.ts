import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UserBubbleListComponent } from './user-bubble-list.component';

describe('UserBubbleListComponent', () => {
  let component: UserBubbleListComponent;
  let fixture: ComponentFixture<UserBubbleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserBubbleListComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UserBubbleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
