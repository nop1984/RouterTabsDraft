# RouterTabsDraft
Few components which make able to open any route of Angular Router be opened in new Tab in same window

You need to create your app and set the routes like 

```
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: DynTable, data: [{dataSource: 'http://dm.loc/conf/strings.json'}]},
  { path: 'userStrings', outlet: 'testoutlet', component: DynTable, data: [{dataSource: 'http://dm.loc/conf/strings.json'}]},
  { path: 'adminString', component: DynTable, data: [{dataSource: 'http://dm.loc/conf/strings.json'}]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false } /* <-- debugging purposes only */)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
```

Plus place a tab in app template 
```
<router-tabs></router-tabs>
```
