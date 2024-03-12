import prisma from "../db";

// Get all updates
export const getUpdates = async (req, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user.id },
    include: {
      products: true,
    },
  });

  const updates = await prisma.update.findMany({
    where: {
      productId: {
        in: user.products.map((product) => product.id),
      },
    },
  });

  res.json({ data: updates });
}

// Get a single update
export const getOneUpdate = async (req, res) => {
  const update = await prisma.update.findUnique({
    where: { id: req.params.id },
  });

  res.json({ data: update });
}

// Create a new update
export const createUpdate = async (req, res) => {
  const { title, body, productId } = req.body;

  const product = await prisma.product.findUnique({
    where: { id: productId },
  });

  if(!product) {
    res.status(404);
    res.json({ message: "Product not found" });
    return;
  }

  const update = await prisma.update.create({
    data: {
      title,
      body,
      product: {
        connect: {
          id: productId,
        },
      },
    }
  });

  res.status(201);
  res.json({ data: update });
}

// Update an update
export const updateUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.flatMap((product) => product.updates);

  const update = updates.find((update) => update.id === req.params.id);

  if(!update) {
    res.status(404);
    res.json({ message: "Update not found" });
    return;
  }

  const updatedUpdate = await prisma.update.update({
    where: { id: req.params.id },
    data: req.body,
  });

  res.json({ data: updatedUpdate });
}

// Delete an update
export const deleteUpdate = async (req, res) => {
  const products = await prisma.product.findMany({
    where: {
      belongsToId: req.user.id,
    },
    include: {
      updates: true,
    },
  });

  const updates = products.flatMap((product) => product.updates);

  const update = updates.find((update) => update.id === req.params.id);

  if(!update) {
    res.status(404);
    res.json({ message: "Update not found" });
    return;
  }

  await prisma.update.delete({
    where: { id: req.params.id },
  });

  res.json({ message: "Update deleted" });
}