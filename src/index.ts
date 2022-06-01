// import { plainToInstance } from "class-transformer";
import { validate } from "class-validator";
import { Product } from "./models";

const p1 = new Product("A book", -10.99);
validate(p1).then((errors) => {
  if (errors.length > 0) {
    console.log({ errors });
    return;
  }
  console.log(p1.getInformation());
});

// const products = [
//   { title: "A Book", price: 10.99 },
//   { title: "A Carpet", price: 100.99 },
// ];

// const loadedProducts = plainToInstance(Product, products);

// for (let product of loadedProducts) {
//   console.log(product.getInformation());
// }
