import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapBestTimeComponent } from './map-best-time.component';
import { RouterModule } from '@angular/router';

describe('MapBestTimeComponent', () => {
    let component: MapBestTimeComponent;
    let fixture: ComponentFixture<MapBestTimeComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [RouterModule],
            declarations: [MapBestTimeComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapBestTimeComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
