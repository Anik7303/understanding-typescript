export class Product {
  constructor(private title: string, private price: number) {}

  getInformation(): [string, string] {
    return [this.title, `$${this.price}`];
  }
}
