// decorators

// class decorator
function Log(constructor: any) {
  console.log("Class Decorator");
  console.log({ constructor });
}

// property decorator
// for static property, target is the contructor
// for non-static property, target is the prototype
function Log2(target: any, name: string | symbol | number) {
  console.log("Property Decorator");
  console.log({ target, name });
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

// Method Decorator
// for static method, same as property decorator, target is the constructor
// for non-static method, same as property decorator, target is the prototype
function Log4(
  target: any,
  name: string | symbol | number,
  desc: PropertyDescriptor
) {
  console.log("Method Decorator");
  console.log({ target, name, desc });
}
// Parameter Decorator
function Log5(target: any, name: string | symbol | number, position: number) {
  console.log("Parameter Decorator");
  console.log({ target, name, position });
}

@Log
class Product {
  @Log2
  public static type: string = "product";
  @Log2
  private title: string;
  private _price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this._price = price;
  }

  @Log4
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

  @Log4
  getPriceWithTax(@Log5 tax: number): number {
    return this._price * (1 + tax);
  }
}
