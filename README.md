# RouterTabsDraft
Few components which make able to open any route of Angular Router be opened in new Tab in same window.
Like classic desktop MDI application https://en.wikipedia.org/wiki/Multiple_document_interface

You need to create your app and set the routes like 

```
const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: Component1, data: {}},
  { path: 'path2', component: Component2, data: {}},
  { path: 'path3', component: Component3, data: {}}
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
