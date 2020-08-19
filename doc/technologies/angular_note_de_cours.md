# Angular

3 types de "directives"
  @Component : Produit du HTML.
  @Directive : Réagit à des choses dans le HTML.
  @Directive_Structurelle : Trop compliqué (*ngFor, *ngIf)

communiquer entre Component parent et enfant:
  `@Input('outside_name') attr_name`
  ```typescript
  @Input()
  set setterName(x) {
    
  }
  ```

