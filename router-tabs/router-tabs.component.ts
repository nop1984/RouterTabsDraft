import { Component, OnInit, ViewChild, AfterContentInit, Injector, Directive, ComponentFactoryResolver, ViewContainerRef, Attribute, ChangeDetectorRef, 
    Output, EventEmitter } from '@angular/core';
import {RouterEvent, RoutesRecognized, NavigationStart, ActivatedRoute, RouterOutlet, ChildrenOutletContexts, Router, RouterModule} from '@angular/router';
import 'rxjs/Rx';

import {DynTabsComponent, DynTab, DynamicTabsDirective} from '../dyn-tabs/dyn-tabs.component';

import { Observable} from "rxjs/Observable";
import { Subject} from "rxjs/Subject";

export class Interception {
    constructor(public activatedRoute: ActivatedRoute, public resolver: ComponentFactoryResolver|null){};
}

@Directive({selector: 'router-outlet-i', exportAs: 'outlet-i', providers: []})
export class RouterOutletInterceptor extends RouterOutlet {
    
    public readonly i_events: Observable<Interception> = new Subject<Interception>();

    constructor(
      private __parentContexts: ChildrenOutletContexts, private __location: ViewContainerRef,
      private __resolver: ComponentFactoryResolver, @Attribute('name') name: string,
      private __changeDetector: ChangeDetectorRef,
      ) {
        super(__parentContexts, __location, __resolver, name, __changeDetector);
    }


    activateWith(activatedRoute: ActivatedRoute, resolver: ComponentFactoryResolver|null) {
        (this.i_events as Subject<Interception>).next(new Interception(activatedRoute, resolver));
        return;
    }
}


@Component({
  selector: 'router-tabs',
  templateUrl: './router-tabs.component.html',
  styleUrls: ['./../dyn-tabs/dyn-tabs.component.scss', './router-tabs.component.scss'],
  providers: [DynTabsComponent],
  viewProviders: [RouterTabsComponent]
})
export class RouterTabsComponent extends DynTabsComponent {

    @ViewChild(RouterOutletInterceptor) public roi: RouterOutletInterceptor;

    constructor(public router: Router, __componentFactoryResolver: ComponentFactoryResolver, changeDetector: ChangeDetectorRef) { 
        super(__componentFactoryResolver, changeDetector);
    }
    
    pathUnify(_ipath: string) {
        let res = _ipath.replace('//', '/');
        res = res.replace('//', '/');
        if(res.substr(0, 1) !== '/') {
           res = '/' + res;
        }
        if(res.substr(-1, 1) !== '/') {
           res = res + '/';
        }
        
        return res;
    }

    // contentChildren are set
    ngAfterContentInit() {
        // get all active tabs
        let activeTabs = this.tabs.filter((tab)=>tab.active);

        // if there is no active tab set, activate the first
        if (activeTabs.length === 0 && this.tabs.length !==0 ) {
          this.selectTab(this.tabs.first);
        }

        this.dynamicTabs =  this.tabs.toArray().concat(this.dynamicTabs);

        //this.tabs.destroy();
        this.tabs = null;
               
        this.roi.i_events.subscribe((event)=> {
            let path = event.activatedRoute.routeConfig.path;
            let label = event.activatedRoute.routeConfig.data.hasOwnProperty('TabLabel') ? event.activatedRoute.routeConfig.data['TabLabel'] : path;
            event.activatedRoute.routeConfig.data['PathUnified'] = event.activatedRoute.routeConfig.data.hasOwnProperty('PathUnified') ? event.activatedRoute.routeConfig.data['PathUnified'] : this.pathUnify(path);
            
            let tabexists = this.findByKey(event.activatedRoute.routeConfig.data['PathUnified']);
            let atab: DynTab;
            if (tabexists.length == 0) {
                atab = this.openTab(label, null, {}, event.activatedRoute.routeConfig.data['PathUnified'], true);

                const snapshot = event.activatedRoute['_futureSnapshot'];
                const component = <any>snapshot.routeConfig !.component;

                let componentFactory = this._componentFactoryResolver.resolveComponentFactory(component);

                atab.childComponent = atab.TabContent.createComponent(componentFactory, atab.TabContent.length, atab.TabContent.injector);
                
                atab.changeDetector.markForCheck();
            } else {
                atab = tabexists[0];
                this.selectTab(atab);
            }           

        })
    }
    

}

