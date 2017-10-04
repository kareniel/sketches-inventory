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

module.exports.Thing = function Thing (type) {
  if (!(this instanceof Thing)) return new Thing()
  Draggable.call(this, thing.el)

  this.label = type.label
  this.sprite = type.sprite
  this.acquired = false
  this.el = html`
    <svg viewBox="0 0 100 100" class="thing">
      <use xlink:href=${this.sprite}></use>
    </svg>`
}

module.exports.createRandomThing = function createRandomThing () {
  const index = Math.floor(Math.random() * types.length)
  const type = types[index]

  return Thing(type)
}
