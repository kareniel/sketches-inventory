const html = require('bel')
const Draggable = require('./draggable')

function Thing (type, el) {
  if (!(this instanceof Thing)) return new Thing(type, el)

  Draggable.call(this, el)

  this.el.classList.add('is-born')

  this.label = type.label
  this.sprite = type.sprite
  this.acquired = false
  this.el.appendChild(
    html`<svg><use xlink:href=${this.sprite}></use></svg>`
  )
}

Thing.prototype = Object.create(Draggable.prototype)

module.exports = Thing
