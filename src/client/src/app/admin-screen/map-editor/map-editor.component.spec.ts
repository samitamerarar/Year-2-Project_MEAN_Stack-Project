import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { MapEditorComponent } from './map-editor.component';
import { MapService } from '../../racing/services/map.service';
import { ItemGenerator } from './items/item-generator';

describe('MapEditorComponent', () => {
    let component: MapEditorComponent;
    let fixture: ComponentFixture<MapEditorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                MapEditorComponent
            ],
            imports: [
                FormsModule,
                HttpModule
            ],
            providers: [
                MapService,
                ItemGenerator
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MapEditorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should be created', () => {
        expect(component).toBeTruthy();
    });
});
