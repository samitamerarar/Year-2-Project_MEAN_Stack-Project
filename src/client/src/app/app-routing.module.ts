import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SelectionScreenComponent } from './selection-screen/selection-screen.component';
import { CrosswordComponent } from './crossword/crossword.component';
import { RacingComponent } from './racing/racing.component';
import { RacingGameComponent } from './racing/racing-game/racing-game.component';

import { AdminScreenComponent } from './admin-screen/admin-screen.component';
import { AdminAuthGard } from './admin-screen/admin-auth.gard';

const routes: Routes = [
    {
        path: 'admin',
        component: AdminScreenComponent,
        canActivate: [AdminAuthGard]
    },
    { path: '', component: SelectionScreenComponent },
    { path: 'crossword', component: CrosswordComponent },
    { path: 'racing', component: RacingComponent },
    { path: 'racing/racing-game/:map-name', component: RacingGameComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule],
    providers: [AdminAuthGard]
})
export class AppRoutingModule { }
