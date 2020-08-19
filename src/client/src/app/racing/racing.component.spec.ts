import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpModule } from '@angular/http';

import { RacingComponent } from './racing.component';
import { InitialViewComponent } from './initial-view/initial-view.component';
import { MapThumbnailComponent } from './initial-view/map-thumbnail/map-thumbnail.component';
import { MapBestTimeComponent } from './initial-view/map-best-time/map-best-time.component';
import { MapService } from './services/map.service';
import { RouterModule } from '@angular/router';

describe('RacingComponent', () => {
    let component: RacingComponent;
    let fixture: ComponentFixture<RacingComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpModule,
                RouterModule
            ],
            declarations: [
                RacingComponent,
                InitialViewComponent,
                MapThumbnailComponent,
                MapBestTimeComponent
            ],
            providers: [
                MapService
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RacingComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
