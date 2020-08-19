import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { InitialViewComponent } from './initial-view.component';
import { MapThumbnailComponent } from './map-thumbnail/map-thumbnail.component';
import { MapBestTimeComponent } from './map-best-time/map-best-time.component';
import { MapService } from '../services/map.service';
import { RouterModule } from '@angular/router';

describe('InitialViewComponent', () => {
    let component: InitialViewComponent;
    let fixture: ComponentFixture<InitialViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                RouterModule
            ],
            declarations: [
                InitialViewComponent,
                MapThumbnailComponent,
                MapBestTimeComponent
            ],
            providers: [ MapService ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(InitialViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
