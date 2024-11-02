import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { MyPortfolioComponent } from './my-portfolio/my-portfolio.component';

const routes: Routes = [
  {path:'',component:MyPortfolioComponent},
  { path: 'admin', component: AdminComponent }
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
