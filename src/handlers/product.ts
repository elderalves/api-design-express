import prisma from "../db";

// Get all products
export const getProducts = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      products: true,
    },
  });

  res.json({ data: user.products });
}

// Get a single product
export const getOneProduct = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      products: {
        where: { id: req.params.id },
      },
    },
  });

  res.json({ data: user.products[0] });
}

// Create a new product
export const createProduct = async (req, res, next) => {
  try {
    const { name } = req.body;

    const product = await prisma.product.create({
      data: {
        name,
        belongsTo: {
          connect: {
            id: req.user.id,
          },
        },
      },
    });

    res.status(201);
    res.json({ data: product });
  } catch (error) {
    next(error);
  }
}

// Update a product
export const updateProduct = async (req, res) => {
  const { name } = req.body;

  const product = await prisma.product.update({
    where: { id: req.params.id },
    data: { name },
  });

  res.json({ data: product });
}

// Delete a product
export const deleteProduct = async (req, res) => {
  await prisma.product.delete({
    where: { 
      id_belongsToId: {
        id: req.params.id,
        belongsToId: req.user.id,
      } 
    },
  });

  res.json({ message: "Product deleted" });
};