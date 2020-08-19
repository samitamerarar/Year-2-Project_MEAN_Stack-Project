import { Component, OnInit } from '@angular/core';
import { AdminConfigService } from '../admin-config.service';

@Component({
    selector: 'app-admin-config',
    templateUrl: './admin-config.component.html',
    styleUrls: ['./admin-config.component.scss']
})
export class AdminConfigComponent implements OnInit {
    private static readonly STATUS_DELAY = 3000;
    private static readonly SUCCESS_MESSAGE = 'Password Changed!';
    private static readonly FAILURE_MESSAGE = 'Password Not Changed!';

    public password;
    public confirmation;
    public success: boolean;
    public statusMessage: string;
    private statusMessageTimeoutId = -1;

    constructor(private adminConfig: AdminConfigService) { }

    public ngOnInit() {
    }

    public changePassword() {
        this.adminConfig.changePassword(this.password, this.confirmation)
            .then((changed: boolean) => {
                this.success = changed;
                this.setStatusMessage(changed ?
                    AdminConfigComponent.SUCCESS_MESSAGE :
                    AdminConfigComponent.FAILURE_MESSAGE);
            });
        this.password = '';
        this.confirmation = '';
    }

    private setStatusMessage(message: string) {
        if (this.statusMessageTimeoutId !== -1) {
            window.clearTimeout(this.statusMessageTimeoutId);
            this.statusMessageTimeoutId = -1;
        }
        this.statusMessage = message;
        this.statusMessageTimeoutId = window.setTimeout(() => {
            this.statusMessage = '';
            this.statusMessageTimeoutId = -1;
        }, AdminConfigComponent.STATUS_DELAY);
    }

}
