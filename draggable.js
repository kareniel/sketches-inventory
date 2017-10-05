const Emitter = require('./emitter')

const delay = 100

function Draggable (el) {
  if (!(this instanceof Draggable)) return new Draggable(el)

  Emitter.call(this)

  const _this = this

  if (!this.el) this.el = el
  this.w = el.clientWidth
  this.h = el.clientHeight
  this.bodyRect = {}
  this.parentRect = {}
  this._initialPosition = { x: el.offsetLeft, y: el.offsetTop }

  this._onMouseDown = onMouseDown
  this._handlers = []

  el.addEventListener('mousedown', onMouseDown)

  function onMouseDown (e) {
    e.preventDefault()

    document.addEventListener('mouseup', onClick)

    _this._timeout = setTimeout(() => {
      clearTimeout(_this._timeout)
      document.removeEventListener('mouseup', onClick)

      _this.bodyRect = document.body.getBoundingClientRect()
      _this.parentRect = _this.el.parentNode.getBoundingClientRect()

      document.addEventListener('mouseup', onDragEnd)
      document.addEventListener('mousemove', onDrag)
    }, delay)
  }

  function onClick (e) {
    clearTimeout(_this._timeout)
    document.removeEventListener('mouseup', onClick)
    _this.emit('click', e)
  }

  function onDragEnd (e) {
    document.removeEventListener('mouseup', onDragEnd)
    document.removeEventListener('mousemove', onDrag)
    
    const { x, y } = e

    _this.emit('drop', elementsAtLocation(x, y))
  }

  function onDrag (e) {
    const x = e.x - _this.parentRect.left - (_this.el.clientWidth / 2)
    const y = e.y - _this.parentRect.top - (_this.el.clientHeight / 2)

    _this.setPosition.call(_this, x, y)
  }
}

Draggable.prototype = Object.create(Emitter.prototype)

Draggable.prototype.setPositionAsInitial = function () {
  const { offsetLeft, offsetTop, clientWidth, clientHeight } = this.el


  this._initialPosition.x = offsetLeft
  this._initialPosition.y = offsetTop
  console.log(this._initialPosition)
}

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