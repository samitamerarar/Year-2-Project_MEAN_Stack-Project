import { TestBed, inject } from '@angular/core/testing';

import { AdminConfigService } from './admin-config.service';
import { HttpClientModule } from '@angular/common/http';

describe('AdminConfigService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [HttpClientModule],
            providers: [AdminConfigService]
        });
    });

    it('should be created', inject([AdminConfigService], (service: AdminConfigService) => {
        expect(service).toBeTruthy();
    }));
});
