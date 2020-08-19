import * as THREE from 'three';

import { Skybox } from '../models/skybox/skybox';
import { OrthographicCamera } from './orthographic-camera';
import { PerspectiveCamera } from './perspective-camera';
import { DayMode, DayModeManager } from '../day-mode/day-mode-manager';
import { EventManager } from '../../../event-manager.service';
import { Lighting } from '../models/lighting/lighting';
import { RenderableMap } from '../racing-game-map/renderable-map';
import { HUD } from './hud';
import { GameInfoService } from '../game-info.service';

export type CameraId = 0 | 1;

export class RacingRenderer extends THREE.WebGLRenderer {
    public static readonly DEFAULT_DAYMODE = DayMode.DAY;
    private static readonly AXIS_HELPER: THREE.AxisHelper = new THREE.AxisHelper(1);
    private static readonly REAR_VIEW_POSITION_X_FACTOR_TO_SCREENSIZE = 0.5;
    private static readonly REAR_VIEW_POSITION_Y_FACTOR_TO_SCREENSIZE = 0.12;
    private static readonly REAR_VIEW_FACTOR_TO_SCREENSIZE = 0.20;
    private static readonly REAR_VIEW_CAMERA_POSITION = new THREE.Vector3(0, 1.5, 1.5);
    private static readonly REAR_VIEW_CAMERA_ROTATION = new THREE.Vector3(0, 1, 0);

    private canvasContainer: HTMLDivElement;

    public renderTarget;
    protected readonly scene = new THREE.Scene();
    protected readonly lighting = new Lighting();
    protected readonly skybox = new Skybox();
    protected readonly cameras: [PerspectiveCamera, OrthographicCamera] = [null, null];
    protected readonly rearViewCamera: PerspectiveCamera;

    private animationRequestId = -1;
    private isRendering = false;
    private rearViewFactorToScreenSize = RacingRenderer.REAR_VIEW_FACTOR_TO_SCREENSIZE;

    private readonly dayModeManager = new DayModeManager();

    private readonly hud = new HUD();

    public currentCamera: CameraId = 0;

    public get dayMode(): DayMode {
        return this.dayModeManager.mode;
    }

    constructor(
        eventManager: EventManager,
        private gameInfoService: GameInfoService) {
        super({ antialias: true, alpha: true, clearColor: 0x000000 });
        this.shadowMap.enabled = false;
        this.shadowMap.type = THREE.PCFSoftShadowMap;

        this.cameras[0] = new PerspectiveCamera(eventManager);
        this.cameras[1] = new OrthographicCamera();
        this.rearViewCamera = new PerspectiveCamera(eventManager);

        this.cameras[0].add(this.skybox);
    }

    public initialize(container: HTMLDivElement, hudCanvas: HTMLCanvasElement) {
        this.canvasContainer = container;
        this.canvasContainer.appendChild(this.domElement);
        this.hud.initialize(hudCanvas);

        this.rearViewCamera.position.copy(RacingRenderer.REAR_VIEW_CAMERA_POSITION);
        this.rearViewCamera.setRotationFromAxisAngle(RacingRenderer.REAR_VIEW_CAMERA_ROTATION, Math.PI);

        this.scene.add(this.lighting);
        this.scene.add(RacingRenderer.AXIS_HELPER);
    }

    public finalize() {
        this.hud.finalize();
        this.stopRendering();
        if (this.canvasContainer) {
            this.canvasContainer.removeChild(this.domElement);
        }

        // Remove all children to be ready for the next game.
        this.scene.children.forEach(this.scene.remove, this.scene);
    }

    public startRendering(): void {
        if (!this.isRendering) {
            this.isRendering = true;
            this.runRenderLoop();
        }
    }

    public stopRendering(): void {
        if (this.animationRequestId !== -1) {
            cancelAnimationFrame(this.animationRequestId);
            this.animationRequestId = -1;
        }
        this.isRendering = false;
    }

    public runRenderLoop(): void {
        this.animationRequestId =
            requestAnimationFrame(() => this.runRenderLoop());

        this.renderGame();
    }

    public renderGame(): void {
        const screenSize = this.getSize();
        this.setScissorTest(true);
        this.cameras[1].updatePosition();

        this.clear(true, true, true);

        // normal view
        this.setScissor(0, 0, screenSize.width, screenSize.height);
        this.setViewport(0, 0, screenSize.width, screenSize.height);
        this.cameras[+!this.currentCamera].visible = false;
        this.render(this.scene, this.cameras[this.currentCamera]);
        this.cameras[+!this.currentCamera].visible = true;

        // rear-view camera
        const positionx = screenSize.width * RacingRenderer.REAR_VIEW_POSITION_X_FACTOR_TO_SCREENSIZE;
        const positiony = screenSize.height * RacingRenderer.REAR_VIEW_POSITION_Y_FACTOR_TO_SCREENSIZE;
        const width = screenSize.width * this.rearViewFactorToScreenSize;
        const height = screenSize.height * this.rearViewFactorToScreenSize;
        this.setScissor(positionx - width / 2, positiony - height / 2, width, height);
        this.setViewport(positionx - width / 2, positiony - height / 2, width, height);
        this.render(this.scene, this.rearViewCamera);

        this.hud.render(this.gameInfoService);
    }

    public setCamerasTarget(target: THREE.Object3D): void {
        this.cameras.forEach((camera) => {
            camera.setTarget(target);
            if ('audioListener' in target && target['audioListener'] instanceof THREE.AudioListener &&
                !new Set(camera.children).has(target['audioListener'])) {
                camera.add(target['audioListener']);
            }
        });
        this.rearViewCamera.setTarget(target);
    }

    public updateSize(width: number, height: number) {
        this.setSize(width, height);
        this.hud.setSize(width, height);

        this.cameras[0].aspect = width / height;
        this.cameras[0].updateProjectionMatrix();

        this.cameras[1].left = this.cameras[1].bottom * (width / height);
        this.cameras[1].right = this.cameras[1].top * (width / height);
        this.cameras[1].updateProjectionMatrix();

        this.rearViewCamera.aspect = width / height;
        this.rearViewCamera.updateProjectionMatrix();
    }

    public addMap(map: RenderableMap) {
        this.scene.add(map);
    }

    public removeMap(map: RenderableMap) {
        this.scene.remove(map);
    }

    public toggleDayMode(): void {
        let newMode: DayMode;
        switch (this.dayMode) {
            case DayMode.DAY: newMode = DayMode.NIGHT; break;
            case DayMode.NIGHT: newMode = DayMode.DAY; break;
            default: break;
        }
        this.updateDayMode(newMode);
    }

    public updateDayMode(newMode: DayMode): void {
        this.dayModeManager.mode = newMode;
        this.dayModeManager.updateScene(this.scene);
        this.shadowMap.enabled = newMode === DayMode.DAY;
    }

    public getBothCameras() {
        return this.cameras;
    }

    public toggleRearViewCamera() {
        if (this.rearViewFactorToScreenSize === RacingRenderer.REAR_VIEW_FACTOR_TO_SCREENSIZE) {
            this.rearViewFactorToScreenSize = 0;
        }
        else {
            this.rearViewFactorToScreenSize = RacingRenderer.REAR_VIEW_FACTOR_TO_SCREENSIZE;
        }
    }

}
