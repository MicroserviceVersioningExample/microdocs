/**
 * Decorate model with functions
 * @param {T} model
 * @returns {ModelDecorator | T}
 */
export function decorate<T extends any>(model: T, parent?: ModelDecorator): T | ModelDecorator {

  let clone: any = {};
  Object.keys(model).forEach(key => {
    let value = model[key];
    if (value) {
      let decoratedValue = decorateValue(value, clone);
      clone[key] =
        typeof(decoratedValue) === "object" && decoratedValue.$ref ? resolve(decoratedValue) : decoratedValue;
    }
  });

  clone._parent = parent;
  return clone;
}

function decorateValue(value: any, parent: ModelDecorator): any {
  if (Array.isArray(value)) {
    return value.map(item => decorateValue(item, parent));
  } else if (typeof(value) === "object") {
    return decorate(value, parent);
  } else {
    return value;
  }
}

export interface ModelDecorator {

  _parent?: ModelDecorator;
  $ref?: string;

}

/**
 * Resolve a model reference
 * @param {ModelDecorator} modelRef
 * @returns {Promise<any>}
 */
export function resolve(modelRef?: ModelDecorator): Promise<any> {
  let ref = modelRef.$ref;
  if (!ref) {
    return Promise.resolve(modelRef);
  }

  // todo
  return null;
}
