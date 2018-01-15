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


Pre-investigation of task

I have made a copy or @angular/router package from github to trace all the magic from inside
The render of Component to placeholder (outlet) happens in RouterOutlet::activateWith() in router_outlet.ts line 125
It invoked from ActivateRoutes::activateRoutes() ~ line 901 in router.ts
Which invoked from Router::runNavigate() ~ line 736 in router.ts

And it looks like extending of Router and ActivateRoutes is required to reach the goal of custom placeholder insted of RouterOutlet. But ... damn Router::runNavigate() is private .... Lets see if i can do elegant working patch to code fork

P.S. Line number are can be not acurate +/- because I was using plenty of console.log() and console.trace()

UPD: ChildrenOutletContexts::getOrCreateContext(childName: string) @ router_otlet_context.ts is called anyway if router-otlets are present in application or not present. Only difference - not present then called once and context.outlet == null, if router-outlets are present in app template context.outlet is equal to RouterOutlet instance. In both cases Router via ChildrenOutletContexts::getOrCreateContext(childName: string) attempts to find outlet named "primary" (childName == "primary"). And if does not find - it creates in getOrCreateContext() f-n, so developer uses Outlets even if he thinks he dont (Angular creates it implicitly)

UPD2: function setupRouter in routet_module.ts grabs list of all defined in template <router-outlets> via param contexts: ChildrenOutletContexts and inits the new Router with it. List is in contexts.contexts Map of OutletContext in each there is a member outlet:RouterOutlet

UPD3: for weird ULR syntax serializeSegment() function is responsible. Which is located in url_tree.ts and called from DefaultUrlSerializer.serialize() which is injected into Router via DI. This weird syntax is required by Router if target router-outlet to render component is not 'primary'.