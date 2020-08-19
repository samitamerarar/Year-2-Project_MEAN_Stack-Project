import * as THREE from 'three';

const TEXTURE_LOADER = new THREE.TextureLoader();

export function loadTexture(url: string): Promise<THREE.Texture> {
    return new Promise<THREE.Texture>((resolve, reject) => {
        const texture = TEXTURE_LOADER.load(url,
            () => resolve(texture),
            () => {},
            reject
        );
    });
}
