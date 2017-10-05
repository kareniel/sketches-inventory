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
  const el = html`<div class="thing"></div>`
  view.appendChild(el)

  const thing = createRandomThing(el)

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

  thing.on('click', e => {
    const tooltip = html`<div class="tooltip">${thing.label}</div>`
    view.appendChild(tooltip)

    const viewRect = view.getBoundingClientRect()
    const x = e.x - viewRect.left - (tooltip.clientWidth / 2)
    const y = e.y - viewRect.top - (tooltip.clientHeight * 2.5)

    tooltip.style.left = x + 'px' 
    tooltip.style.top = y + 'px'

    const t = setTimeout(() => {
      clearTimeout(t)
      view.removeChild(tooltip)
    }, 1000)
  })
}
