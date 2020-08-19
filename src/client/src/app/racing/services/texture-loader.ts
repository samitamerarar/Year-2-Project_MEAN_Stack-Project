import { Injectable } from '@angular/core';
import * as THREE from 'three';

@Injectable()
export class TextureLoader {
    private static readonly THREE_TEXTURE_LOADER = new THREE.TextureLoader();
    private static readonly INSTANCE = new TextureLoader();

    private constructor() {}

    public static getInstance(): TextureLoader {
        return TextureLoader.INSTANCE;
    }

    public load(url: string): Promise<THREE.Texture> {
        return new Promise((resolve, reject) => {
            TextureLoader.THREE_TEXTURE_LOADER.load(url, resolve, () => {}, reject);
        });
    }
}

export const textureLoaderValue = TextureLoader.getInstance();
