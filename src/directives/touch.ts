import { DirectiveBinding } from 'vue/types/options';
import Hammer from 'hammerjs';

enum Touch {
  Pan = 'pan',
  Pinch = 'pinch',
  Press = 'press',
  Rotate = 'rotate',
  Swipe = 'swipe',
  Tap = 'tap'
}

enum Timing {
  Start = 'start',
  Move = 'move',
  End = 'end',
  Cancel = 'cancel'
}

enum Direction {
  Left = 'left',
  Right = 'right',
  Up = 'up',
  Down = 'down'
}

enum InOut {
  In = 'in',
  Out = 'out'
}

type Up = 'up';
type Default = '';

type PanEvent = Timing | Direction | Default;
type PinchEvent = Timing | InOut | Default;
type PressEvent = Up | Default;
type RotateEvent = Timing | Default;
type SwipeEvent = Direction | Default;
type TapEvent = Default;

function isDefault(modifier: string): boolean {
  return modifier === '';
}

function isUp(modifier: string): boolean {
  return modifier === 'up';
}

function isPanEvent(modifier: string): boolean {
  switch (modifier) {
    case Timing.Start:
    case Timing.Move:
    case Timing.End:
    case Timing.Cancel:
      return true;
    case Direction.Left:
    case Direction.Right:
    case Direction.Up:
    case Direction.Down:
      return true;
  }

  if (isDefault(modifier)) {
    return true;
  }

  return false;
}

function isPinchEvent(modifier: string): boolean {
  switch (modifier) {
    case Timing.Start:
    case Timing.Move:
    case Timing.End:
    case Timing.Cancel:
      return true;
    case InOut.In:
    case InOut.Out:
      return true;
  }

  if (isDefault(modifier)) {
    return true;
  }

  return false;
}

function isPressEvent(modifier: string): boolean {
  if (isUp(modifier)) {
    return true;
  }

  if (isDefault(modifier)) {
    return true;
  }

  return false;
}

function isRotateEvent(modifier: string): boolean {
  switch (modifier) {
    case Timing.Start:
    case Timing.Move:
    case Timing.End:
    case Timing.Cancel:
      return true;
  }

  if (isDefault(modifier)) {
    return true;
  }

  return false;
}

function isSwipeEvent(modifier: string): boolean {
  switch (modifier) {
    case Direction.Left:
    case Direction.Right:
    case Direction.Up:
    case Direction.Down:
      return true;
  }

  if (isDefault(modifier)) {
    return true;
  }

  return false;
}

function isTapEvent(modifier: string): boolean {
  if (isDefault(modifier)) {
    return true;
  }

  return false;
}

function detectPanEvent(modifiers: string[]): PanEvent {
  return (modifiers.find((m: string) => isPanEvent(m)) as PanEvent) || '';
}

function detectPinchEvent(modifiers: string[]): PinchEvent {
  return (modifiers.find((m: string) => isPinchEvent(m)) as PinchEvent) || '';
}

function detectPressEvent(modifiers: string[]): PressEvent {
  return (modifiers.find((m: string) => isPressEvent(m)) as PressEvent) || '';
}

function detectRotateEvent(modifiers: string[]): RotateEvent {
  return (modifiers.find((m: string) => isRotateEvent(m)) as RotateEvent) || '';
}

function detectSwipeEvent(modifiers: string[]): SwipeEvent {
  return (modifiers.find((m: string) => isSwipeEvent(m)) as SwipeEvent) || '';
}

function detectTapEvent(modifiers: string[]): TapEvent {
  return (modifiers.find((m: string) => isTapEvent(m)) as TapEvent) || '';
}

export default {
  bind(el: HTMLElement, binding: DirectiveBinding) {
    const hammer: HammerManager = new Hammer(el);
    const touch = binding.arg as Touch;
    const listener = binding.value as HammerListener;
    const modifiers = Object.keys(binding.modifiers);

    switch (touch) {
      case Touch.Pan:
        const panEvent = detectPanEvent(modifiers);
        hammer.on(`pan${panEvent}`, listener);
        break;
      case Touch.Pinch:
        const pinchEvent = detectPinchEvent(modifiers);
        hammer.get('pinch').set({ enable: true });
        hammer.on(`pinch${pinchEvent}`, listener);
        break;
      case Touch.Press:
        const pressEvent = detectPressEvent(modifiers);
        hammer.on(`press${pressEvent}`, listener);
        break;
      case Touch.Rotate:
        const rotateEvent = detectRotateEvent(modifiers);
        hammer.get('rotate').set({ enable: true });
        hammer.on(`rotate${rotateEvent}`, listener);
        break;
      case Touch.Swipe:
        const swipeEvent = detectSwipeEvent(modifiers);
        hammer.on(`swipe${swipeEvent}`, listener);
        break;
      case Touch.Tap:
        const tapEvent = detectTapEvent(modifiers);
        hammer.on(`tap${tapEvent}`, listener);
        break;
    }
  }
};
