import { TestBed, inject } from '@angular/core/testing';

import { UIInputs } from './ui-input.service';
import { EventManager } from '../../event-manager.service';

describe('UIInputService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [UIInputs, EventManager]
        });
    });

    it('should be created', inject([UIInputs], (service: UIInputs) => {
        expect(service).toBeTruthy();
    }));
});
