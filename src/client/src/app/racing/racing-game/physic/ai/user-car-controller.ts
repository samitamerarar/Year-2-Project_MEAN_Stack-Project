import { CarController, CarControllerState } from './car-controller';
import { UIInputs } from '../../../services/ui-input.service';
import { EventManager } from '../../../../event-manager.service';
import { CarPhysic } from '../../models/car/car-physic';
import { Car } from '../../models/car/car';
import { KEYBOARD_EVENT } from '../../../constants';

const KEY_FORWARD = 'w';
const KEY_BACK = 's';
const KEY_RIGHT = 'd';
const KEY_LEFT = 'a';

export class UserCarController extends CarController {
    protected userInputs: UIInputs;

    public constructor(car: Car) {
        super(car);
        EventManager.getInstance().registerClass(this, UserCarController.prototype);
    }

    public setUIInput(userInputService: UIInputs): void {
        this.userInputs = userInputService;
    }

    public removeUIInput(): void {
        delete this.userInputs;
    }

    public hasUIInput(): boolean {
        return this.userInputs != null;
    }

    @EventManager.Listener(KEYBOARD_EVENT)
    // tslint:disable-next-line:no-unused-variable
    private updateTargetVelocities(): void {
        if (this.state === CarControllerState.ENABLED && this.userInputs != null) {
            this.car.targetSpeed = 0;
            if (this.userInputs.isKeyPressed(KEY_FORWARD)) {
                this.car.targetSpeed += CarPhysic.DEFAULT_TARGET_SPEED;
            }
            if (this.userInputs.isKeyPressed(KEY_BACK)) {
                this.car.targetSpeed -= CarPhysic.DEFAULT_TARGET_SPEED;
            }

            this.car.targetAngularSpeed = 0;
            if (this.userInputs.isKeyPressed(KEY_RIGHT)) {
                this.car.targetAngularSpeed -= CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED;
            }
            if (this.userInputs.isKeyPressed(KEY_LEFT)) {
                this.car.targetAngularSpeed += CarPhysic.DEFAULT_TARGET_ANGULAR_SPEED;
            }
        }
    }
}
