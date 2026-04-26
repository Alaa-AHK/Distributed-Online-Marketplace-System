import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ProductComponent } from './components/product/product.component';
import { CartComponent } from './components/cart/cart.component';
import { OrderComponent } from './components/order/order.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { AboutComponent } from './components/about/about.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { OrderMangeComponent } from './components/order-mange/order-mange.component';
import { ProductDetailsComponent } from './components/product-details/product-details.component';
import { authGuard } from './core/guards/auth.guard';
import { OrderDetailsComponent } from './components/order-details/order-details.component';
import { UpdateProductComponent } from './components/update-product/update-product.component';
import { AddAdminComponent } from './components/add-admin/add-admin.component';

export const routes: Routes = [
    {path:'',redirectTo:'home',pathMatch:'full'},
    {path:'home',component:HomeComponent,title:'Home | page'},
    {path:'product',component:ProductComponent,title:'Products | page'},
    {path:'cart',component:CartComponent,title:'Cart | page',canActivate: [authGuard]},
    {path:'order',component:OrderComponent,title:'Order | page',canActivate:[authGuard]},
    {path:'login',component:LoginComponent,title:'Login| page'},
    {path:'register',component:RegisterComponent,title:'Register | page'},
    {path:'about',component:AboutComponent,title:'About | page'},
    { path: 'product/:id', component: ProductDetailsComponent ,title:'product | page'},
    {path:'orderDetails',component:OrderDetailsComponent,title:'Order| Details'},
    { path: 'update-product/:id', component: UpdateProductComponent },
    {path:'addAdmin',component:AddAdminComponent},
    {path:'**',component:NotfoundComponent,title:'NotFound | page'}
];
