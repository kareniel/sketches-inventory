function Draggable (el) {
  const _this = this
  const rect = el.getBoundingClientRect()

  this._el = el
  this.w = el.clientWidth
  this.h = el.clientHeight
  this.bodyRect = document.body.getBoundingClientRect()
  this.parentRect = _this._el.parentNode.getBoundingClientRect()
  this._initialPosition = { 
    x: el.offsetLeft, 
    y: el.offsetTop
  }
  this._onMouseDown = onMouseDown
  this._handlers = []

  el.addEventListener('mousedown', onMouseDown)

  function onMouseDown (e) {
    e.preventDefault()

    _this.bodyRect = document.body.getBoundingClientRect()
    _this.parentRect = _this._el.parentNode.getBoundingClientRect()

    document.addEventListener('mouseup', onMouseUp)
    document.addEventListener('mousemove', onMouseMove)
  }

  function onMouseUp (e) {
    document.removeEventListener('mouseup', onMouseUp)
    document.removeEventListener('mousemove', onMouseMove)
    
    const { x, y } = e
    const els = elementsAtLocation(x, y)
    
    _this._handlers.forEach(handler => {
      const selector = handler[0]
      const callback = handler[1]

      if (els.some(el => el.matches(selector))) {
        console.log('match!', selector, _this)
        callback()
      } else {
        _this.resetPosition.call(_this)
      }
    })
  }

  function onMouseMove (e) {
      const leftDiff = _this.parentRect.left - _this.bodyRect.left
      const topDiff = _this.parentRect.top - _this.bodyRect.top
      const x = e.x - leftDiff - (_this.w / 2)
      const y = e.y - topDiff - (_this.h / 2)

      _this.setPosition.call(_this, x, y)
  }
}

Draggable.prototype.resetPosition = function () {
  requestAnimationFrame(() => {
    this._el.style.left = this._initialPosition.x + 'px'
    this._el.style.top = this._initialPosition.y + 'px'
  })
}

Draggable.prototype.setPosition = function (x, y) {
  requestAnimationFrame(() => {
    this._el.style.left = x + 'px'
    this._el.style.top = y + 'px'
  })
}

Draggable.prototype.fixPosition = function (x, y) {
  this._initialPosition.x = this._el.offsetLeft
  this._initialPosition.y = this._el.offsetTop
}

Draggable.prototype.register = function (selector, callback) {
  this._handlers.push([selector, callback])
}

Draggable.prototype.unregister = function (selector, callback) {
  const index = this._handlers.findIndex(handler => {
    return handler[0] == selector && handler[1] === callback
  })

  if (index > -1) {
    this._handlers.splice(index, 1)
  }
}

Draggable.prototype.destroy = function () {
  this._el.removeEventListener(this._onMouseDown)
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