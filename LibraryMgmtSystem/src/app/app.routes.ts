import { Routes } from '@angular/router';
import { HomeComponent } from '../components/home-component/home-component';
import { LoginComponent } from '../components/login-component/login-component';
import { MyBookComponent } from '../components/mybook-component/mybook-component';
import { RegisterUserComponent } from '../components/register-user/register-user';
import { AddBookComponent } from '../components/add-book/add-book';
import { EditBookComponent } from '../components/edit-book/edit-book';
import { BorrowedHistory } from '../components/borrowed-history/borrowed-history';


export const routes: Routes = [
 { path: 'home', component: HomeComponent },

 { path: 'login', component: LoginComponent },

 { path:'my-books', component:MyBookComponent},

 { path:'register-user' , component:RegisterUserComponent},

 { path:'add-book', component:AddBookComponent},

 { path:'edit-book/:id' , component:EditBookComponent},

 { path:'admin/borrowed-books' , component:BorrowedHistory},

 { path: '', redirectTo: '/home', pathMatch: 'full' }

];
