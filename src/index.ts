// decorators

// class decorator
function Log(constructor: any) {
  console.log("Class Decorator");
  console.log({ constructor });
}

// property decorator with decorator factory
function Log2(message: string) {
  // for static property, target is the contructor
  // for non-static property, target is the prototype
  return function (target: any, name: string | symbol | number) {
    console.log(message);
    console.log({ target, name });
  };
}

// Accessor Decorator
function Log3(
  target: any,
  name: string | symbol | number,
  desc: PropertyDescriptor
) {
  console.log("Accessor Decorator");
  console.log({ target, name, desc });
}

// Method Decorator with decorator factory
function Log4(message: string) {
  // for static method, same as property decorator, target is the constructor
  // for non-static method, same as property decorator, target is the prototype
  return function (
    target: any,
    name: string | symbol | number,
    desc: PropertyDescriptor
  ) {
    console.log(message);
    console.log({ target, name, desc });
  };
}

// Parameter Decorator
function Log5(target: any, name: string | symbol | number, position: number) {
  console.log("Parameter Decorator");
  console.log({ target, name, position });
}

@Log
class Product {
  @Log2("static property decorator")
  public static type: string = "product";
  @Log2("property decorator")
  private title: string;
  private _price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this._price = price;
  }

  @Log4("static method decorator")
  static getType(): string {
    return this.type;
  }

  @Log3
  get price() {
    return this._price;
  }

  set price(price: number) {
    this._price = price;
  }

  @Log4("method decorator")
  getPriceWithTax(@Log5 tax: number): number {
    return this._price * (1 + tax);
  }
}
