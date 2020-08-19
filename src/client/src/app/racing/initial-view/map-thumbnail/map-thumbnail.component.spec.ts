import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapThumbnailComponent } from './map-thumbnail.component';
import { ItemGenerator } from '../../../admin-screen/map-editor/items/item-generator';

describe('MapThumbnailComponent', () => {
  let component: MapThumbnailComponent;
  let fixture: ComponentFixture<MapThumbnailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapThumbnailComponent ],
      providers: [ ItemGenerator ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapThumbnailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
