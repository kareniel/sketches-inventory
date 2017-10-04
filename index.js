const html = require('bel')
const css = require('sheetify')
const style = css('./style.css')
const Draggable = require('./draggable')
const view = html`
  <div id="inventory-sketch" class=${style}>
    <div class="surface"></div>
    <div class="bag"></div>
  </div>`
const spriteFile = './sprites.svg'
const SPRITES = [
  'circle',
  'triangle',
  'square'
]

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
  const sprite = getRandomSprite()
  this.acquired = false
  this.el = html`
    <svg viewBox="0 0 100 100" class="thing">
      <use xlink:href=${sprite}></use>
    </svg>`
}

function getRandomSprite () {
  const index = Math.floor(Math.random() * SPRITES.length)
  return `${spriteFile}#${SPRITES[index]}`
}