import { TestBed, inject } from '@angular/core/testing';

import { Skybox } from './skybox';

describe('Skybox', () => {

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                Skybox
            ]
        });
    });

    let skybox: Skybox;

    beforeEach(inject([Skybox], (skyboxInjected: Skybox) => {
        skybox = skyboxInjected;
    }));

    it('should be created', () => {
        expect(skybox).toBeTruthy();
    });

});
