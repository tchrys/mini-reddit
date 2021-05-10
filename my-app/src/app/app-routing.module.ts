import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthPageComponent} from './authentification-page/auth-page.component';
import {AccountActivationComponent} from './account-activation/account-activation.component';
import {MainPageComponent} from './main-page/main-page.component';
import {CategoryComponent} from './category/category.component';
import {TopicComponent} from './topic/topic.component';
import {HomeComponent} from './home/home.component';
import {RoleResolver} from './services/role-resolver';
import {SupportComponent} from './support/support.component';
import {CategoryResolver} from './services/category-resolver';
import {TopicResolver} from './services/topic-resolver';
import {QuestionComponent} from './question/question.component';
import {TagSearchComponent} from './tag-search/tag-search.component';
import {UserAdminComponent} from './user-admin/user-admin.component';

const routes: Routes = [
  {path: 'login', component: AuthPageComponent},
  {path: 'activate', component: AccountActivationComponent},
  {
    path: 'app', component: MainPageComponent, resolve: {myRole: RoleResolver}, children: [
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {path: 'search', component: TagSearchComponent, children: [
          {path: ':questionId', component: QuestionComponent}
        ]},
      {path: 'users', component: UserAdminComponent},
      {path: 'support', component: SupportComponent},
      {path: 'home', component: HomeComponent},
      {
        path: 'category/:catId', component: CategoryComponent, resolve: {myCat: CategoryResolver}, children: [
          {path: 'topic/:topicId', component: TopicComponent, resolve: {myTopic: TopicResolver}, children: [
              {path: 'question/:questionId', component: QuestionComponent}
            ]
          }
        ]
      },
    ]
  },
  {path: '**', redirectTo: 'login'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
