import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {HomePage} from "./pages/home-page/home.page";
import {SimpleListPage} from "./pages/simple-list-page/simple-list.page";

const routes: Routes = [
  {
    path: '',
    component: HomePage,
  },
  {
    path: ':listId',
    component: SimpleListPage,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
