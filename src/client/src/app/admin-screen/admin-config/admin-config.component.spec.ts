import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminConfigComponent } from './admin-config.component';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { AdminConfigService } from '../admin-config.service';
import { HttpClientModule } from '@angular/common/http';

describe('AdminConfigComponent', () => {
    let component: AdminConfigComponent;
    let fixture: ComponentFixture<AdminConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserModule,
                HttpModule,
                FormsModule,
                HttpClientModule
            ],
            declarations: [AdminConfigComponent],
            providers: [AdminConfigService]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AdminConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
