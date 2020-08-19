import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AdminScreenComponent } from './admin-screen.component';
import { MapEditorComponent } from './map-editor/map-editor.component';
import { PacketManagerService, packetManagerClient } from '../packet-manager.service';
import { PacketManagerClient } from '../packet-manager-client';
import { MapService } from '../racing/services/map.service';
import { AdminConfigComponent } from './admin-config/admin-config.component';
import { HttpClientModule } from '@angular/common/http';
import { AdminConfigService } from './admin-config.service';
import { ItemGenerator } from './map-editor/items/item-generator';

describe('AdminScreenComponent', () => {
  let component: AdminScreenComponent;
  let fixture: ComponentFixture<AdminScreenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        HttpModule,
        HttpClientModule
      ],
      declarations: [
        AdminScreenComponent,
        MapEditorComponent,
        AdminConfigComponent
      ],
      providers: [
          PacketManagerService,
          {provide: PacketManagerClient, useValue: packetManagerClient},
          MapService,
          AdminConfigService,
          ItemGenerator
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
