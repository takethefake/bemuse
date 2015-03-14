
import PIXI     from 'pixi.js'

import SkinNode from '../lib/base'
import Instance from '../lib/instance'

import Expression from '../../expression'
import Animation  from './animation'

export class DisplayObject extends SkinNode {
  compile(compiler, $el) {
    this.x          = new Expression($el.attr('x') || '0')
    this.y          = new Expression($el.attr('y') || '0')
    this.scaleX     = new Expression($el.attr('scale-x') || '1')
    this.scaleY     = new Expression($el.attr('scale-y') || '1')
    this.alpha      = new Expression($el.attr('alpha') || '1')
    this.animation  = Animation.compile(compiler, $el)
    this.blendMode  = parseBlendMode($el.attr('blend') || 'normal')
    if ($el.attr('width'))   this.width   = new Expression($el.attr('width'))
    if ($el.attr('height'))  this.height  = new Expression($el.attr('height'))
    if ($el.attr('visible')) this.visible = new Expression($el.attr('visible'))
  }
  instantiate(context, object) {
    return new Instance(context, self => {
      self.bind(this.animation.prop('x',       this.x),      x => object.x = x)
      self.bind(this.animation.prop('y',       this.y),      y => object.y = y)
      self.bind(this.animation.prop('alpha',   this.alpha),
          a => object.alpha = a)
      self.bind(this.animation.prop('scale-x', this.scaleX),
          x => object.scale.x = x)
      self.bind(this.animation.prop('scale-y', this.scaleY),
          y => object.scale.y = y)
      if (this.width)   self.bind(this.width,   w => object.width   = w)
      if (this.height)  self.bind(this.height,  h => object.height  = h)
      if (this.visible) self.bind(this.visible, v => object.visible = v)
      object.blendMode = this.blendMode
    })
  }
}

function parseBlendMode(text) {
  if (text === 'normal') return PIXI.blendModes.NORMAL
  if (text === 'screen') return PIXI.blendModes.SCREEN
  throw new Error('Invalid blend mode: ' + text)
}

export default DisplayObject
