import { Component, Input, NgZone } from '@angular/core';
import { EndViewService } from '../../../services/end-view.service';
import 'rxjs/add/operator/switch';


@Component({
    selector: 'app-best-time',
    templateUrl: './best-time.component.html',
    styleUrls: ['./best-time.component.css']
})

export class BestTimeComponent {

    @Input() public userName: string;
    public inscribeButton: Boolean;

    constructor(public endViewService: EndViewService,
    private zone: NgZone) {
    }

    public reloadPage(): void {
        this.zone.runOutsideAngular(() => location.reload());
    }

    public inscribeOnMapBestTimes(): void {
        this.endViewService.updateMapBestTime(this.userName);
        this.inscribeButton = true;
    }

}
