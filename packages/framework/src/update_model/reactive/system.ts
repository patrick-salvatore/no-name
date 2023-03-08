import type { Dispose, Scope, Callable, SignalOptions, ComputationNode, MaybeDisposable } from "./types";

let scheduledEffects = false,
  runningEffects = false,
  currentScope: Scope | null = null,
  currentObserver: ComputationNode | null = null,
  currentObservers: ComputationNode[] | null = null,
  currentObserversIndex = 0,
  effects: ComputationNode[] = [];

const $TRACKING = Symbol("$TRACKING");
const $SIGNAL = Symbol("$SIGNAL");
const $EFFECT = Symbol("$EFFECT");
const SCOPE = Symbol("SCOPE");
const ERROR_HANDLERS = Symbol("ERROR_HANDLERS");
const NOOP = () => {};

const CLEAN = 0;
const CHECK = 1;
const DIRTY = 2;
const DISPOSED = 3;

function flushEffects() {
  scheduledEffects = true;
  queueMicrotask(runEffects);
}

function unwrap<T>(fn: T): T extends () => any ? ReturnType<T> : T {
  return isFunction(fn) ? fn() : fn;
}

function runEffects() {
  if (!effects.length) {
    scheduledEffects = false;
    return;
  }

  runningEffects = true;

  for (let i = 0; i < effects.length; i++) {
    // If parent scope is dirty it means that this effect will be disposed of so we skip.
    if (!isZombie(effects[i])) read.call(effects[i]);
  }

  effects = [];
  scheduledEffects = false;
  runningEffects = false;
}

function isFunction(fnOrValue: unknown): fnOrValue is Function {
  return fnOrValue instanceof Function;
}

function referenceEquality<T>(_old: T, _new: T) {
  return _old === _new;
}

function isNotEqual(a: unknown, b: unknown) {
  return a !== b;
}

function isZombie(node: Scope) {
  let scope = node[SCOPE];

  while (scope) {
    // We're looking for a dirty parent effect scope.
    if (scope._compute && scope._state === DIRTY) return true;
    scope = scope[SCOPE];
  }

  return false;
}

function stale(node: any, state: number) {
  if (node._state >= state) return;

  if (node._effect && node._state === CLEAN) {
    effects.push(node);
    if (!scheduledEffects) flushEffects();
  }

  node._state = state;
  if (node._observers) {
    for (let i = 0; i < node._observers.length; i++) {
      stale(node._observers[i], CHECK);
    }
  }
}

function shouldUpdate(node: ComputationNode) {
  if (node._state === CHECK) {
    for (let i = 0; i < node._sources!.length; i++) {
      shouldUpdate(node._sources![i]);

      if ((node._state as number) === DIRTY) {
        break;
      }
    }
  }

  if (node._state === DIRTY) {
    update(node);
  }

  node._state = CLEAN;
}

function cleanup(node: ComputationNode) {
  if (node._nextSibling && node._nextSibling[SCOPE] === node) dispose.call(node, false);
  if (node._cleanups) emptyDisposal(node);
  if (node._context && node._context[ERROR_HANDLERS]) (node._context[ERROR_HANDLERS] as any[]) = [];
}

function emptyDisposal(scope: ComputationNode) {
  try {
    if (Array.isArray(scope._cleanups)) {
      for (let i = 0; i < scope._cleanups.length; i++) {
        const callable = scope._cleanups![i];
        callable.call(callable);
      }
    } else {
      scope._cleanups!.call(scope._cleanups);
    }

    scope._cleanups = null;
  } catch (error) {
    handleError(scope, error);
  }
}

function update(node: ComputationNode) {
  let prevObservers = currentObservers,
    prevObserversIndex = currentObserversIndex;

  currentObservers = null as ComputationNode[] | null;
  currentObserversIndex = 0;

  try {
    cleanup(node);

    const result = compute(node, node._computed!, node);

    if (currentObservers) {
      if (node._sources) removeSourceObservers(node, currentObserversIndex);

      if (node._sources && currentObserversIndex > 0) {
        node._sources.length = currentObserversIndex + currentObservers.length;
        for (let i = 0; i < currentObservers.length; i++) {
          node._sources[currentObserversIndex + i] = currentObservers[i];
        }
      } else {
        node._sources = currentObservers;
      }

      let source: ComputationNode;
      for (let i = currentObserversIndex; i < node._sources.length; i++) {
        source = node._sources[i];
        if (!source._observers) source._observers = [node];
        else source._observers.push(node);
      }
    } else if (node._sources && currentObserversIndex < node._sources.length) {
      removeSourceObservers(node, currentObserversIndex);
      node._sources.length = currentObserversIndex;
    }

    if (!node._effect && node._init) {
      write.call(node, result);
    } else {
      node._value = result;
      node._init = true;
    }
  } catch (error) {
    handleError(node, error);

    if (node._state === DIRTY) {
      cleanup(node);
      if (node._sources) removeSourceObservers(node, 0);
    }

    return;
  }

  currentObservers = prevObservers;
  currentObserversIndex = prevObserversIndex;

  node._state = CLEAN;
}

function handleError(scope: Scope | null, error: unknown, depth?: number) {
  const handlers = lookup(scope, ERROR_HANDLERS);

  if (!handlers) throw error;

  try {
    const coercedError = error instanceof Error ? error : Error(JSON.stringify(error));
    for (const handler of handlers) handler(coercedError);
  } catch (error) {
    handleError(scope![SCOPE], error);
  }
}

function read(this: ComputationNode) {
  if (this._state === DISPOSED) return this._value;

  if (currentObserver) {
    if (!currentObservers && currentObserver._sources && currentObserver._sources[currentObserversIndex] == this) {
      currentObserversIndex++;
    } else {
      if (!currentObservers) currentObservers = [this];
      else currentObservers.push(this);
    }
  }

  if (this._computed) {
    shouldUpdate(this);
  }

  return this._value;
}

function write(this: ComputationNode, newValue: any): any {
  const value = isFunction(newValue) ? newValue(this._value) : newValue;

  if (this._changed(this._value, value)) {
    this._value = value;
    if (this._observers) {
      for (let i = 0; i < this._observers.length; i++) {
        stale(this._observers[i], DIRTY);
      }
    }
  }

  return this._value;
}

function removeSourceObservers(node: ComputationNode, index: number) {
  let source: ComputationNode, swap: number;
  for (let i = index; i < node._sources!.length; i++) {
    source = node._sources![i];
    if (source._observers) {
      swap = source._observers.indexOf(node);
      source._observers[swap] = source._observers[source._observers.length - 1];
      source._observers.pop();
    }
  }
}

function lookup(scope: Scope | null, key: string | symbol): any {
  if (!scope) return;

  let current: Scope | null = scope,
    value;

  while (current) {
    value = current._context?.[key];
    if (value !== undefined) return value;
    current = current[SCOPE];
  }
}

// ------------------------------------

function peek<T>(compute: () => T): T {
  const prev = currentObserver;
  currentObserver = null;
  const result = compute();
  currentObserver = prev;
  return result;
}

function untrack<T>(compute: () => T): T {
  compute[$TRACKING] = false;

  const prev = currentScope;
  currentScope = null;
  const result = peek(compute);
  currentScope = prev;

  compute[$TRACKING] = true;

  return result;
}

function root<T>(init: (dispose: Dispose) => T): T {
  const scope = createScope();
  return compute(scope, !init.length ? init : init.bind(null, dispose.bind(scope)), null) as T;
}

let scopes: Scope[] = [];

function onDispose(disposable: MaybeDisposable): Dispose {
  if (!disposable || !currentScope) return (disposable as Dispose) || NOOP;

  const node = currentScope;

  if (!node._cleanups) {
    node._cleanups = disposable;
  } else if (Array.isArray(node._cleanups)) {
    node._cleanups.push(disposable);
  } else {
    node._cleanups = [node._cleanups, disposable];
  }

  return function removeDispose() {
    if (node._state === DISPOSED) return;
    disposable.call(null);
    if (isFunction(node._cleanups)) {
      node._cleanups = null;
    } else if (Array.isArray(node._cleanups)) {
      node._cleanups.splice(node._cleanups.indexOf(disposable), 1);
    }
  };
}

function dispose(this: Scope, self = true) {
  if (this._state === DISPOSED) return;

  let current = (self ? this : this._nextSibling) as ComputationNode | null,
    head = self ? this._prevSibling : this;

  if (current) {
    scopes.push(this);
    do {
      current._state = DISPOSED;
      if (current._cleanups) emptyDisposal(current);
      if (current._sources) removeSourceObservers(current, 0);
      if (current._prevSibling) current._prevSibling._nextSibling = null;
      current[SCOPE] = null;
      current._sources = null;
      current._observers = null;
      current._prevSibling = null;
      current._context = null;
      scopes.push(current);
      current = current._nextSibling as ComputationNode | null;
    } while (current && scopes.includes(current[SCOPE]!));
  }

  if (head) head._nextSibling = current;
  if (current) current._prevSibling = head;
  scopes = [];
}

function compute<T>(scope: Scope | null, fn: Callable<Scope | null, T>, observer: ComputationNode<T> | null): T {
  let prevScope = currentScope,
    prevObserver = currentObserver;

  currentScope = scope;
  currentObserver = observer;

  try {
    return fn.call(scope);
  } finally {
    currentScope = prevScope;
    currentObserver = prevObserver;
  }
}

const Scope = function ScopeNode(this: Scope) {
  this[SCOPE] = null;

  this._prevSibling = null;
  this._nextSibling = null;

  if (currentScope) currentScope.append(this);
};

const ScopeProto = Scope.prototype;
ScopeProto._context = null;
ScopeProto._computed = null;
ScopeProto._disposal = null;

ScopeProto.append = function appendScope(scope: Scope) {
  scope[SCOPE] = this;
  scope._prevSibling = this;
  if (this._nextSibling) this._nextSibling._prevSibling = scope;
  scope._nextSibling = this._nextSibling;
  this._nextSibling = scope;
};

export function scoped<T>(run: () => T, scope: Scope | null): T | undefined {
  try {
    return compute<T>(scope, run, null);
  } catch (error) {
    handleError(scope, error);
    return; // TS -_-
  }
}

function createScope(): Scope {
  return new Scope();
}

const Computation = function ComputationNode(this: ComputationNode, initialValue, compute, options) {
  Scope.call(this);

  if (compute) this._computed = compute;
  this._name = options?.name ?? (this._computed ? "computed" : "signal");

  this._state = compute ? DIRTY : CLEAN;
  this._init = false;
  this._effect = false;
  this._sources = null;
  this._observers = null;
  this._value = initialValue;
  this._cleanups = [];
};

const ComputeProto: ComputationNode = Computation.prototype;
Object.setPrototypeOf(ComputeProto, ScopeProto);
ComputeProto._changed = isNotEqual;
ComputeProto.call = read;

function createComputation<T>(initialValue: any, compute: (() => T) | null, options?: SignalOptions<T>): ComputationNode {
  return new Computation(initialValue, compute, options);
}

// Other
export { $TRACKING, $SIGNAL, $EFFECT, SCOPE, unwrap, isFunction, referenceEquality, isNotEqual, read, write };

// Library
export { createComputation, root, dispose, onDispose, untrack, compute, createScope };
