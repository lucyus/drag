# Drag
**Drag** is a lightweight package made to drag DOM HTML elements easily.

## Install

Make sure you have `npm` or `yarn` installed.

Then run in your favorite Terminal:

`npm install @lucyus/drag`

OR

`yarn install @lucyus/drag`

## Basic usage

### HTML

Within your HTML page, your draggable element should look similar to the following:
```html
<div class="boundary">
  <div class="drag">
    <div class="handle"></div>
  </div>
</div>
```
* The *boundary* and *handle* elements are optional.
* It works with any HTML element, not only *div*.

### Javascript

In `your-file.js`, write :
```js
let { Drag } = require('@lucyus/drag');
const elementToDrag = document.querySelector('.drag');
let drag = new Drag(elementToDrag);
```

### Typescript 
In `your-file.ts`, write :
```ts
import { Drag } from '@lucyus/drag';
const elementToDrag: HTMLElement = document.querySelector('.drag');
let drag = new Drag(elementToDrag);
```

## Advanced features

### Toggle draggable

You can easily set the draggability of your element:
```js
// Disable dragging
drag.disable();
// Enable dragging
drag.enable();
// Toggle draggable
drag.toggleDraggable();
```
By default, the element is draggable.

### Boundaries

You can restrict the draggable area within a boundary element:
```js
// 'boundaryElement' must be a parent of the draggable element
const boundaryElement = document.querySelector('.boundary');
drag.setBoundary(boundaryElement);
```
In case you need to remove the boundary:
```js
drag.removeBoundary();
```
By default, there are no boundaries.

### Handle

It is possible to set a drag handle:
```js
const handleElement = document.querySelector('.handle');
drag.setHandle(handleElement);
```
In case you need to remove the handle:
```js
drag.removeHandle();
```
By default, the handle is the whole draggable element.

### Positioning

The position of the draggable element can be set anytime:
```js
drag.setPosition({ x: 10, y: 10 });
```
The position is relative to the initial draggable element position.

## License

This project is made under the [Apache 2.0](./LICENSE) license.