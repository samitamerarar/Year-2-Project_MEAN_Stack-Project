import * as THREE from 'three';

export class OrthographicCamera extends THREE.OrthographicCamera {
    private static DISTANCE_TO_TARGET = 100;

    private static readonly WIDTH: number = window.innerWidth;
    private static readonly HEIGHT: number = window.innerHeight;
    private static readonly ORTHO_HEIGHT = 10;
    private static readonly ASPECT: number = OrthographicCamera.WIDTH / OrthographicCamera.HEIGHT;
    private static readonly NEAR: number = -OrthographicCamera.DISTANCE_TO_TARGET;
    private static readonly FAR: number = 500;

    private target: THREE.Object3D;

    public constructor() {
        super(
            -OrthographicCamera.ORTHO_HEIGHT / 2 * OrthographicCamera.ASPECT,
            OrthographicCamera.ORTHO_HEIGHT / 2 * OrthographicCamera.ASPECT,
            OrthographicCamera.ORTHO_HEIGHT / 2,
            -OrthographicCamera.ORTHO_HEIGHT / 2,
            OrthographicCamera.NEAR,
            OrthographicCamera.FAR
        );
        this.setupOrthographicView();
    }

    public setTarget(object: THREE.Object3D) {
        this.target = object;
    }

    public updatePosition() {
        this.position.copy(this.target.position).add(new THREE.Vector3(0, OrthographicCamera.DISTANCE_TO_TARGET, 0));
    }

    private setupOrthographicView(): void {
        this.rotation.order = 'YXZ';
        this.rotateX(-Math.PI / 2);
    }

}
