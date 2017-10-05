const html = require('bel')
const Draggable = require('./draggable')
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

const SPRITE_FILE = './sprites.svg'

function Thing (type, el) {
  if (!(this instanceof Thing)) return new Thing(type, el)

  Draggable.call(this, el)

  this.label = type.label
  this.sprite = type.sprite
  this.acquired = false
  this.el.appendChild(
    html`<svg><use xlink:href=${this.sprite}></use></svg>`
  )
}

Thing.prototype = Object.create(Draggable.prototype)

function createRandomThing (el) {
  const index = Math.floor(Math.random() * types.length)
  const type = types[index]
  const thing = Thing(type, el)

  return thing
}

module.exports = {
  Thing,
  createRandomThing
}