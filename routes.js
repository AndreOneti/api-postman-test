const { Router } = require("express");

const routes = Router();

const users = [];
const products = [];

routes.get("/", (_req, res,) => {
  return res
    .status(200)
    .json({ users, products })
    .end();
})

//? User Route
routes.get("/user", (_req, res,) => {
  return res
    .status(200)
    .json({ users })
    .end();
});

routes.post("/user", (req, res,) => {

  const { name, email = "" } = req.body;

  if (!name) {
    return res
      .status(400)
      .json({ error: 400, errorMessage: "Name is required" })
      .end();
  }

  const newUser = { name, email, _id: Date.now() };

  users.push(newUser);

  return res
    .status(201)
    .json({ user: newUser })
    .end();
});

routes.delete("/user", (req, res,) => {

  const { id } = req.body;

  const index = users.findIndex(({ _id }) => _id === id);

  if (index === -1) {
    return res
      .status(400)
      .json({ error: 400, errorMessage: "User not found!" })
      .end();
  }

  const removedUser = users.splice(index, 1);

  return res
    .status(200)
    .json({ user: removedUser[0] })
    .end();
});

//? Product Route
routes.get("/product", (_req, res,) => {
  return res
    .status(200)
    .json({ products })
    .end();
});

routes.post("/product", (req, res,) => {

  const { name, category } = req.body;

  if (!name || !category) {
    return res
      .status(400)
      .json({ error: 400, errorMessage: "Name and Category is required" })
      .end();
  }

  const newProduct = { name, category, _id: Date.now() };

  products.push(newProduct);

  return res
    .status(201)
    .json({ product: newProduct })
    .end();
});

routes.delete("/product", (req, res,) => {

  const { id } = req.body;

  const index = products.findIndex(({ _id }) => _id === id);

  if (index === -1) {
    return res
      .status(400)
      .json({ error: 400, errorMessage: "Product not found!" })
      .end();
  }

  const removedProducts = products.splice(index, 1);

  return res
    .status(200)
    .json({ product: removedProducts[0] })
    .end();
});

module.exports = routes;
