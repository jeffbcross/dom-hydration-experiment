import { Renderer, RenderComponentType } from '@angular/core';
import { RenderDebugInfo } from '@angular/core/src/render/api';
import { DomRootRenderer, DomRenderer, DomRootRenderer_ } from '@angular/platform-browser/src/dom/dom_renderer';

export const NAMESPACE_URIS: {[ns: string]: string} = {
  'xlink': 'http://www.w3.org/1999/xlink',
  'svg': 'http://www.w3.org/2000/svg',
  'xhtml': 'http://www.w3.org/1999/xhtml'
};
const NS_PREFIX_RE = /^:([^:]+):(.+)$/;

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
  }

  createElement(parent: Element|DocumentFragment, name: string, debugInfo: RenderDebugInfo):
      Element {
        console.log('createElement', debugInfo);
    let el: Element;
    if (existingElement(parent, name, this.preservationAttribute)) {
      el = getExistingElement(parent, name);
    } else if (isNamespaced(name)) {
      const nsAndName = splitNamespace(name);
      el = document.createElementNS((NAMESPACE_URIS)[nsAndName[0]], nsAndName[1]);
    } else {
      el = document.createElement(name);
    }
    // if (this._contentAttr) {
    //   el.setAttribute(this._contentAttr, '');
    // }
    if (parent) {
      parent.appendChild(el);
    }
    return el;
  }
}

export function isNamespaced(name: string) {
  return name[0] === ':';
}

export function splitNamespace(name: string): string[] {
  const match = name.match(NS_PREFIX_RE);
  return [match[1], match[2]];
}

function getExistingElement(parent: Element | DocumentFragment, name: string) {
  // TODO: doesn't account for multiple instances of the same element
  return parent.querySelector(name);
}

function existingElement(parent: Element | DocumentFragment, name: string, attr: string): boolean {
  if (!parent) return false;
  const el = parent.querySelector(name);
  if (!el) return false;
  return !!el.attributes.getNamedItem(attr);
}

function removeUnPreservedChildren(root: Element, attr: string, isRoot?: boolean) {
  console.log('running on root');
  // We don't want to destroy the root element
  if (isRoot || root.attributes.getNamedItem(attr)) {
    console.log('we have a match!', root);
    if (root.children) {
      Array.prototype.forEach.call(root.children, el => removeUnPreservedChildren(el, attr, false));
    }
  } else {
    console.log('we have a loser', root);
    while (root.firstChild) {
      root.removeChild(root.firstChild);
    }
  }

  return root;
}