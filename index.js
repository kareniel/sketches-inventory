const html = require('bel')
const css = require('sheetify')
const { createRandomThing } = require('./thing')
const prefix = css('./style.css')
const view = html`
  <div id="inventory-sketch" class=${prefix}>
    <div class="surface"></div>
    <div class="bag"></div>
  </div>`

document.body.appendChild(view)

spawnThing()

function spawnThing () {
  const thing = createRandomThing()

  view.appendChild(thing.el)

  thing.on('drop', function (elements) {
    const droppedInBag = elements.some(el => el.matches('.bag'))

    if (droppedInBag) {
      if (thing.acquired) return
      thing.acquired = true
      thing.setPositionAsInitial()
      spawnThing() 
    } else {
      thing.resetPosition()
    }
  })
}
