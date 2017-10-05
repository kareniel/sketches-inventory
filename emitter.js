module.exports = Emitter

function Emitter () {
  if (!(this instanceof Emitter)) return new Emitter()

  this._listeners = {}
}

Emitter.prototype.emit = function (eventName, data) {
  const listeners = this._listeners[eventName]

  if (listeners && listeners.length > 0) {
    for (let i = 0; i < listeners.length; i++) {
      const listener = listeners[i]
      listener(data)
    }
  }
}

Emitter.prototype.on = function (eventName, listener) {
  if (!this._listeners[eventName]) this._listeners[eventName] = []
  this._listeners[eventName].push(listener)
}

Emitter.prototype.off = function (eventName, listener) {
  const listeners = this._listeners[eventName]

  if (!listeners) return
  const index = listeners.indexOf(listener)
  if (index !== -1) {
    this._listeners[eventName].splice(index, 1)
  }
}
