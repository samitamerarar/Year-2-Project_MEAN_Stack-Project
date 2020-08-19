import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor() { }

    public title = 'LOG2990';
    public message: string;

    public ngOnInit(): void {

    }
}
