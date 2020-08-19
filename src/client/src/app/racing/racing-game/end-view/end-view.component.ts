import { Component, OnInit } from '@angular/core';
import { EndViewService, EndGameWindow } from '../../services/end-view.service';

@Component({
    selector: 'app-end-view',
    templateUrl: './end-view.component.html',
    styleUrls: ['./end-view.component.css']
})

export class EndViewComponent implements OnInit {

    public readonly EndGameWindow = EndGameWindow;
    constructor(public endViewService: EndViewService) { }

    public ngOnInit(): void {
        this.endViewService.displayGameResult = EndGameWindow.NONE;
    }

}
