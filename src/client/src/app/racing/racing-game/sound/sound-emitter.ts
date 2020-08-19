import * as THREE from 'three';
import { Sound } from './sound';

export interface SoundEmitter {
    readonly eventAudios: Map<Sound, THREE.PositionalAudio>;
    readonly constantAudios: Map<Sound, THREE.PositionalAudio>;

    readonly eventSounds: Sound[];
    readonly constantSounds: Sound[];

    onAudioSet?(sound: Sound, audio: THREE.PositionalAudio): void;
    onAudioRemove?(sound: Sound, audio: THREE.PositionalAudio): void;
}
