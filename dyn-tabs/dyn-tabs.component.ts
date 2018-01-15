/**
 * The main component that renders single DynTab
 * instances.
 */

import { Component, ContentChildren, QueryList, AfterContentInit, ViewChild, ComponentFactoryResolver, ViewContainerRef, Input, Directive, Output, EventEmitter, ContentChild, ChangeDetectorRef, ComponentRef} from '@angular/core';

@Directive({
  selector: '[dynamic-tabs]'
})
export class DynamicTabsDirective {
  constructor(public viewContainer: ViewContainerRef){}
}

@Component({
  selector: 'dyn-tab',
  styles: [`
    .pane{
      padding: 1em;
    }
  `],
  template: `
    <div [hidden]="!active" class="pane">
      <ng-container #tabcontent>
      <ng-content></ng-content>
      <ng-container *ngIf="template"
        [ngTemplateOutlet]="template"
        [ngTemplateOutletContext]="{dataContext: dataContext}"
      >
      </ng-container>
      </ng-container>
    </div>
  `
})
export class DynTab {
  @Input('tabTitle') title: string;
  @Input() active = false;
  @Input() isCloseable = false;
  @Input() template;
  @Input() dataContext;
  
  //@Output 
  
  @ViewChild('tabcontent', {read: ViewContainerRef}) TabContent: ViewContainerRef;
      
  public _is_dynamic: boolean = false;
  public tabKey: string;
  public extraData: any;
  public childComponent: ComponentRef<any>|null;
   
  constructor(public changeDetector: ChangeDetectorRef) {
      
  };
}

@Component({
  selector: 'dyn-tabs',
  templateUrl: './dyn-tabs.component.html',
  styleUrls: ['./dyn-tabs.component.scss'],
    
})
export class DynTabsComponent implements AfterContentInit {
    public dynamicTabs: DynTab[] = [];

    @ContentChildren(DynTab) 
    public tabs: QueryList<DynTab>;

    @ViewChild(DynamicTabsDirective)
    public dynamicTabPlaceholder: DynamicTabsDirective;

    @Output('onTabClose') onTabClose: EventEmitter<DynTab> = new EventEmitter<DynTab>();
    @Output('onTabDestroy') onTabDestroy: EventEmitter<{}>= new EventEmitter<{}>();
    @Output('onTabSelect') onTabSelect: EventEmitter<{}>= new EventEmitter<DynTab>();
    @Output('onTabCreate') onTabCreate: EventEmitter<{}>= new EventEmitter<DynTab>();

    /*
    Alternative approach of using an anchor directive
    would be to simply get hold of a template variable
    as follows
    */
    // @ViewChild('container', {read: ViewContainerRef}) dynamicTabPlaceholder;

    constructor(public _componentFactoryResolver: ComponentFactoryResolver, public changeDetector: ChangeDetectorRef) {}

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
        
        console.log(this);
    }
    
    openNewTab(title: string, template, data, key: string, isCloseable = false): DynTab {
        // get a component factory for our DynTab
        let componentFactory = this._componentFactoryResolver.resolveComponentFactory(DynTab);

        // fetch the view container reference from our anchor directive
        let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;

        // alternatively...
        // let viewContainerRef = this.dynamicTabPlaceholder;

        // create a component instance
        let componentRef = viewContainerRef.createComponent(componentFactory);

        // set the according properties on our component instance
        let instance: DynTab = componentRef.instance as DynTab;
        instance.title          = title;
        instance.template       = template;
        instance.dataContext    = data;
        instance.isCloseable    = isCloseable;
        instance._is_dynamic    = true;
        instance.tabKey         = key;

        // remember the dynamic component for rendering the
        // tab navigation headers
        this.dynamicTabs.push(componentRef.instance as DynTab);
        
        this.onTabCreate.emit(instance);
        // set it active
        this.selectTab(this.dynamicTabs[this.dynamicTabs.length - 1]);
        
        return instance;
       
    }

    openTab(title: string, template, data, key: string, isCloseable = false): DynTab {
        let res = this.findByKey(key);
        if(res.length == 0)
            return this.openNewTab(title, template, data, key, isCloseable);
        return res[0];
        
    }

    selectTab(tab: DynTab|number|string){
        // deactivate all tabs
        if(this.tabs)
            this.tabs.toArray().forEach(tab => tab.active = false);

        this.dynamicTabs.forEach(tab => tab.active = false);

        // activate the tab the user has clicked on.
        switch(typeof(tab)) { 
           case 'number': { 
              tab = this.dynamicTabs[<number>tab];
              break; 
           } 
           case 'string': { 
              tab = this.findByKey(<string>tab)[0];
              break; 
           } 
        }
        tab = <DynTab>tab;
        tab.active = true;
        this.onTabSelect.emit(tab);
    }

    closeTab(tab: DynTab, event: MouseEvent | boolean = false) {
        if(event instanceof MouseEvent ) {
            event.stopPropagation();
            event.preventDefault();
        }
        //console.log(event);
        for(let i=0; i<this.dynamicTabs.length;i++) {
            if(this.dynamicTabs[i] === tab) {
                // remove the tab from our array
                this.onTabClose.emit(tab);
                this.dynamicTabs.splice(i,1);

                // destroy our dynamically created component again
                let viewContainerRef = this.dynamicTabPlaceholder.viewContainer;
                // let viewContainerRef = this.dynamicTabPlaceholder;
                let oldtab = {};
                for (let property in tab) {
                        oldtab[property] = tab[property];
                }
                viewContainerRef.remove(i);
                if(this.dynamicTabs[i].childComponent)
                    this.dynamicTabs[i].childComponent.destroy();
                this.onTabDestroy.emit(oldtab);

                if(this.dynamicTabs.length)
                    this.selectTab(this.dynamicTabs[this.dynamicTabs.length-1]);
                break;
            }
        }
    }

    closeActiveTab() {
        let activeTabs = this.dynamicTabs.filter((tab)=>tab.active);
        if(activeTabs.length > 0)  {
          // close the 1st active tab (should only be one at a time)
          this.closeTab(activeTabs[0]);
        }
    }
    
    
    findByKey(key: string) {
        return this.dynamicTabs.filter((atab) => {return atab.tabKey == key});
    }

}
