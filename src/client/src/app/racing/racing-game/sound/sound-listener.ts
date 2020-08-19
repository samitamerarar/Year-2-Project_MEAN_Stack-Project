import * as THREE from 'three';

export interface SoundListener {
    listener: THREE.AudioListener;

    onListenerSet?(listener: THREE.AudioListener): void;
    onListenerRemove?(listener: THREE.AudioListener): void;
}
