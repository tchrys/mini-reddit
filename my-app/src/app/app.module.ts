import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {AuthPageComponent} from './authentification-page/auth-page.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTabsModule} from '@angular/material/tabs';
import {MatCardModule} from '@angular/material/card';
import {MatButtonModule} from '@angular/material/button';
import {MatSliderModule} from '@angular/material/slider';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';
import {MatCommonModule} from '@angular/material/core';
import {MatDialogModule} from '@angular/material/dialog';
import {MatMenuModule} from '@angular/material/menu';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AccountActivationComponent} from './account-activation/account-activation.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MainPageComponent} from './main-page/main-page.component';
import {CategoryComponent} from './category/category.component';
import {TopicComponent} from './topic/topic.component';
import {HomeComponent} from './home/home.component';
import {TokenInterceptor} from './services/token-interceptor';
import {SupportComponent} from './support/support.component';
import {MatTableModule} from '@angular/material/table';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatDividerModule} from '@angular/material/divider';
import {MatSelectModule} from '@angular/material/select';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {ChartsModule} from 'ng2-charts';
import { QuestionComponent } from './question/question.component';
import { TagSearchComponent } from './tag-search/tag-search.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { RoleDialogComponent } from './role-dialog/role-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    AuthPageComponent,
    AccountActivationComponent,
    MainPageComponent,
    CategoryComponent,
    TopicComponent,
    HomeComponent,
    SupportComponent,
    QuestionComponent,
    TagSearchComponent,
    UserAdminComponent,
    RoleDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTabsModule,
    MatCardModule,
    MatButtonModule,
    MatSliderModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSliderModule,
    MatAutocompleteModule,
    MatCheckboxModule,
    MatChipsModule,
    MatCommonModule,
    MatDialogModule,
    MatMenuModule,
    FormsModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTableModule,
    MatPaginatorModule,
    MatDividerModule,
    MatSelectModule,
    MatExpansionModule,
    ReactiveFormsModule,
    MatButtonToggleModule,
    ChartsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: TokenInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
