import { Renderer, RenderComponentType } from '@angular/core';
import { RenderDebugInfo } from '@angular/core/src/render/api';
import { DomRootRenderer, DomRenderer, DomRootRenderer_ } from '@angular/platform-browser/src/dom/dom_renderer';

export class HydrationRootRenderer extends DomRootRenderer_ {
  registeredComponents: Map<string, HydrationRenderer>;
  renderComponent(componentProto: RenderComponentType): Renderer {
    let renderer = this.registeredComponents.get(componentProto.id);
    if (!renderer) {
      renderer = new HydrationRenderer(
          this, componentProto, this.animationDriver, `${this.appId}-${componentProto.id}`);
      renderer.preservationAttribute = 'ngPreserveNode';
      this.registeredComponents.set(componentProto.id, renderer);
    }
    return renderer;
  }
}

export class HydrationRenderer extends DomRenderer {
  public preservationAttribute: string;

  selectRootElement(selectorOrNode: string|Element, debugInfo: RenderDebugInfo): Element {
    let el: Element;
    if (typeof selectorOrNode === 'string') {
      el = (<any>this)._rootRenderer.document.querySelector(selectorOrNode);
      if (!el) {
        throw new Error(`The selector "${selectorOrNode}" did not match any elements`);
      }
    } else {
      el = selectorOrNode;
    }
    for (var i=0; i<el.children.length; i++) {

    }
    return removeUnPreservedChildren(el, this.preservationAttribute, true);
    // while (el.firstChild) {
    //   console.log('removing child');
    //   el.removeChild(el.firstChild);
    // }
    // return el;
  }
}

function removeUnPreservedChildren(root: Element, attr: string, isRoot?: boolean) {
  console.log('running on root');
  if (root.attributes.getNamedItem(attr)) {
    console.log('we have a match!', root);
    if (root.children) {
      Array.prototype.forEach.call(root.children, el => removeUnPreservedChildren(el, attr, false));
    }
  } else {
    console.log('we have a loser', root);
    if (!isRoot) {
      root.parentNode.removeChild(root);
    } else {
      while (root.firstChild) {
        root.removeChild(root.firstChild);
      }
    }
  }

  return root;
}