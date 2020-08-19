import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { ConfirmationComponent } from './confirmation.component';
import { MenuAutomatonService } from '../menu-automaton.service';
import { UserChoiceService } from '../user-choice.service';

describe('ConfirmationComponent', () => {
    let component: ConfirmationComponent;
    let fixture: ComponentFixture<ConfirmationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                FormsModule
            ],
            declarations: [
                ConfirmationComponent
            ],
            providers: [
                MenuAutomatonService,
                UserChoiceService
            ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfirmationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
