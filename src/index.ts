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

// class decorator with decorator factory
function WithTemplate(template: string, hookId: string) {
  return function <T extends { new (...args: any[]): { name: string } }>(
    target: T
  ) {
    console.log("redering template");
    // class decorator can return a new customized contructor function to replace the old constructor function
    return class extends target {
      constructor(...args: any[]) {
        super(...args);
        const hookEl = document.getElementById(hookId) as HTMLDivElement;
        if (hookEl) {
          hookEl.innerHTML = template;

          const paragraphEl = document.createElement("p");

          paragraphEl.textContent = this.name;
          hookEl.append(paragraphEl);
        }
      }
    };
  };
}

@WithTemplate("<h1>Template</h1>", "root")
class Person {
  constructor(private _name: string) {}

  get name() {
    return this._name;
  }

  set name(name: string) {
    this._name = name;
  }

  getInfo(): string {
    return `Name: ${this.name}`;
  }
}

function Autobind(
  target: any,
  name: string | symbol | number,
  desc: PropertyDescriptor
): PropertyDescriptor {
  // the method this decorator is assigned to
  const method = desc.value;

  // adjusted property descriptor
  return {
    enumerable: false,
    configurable: true,
    get() {
      return method.bind(this);
    },
  };
}

class Printable {
  message = "This works!";

  @Autobind
  print() {
    console.log(this.message);
  }
}

const printable = new Printable();

const button = document.getElementById("btn-click") as HTMLButtonElement;
if (button) {
  button.addEventListener("click", printable.print);
}
