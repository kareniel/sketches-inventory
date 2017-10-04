const html = require('bel')
const css = require('sheetify')
const { createRandomThing } = require('./thing')
const view = html`
  <div id="inventory-sketch" class=${css('./style.css')}>
    <div class="surface"></div>
    <div class="bag"></div>
  </div>`

document.body.appendChild(view)

spawnThing()

function spawnThing () {
  const thing = createRandomThing()

  view.appendChild(thing.el)
  thing.register('.bag', function droppedInBag () {
    if (!thing.acquired) {
      thing.acquired = true
      thing.d.fixPosition()
      spawnThing()
    }
  })
}
