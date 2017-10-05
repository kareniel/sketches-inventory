const Emitter = require('./emitter')

function Draggable (el) {
  if (!(this instanceof Draggable)) return new Draggable(el)

  Emitter.call(this)

  const _this = this
  const rect = el.getBoundingClientRect()

  if (!this.el) this.el = el
  this.w = el.clientWidth
  this.h = el.clientHeight
  this.bodyRect = {}
  this.parentRect = {}
  this._initialPosition = { x: null, y: null }

  this._onMouseDown = onMouseDown
  this._handlers = []

  el.addEventListener('mousedown', onMouseDown)

  function onMouseDown (e) {
    e.preventDefault()

    if (!_this._initialPosition.x) _this.setPositionAsInitial()

    _this.bodyRect = document.body.getBoundingClientRect()
    _this.parentRect = _this.el.parentNode.getBoundingClientRect()

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
  }

  function onMouseUp (e) {
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('mousemove', onMouseMove)
    
    const { x, y } = e

    _this.emit('drop', elementsAtLocation(x, y))
  }

  function onMouseMove (e) {
      const leftDiff = _this.parentRect.left - _this.bodyRect.left
      const topDiff = _this.parentRect.top - _this.bodyRect.top
      const x = e.x - leftDiff - (_this.w / 2)
      const y = e.y - topDiff - (_this.h / 2)

      _this.setPosition.call(_this, x, y)
  }
}

Draggable.prototype = Object.create(Emitter.prototype)

Draggable.prototype.resetPosition = function () {
  requestAnimationFrame(() => {
    this.el.style.left = this._initialPosition.x + 'px'
    this.el.style.top = this._initialPosition.y + 'px'
  })
}

Draggable.prototype.setPosition = function (x, y) {
  requestAnimationFrame(() => {
    this.el.style.left = x + 'px'
    this.el.style.top = y + 'px'
  })
}

Draggable.prototype.setPositionAsInitial = function () {
  const rect = this.el.getBoundingClientRect()

  this._initialPosition.x = rect.left
  this._initialPosition.y = rect.top
}

Draggable.prototype.destroy = function () {
  this.el.removeEventListener(this._onMouseDown)
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

module.exports = Draggable