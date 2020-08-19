import * as THREE from 'three';
import { Decoration } from './decoration';

export class Building extends Decoration {

    constructor() {
        super(new THREE.BoxGeometry(3, 10, 5).translate(0, 5, 0),
            new THREE.MeshPhongMaterial({ specular: 10, color: 0xA47840 }));
    }
}
