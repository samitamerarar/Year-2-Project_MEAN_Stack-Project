import { isDayModeNotifiable } from './day-mode-notifiable';
import { DayMode } from './day-mode';

export { DayMode } from './day-mode';

export class DayModeManager {

    public mode: DayMode = DayMode.DAY;

    public updateScene(scene: THREE.Scene): void {

        this.updateRecursively(scene);

    }

    private updateRecursively(obj: THREE.Object3D) {

        if (isDayModeNotifiable(obj)) {
            obj.dayModeChanged(this.mode);
        }

        obj.children.forEach(this.updateRecursively, this);

    }

}
