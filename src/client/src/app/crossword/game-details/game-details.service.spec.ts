import { TestBed, inject } from '@angular/core/testing';

import { GameDetailsService } from './game-details.service';
import { PacketManagerClient } from '../../packet-manager-client';
import { packetManagerClient } from '../../packet-manager.service';

describe('GameDetailsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [{provide: PacketManagerClient, useValue: packetManagerClient},
        GameDetailsService]
    });
  });

  it('should be created', inject([GameDetailsService], (service: GameDetailsService) => {
    expect(service).toBeTruthy();
  }));
});
