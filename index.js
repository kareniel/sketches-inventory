const html = require('bel')
const css = require('sheetify')
const style = css('./style.css')
const Draggable = require('./draggable')
const view = html`
  <div id="inventory-sketch" class=${style}>
    <div class="surface"></div>
    <div class="bag"></div>
  </div>`

document.body.appendChild(view)

spawnThing()

function spawnThing () {
  const thing = new Thing()

  view.appendChild(thing.el)
  
  thing.d = new Draggable(thing.el)
  thing.d.register('.bag', function droppedInBag () {
    if (!thing.acquired) {
      thing.acquired = true
      thing.d.fixPosition()
      spawnThing()
    }
  })
}

function Thing () {
  this.acquired = false
  this.el = html`<div class="thing is-circle"></div>`
}
