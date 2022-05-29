// Autobind decorator
export function autobind(
  _1: any,
  _2: string,
  desc: PropertyDescriptor
): PropertyDescriptor {
  const method = desc.value;
  return {
    configurable: true,
    enumerable: false,
    get() {
      return method.bind(this);
    },
  };
}
