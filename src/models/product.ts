import { IsString, IsNotEmpty, IsNumber, IsPositive } from "class-validator";

export class Product {
  @IsNotEmpty()
  @IsString()
  private title: string;
  @IsNumber()
  @IsPositive()
  private price: number;

  constructor(title: string, price: number) {
    this.title = title;
    this.price = price;
  }

  getInformation(): [string, string] {
    return [this.title, `$${this.price}`];
  }
}
