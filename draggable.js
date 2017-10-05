const Emitter = require('./emitter')

function Draggable (el, params = {}) {
  if (!(this instanceof Draggable)) return new Draggable(el, params)

  Emitter.call(this)

  this.params = {
    delay: params.delay || 100
  }

  this.el = el
  this.bodyRect = null
  this.parentRect = null
  this._initialPosition = { x: el.offsetLeft, y: el.offsetTop }

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
    }, _this.params.delay)
  }

  function onClick (e) {
    clearTimeout(_this._timeout)
    document.removeEventListener('mouseup', onClick)
    _this.emit('click', e)
  }

  function onDragEnd (e) {
    document.removeEventListener('mouseup', onDragEnd)
    document.removeEventListener('mousemove', onDrag)

    _this.emit('drop', e)
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

module.exports = Draggable