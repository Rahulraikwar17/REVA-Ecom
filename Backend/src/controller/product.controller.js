import uploadFile, { deleteImage } from "../services/storage.service.js";
import productModel from "../models/product.model.js";


const MAX_IMAGES = 5;

export const createProduct = async (req, res) => {
  const files = req.files ?? [];

  if (files.length === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  if (files.length > MAX_IMAGES) {
    return res
      .status(400)
      .json({ message: `Maximum ${MAX_IMAGES} images allowed` });
  }

  const fileUrls = [];
  const imageFiles = []; 

  for (let i = 0; i < files.length; i++) {
    const response = await uploadFile({
      buffer: files[i].buffer,
      fileName: files[i].originalname,
    });
    fileUrls.push(response.url);
    imageFiles.push({ url: response.url, fileId: response.fileId });
  }

  const product = await productModel.create({
    title: req.body.title,
    description: req.body.description,
    price: {
      amount: req.body.price.amount,
      currency: req.body.price.currency,
    },
    sizes: req.body.sizes,
    images: fileUrls,
    imageFiles,
    seller: req.user.userId,
    published: req.body.published,
  });

  res.status(201).json({
    message: "product created succesfully ",
    data: {
      product,
    },
  });
};

export const editProductController = async (req, res) => {

  const product = await productModel.findOne({
    _id: req.params.id,
    seller: req.user.userId,
  });

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  const { title, description, price, sizes, existingImages } = req.body;

  product.title = title;
  product.description = description;
  product.price = price;
  product.sizes = sizes;


  let existing;

  try {
    existing = JSON.parse(existingImages ?? "[]");
  } catch {
    return res
      .status(400)
      .json({ message: "existingImages is not valid JSON" });
  }

  if (!Array.isArray(existing)) {
    return res.status(400).json({ message: "existingImages must be an array" });
  }


  const kept = existing.filter((url) => product.images.includes(url));
  const newFiles = req.files ?? [];

  const totalImages = kept.length + newFiles.length; 

  if (totalImages === 0) {
    return res.status(400).json({ message: "At least one image is required" });
  }

  if (totalImages > MAX_IMAGES) {
    return res
      .status(400)
      .json({ message: `Maximum ${MAX_IMAGES} images allowed` });
  }

  const uploaded = await Promise.all(
    newFiles.map((f) =>
      uploadFile({ buffer: f.buffer, fileName: f.originalname }),
    ),
  );


  const keptFiles = (product.imageFiles ?? []).filter((f) =>
    kept.includes(f.url),
  );

  product.images = [...kept, ...uploaded.map((r) => r.url)];
  product.imageFiles = [
    ...keptFiles,
    ...uploaded.map((r) => ({ url: r.url, fileId: r.fileId })),
  ];

  await product.save();

  res.status(200).json({
    message: "product updated successfully",
    data: { product },
  });
};

export const allProductsController = async (req, res) => {
  const product = await productModel.find({ published: true });

  res.status(200).json({
    message: "products fetch succesfully",
    data: {
      product,
    },
  });
};


export const listAllProductToSeller = async (req, res) => {
  const product = await productModel.find({ seller: req.user.userId });

  res.status(200).json({
    message: "products fetch succesfully",
    data: {
      product,
    },
  });
};

export const unlistProductController = async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findOneAndUpdate(
    { _id: id, seller: req.user.userId },
    { published: false },
  );

  if (!product) {
    return res.status(404).json({ message: "product not found by id" });
  }

  res.status(200).json({
    message: "product unlisted successfully",
  });
};

export const listProductController = async (req, res) => {
  const { id } = req.params;

  const product = await productModel.findOneAndUpdate(
    { _id: id, seller: req.user.userId },
    { published: true },
  );

  if (!product) {
    return res.status(404).json({ message: "product not found by id" });
  }

  res.status(200).json({
    message: "product listed successfully",
  });
};

export const productListingController = async (req, res) => {
  try {
    const { id } = req.params;
    const { published } = req.body;

    const product = await productModel.findOneAndUpdate(
      { _id: id, seller: req.user.userId },
      { published },
      { new: true },
    );

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: published
        ? "Product listed successfully"
        : "Product unlisted successfully",
      data: {
        product: { _id: product._id, published: product.published },
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const deleteProductController = async (req, res) => {
  try {
    const product = await productModel.findOneAndDelete({
      _id: req.params.id,
      seller: req.user.userId,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

  
    const files = product.imageFiles ?? [];

    await Promise.allSettled(
      product.images.map((url) =>
        deleteImage({ url, fileId: files.find((f) => f.url === url)?.fileId }),
      ),
    );

    res.status(200).json({
      message: "Product delete successfully",
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const getProductDetailController = async (req, res) => {
  const id = req.params.id;

  try {
    const product = await productModel.findById(id);

    if (!product) {
      return res.status(404).json({
        message: "product not found",
      });
    }

    return res.status(200).json({
      message: "product detail fetch successfull",
      product: {
        title: product.title,
        description: product.description,
        images: product.images,
        price: product.price,
        sizes: product.sizes,
      },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};