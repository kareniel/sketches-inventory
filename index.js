const html = require('bel')
const css = require('sheetify')
const Thing = require('./thing')
const prefix = css('./style.css')

const bagEl = html`<div class="bag"></div>`
const bagContainerEl = html`<div class="bag-container">${bagEl}</div>`
const appEl = html`<div class=${prefix}>${bagContainerEl}</div>`

document.body.appendChild(appEl)

spawnThing()

function spawnThing () {
  const el = html`<div class="thing"></div>`
  appEl.appendChild(el)

  const thing = createRandomThing(el)

  thing.on('drop', function (e) {
    const { x, y } = e
    const elements = elementsAtLocation(x, y)
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

    appEl.appendChild(tooltip)

    const rect = appEl.getBoundingClientRect()
    const x = e.x - rect.left - (tooltip.clientWidth / 2)
    const y = e.y - rect.top - (tooltip.clientHeight * 2.5)

    tooltip.style.left = x + 'px' 
    tooltip.style.top = y + 'px'

    const t = setTimeout(() => {
      clearTimeout(t)
      appEl.removeChild(tooltip)
    }, 1000)
  })
}

function createRandomThing (el) {
  const types = [{
    label: 'A square thing',
    sprite: './sprites.svg#square' 
  }, {
    label: 'A triangle thing',
    sprite: './sprites.svg#triangle'
  }, {
    label: 'A circle thing',
    sprite: './sprites.svg#circle'
  }]
  const index = Math.floor(Math.random() * types.length)
  const type = types[index]
  const thing = Thing(type, el)

  return thing
}

function elementsAtLocation (x, y) {
  const stack = []
  let el = {}

  while (el.tagName !== 'HTML') {
    el = document.elementFromPoint(x, y)
    stack.push(el)
    el.style.pointerEvents = 'none'
  }

  stack.forEach(el => el.style.pointerEvents = '')

  return stack
}
