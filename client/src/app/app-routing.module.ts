import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [{ path: 'orders', loadChildren: () => import('./Pages/orders/orders.module').then(m => m.OrdersModule) }, { path: 'reports', loadChildren: () => import('./Pages/reports/reports.module').then(m => m.ReportsModule) }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
