import cartModel from "../models/cart.model.js";
import productModel from "../models/product.model.js";

export const addToCartController = async (req, res) => {
  try {
    const { productId, quantity, size } = req.body;

    // 1. Product check
    const product = await productModel.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // 2. Size check
    const selectedSize = product.sizes.find((s) => s.size === size);

    if (!selectedSize) {
      return res.status(400).json({
        message: "Invalid size",
      });
    }

    // 3. Quantity validation
    if (!quantity || quantity <= 0) {
      return res.status(400).json({
        message: "Quantity must be greater than 0",
      });
    }

    // 4. Stock check
    if (selectedSize.stock < quantity) {
      return res.status(400).json({
        message: "Insufficient stock",
      });
    }

    // 5. Find user's cart
    let cart = await cartModel.findOne({
      user: req.user.userId,
    });

    // 6. Create cart if it doesn't exist
    if (!cart) {
      cart = await cartModel.create({
        user: req.user.userId,
        products: [],
      });
    }

    // 7. Check if same product + same size already exists
    const productInCart = cart.products.find(
      (p) => p.product.toString() === productId && p.size === size,
    );

    // 8. If already in cart → increase quantity
    if (productInCart) {
      if (productInCart.quantity + quantity > selectedSize.stock) {
        return res.status(400).json({
          message: "Insufficient stock",
        });
      }

      productInCart.quantity += quantity;

      await cart.save();
    }

    // 9. If not in cart → add new product
    else {
      cart.products.push({
        product: productId,
        quantity: quantity,
        size: size,
      });

      await cart.save();
    }

    return res.status(200).json({
      message: "Product added to cart",
      data: {
        cart,
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



export const getCartController = async (req, res) => {
  try {
    let cart = await cartModel
      .findOne({ user: req.user.userId })
      .populate("products.product", "title price images sizes published");

    if (!cart) {
      cart = await cartModel.create({
        user: req.user.userId,
        products: [],
      });
    }

    const cartData = cart.toObject();

    cartData.products = cartData.products.map((item) => {
      const product = item.product;

      if (!product) {
        return { ...item, isUnavailable: true };
      }

      const sizeInfo = product.sizes?.find((s) => s.size === item.size);
      const { sizes, ...productData } = product;

      return {
        ...item,
        product: productData,
        availableStock: sizeInfo?.stock ?? 0,
        isUnavailable: product.published === false,
      };
    });

    return res.status(200).json({
      message: "Cart retrieved successfully",
      data: { cart: cartData },
    });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const updateCartItemController = async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;
    const { userId } = req.user;

    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.products.id(itemId);

    if (!item) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    const product = await productModel.findById(item.product);

    if (!product) {
      return res.status(404).json({ message: "Product no longer available" });
    }

    const selectedSize = product.sizes.find((s) => s.size === item.size);

    if (!selectedSize) {
      return res.status(400).json({ message: "Size no longer available" });
    }

    if (quantity > selectedSize.stock) {
      return res.status(400).json({ message: "Insufficient stock" });
    }

    item.quantity = quantity;
    await cart.save();

    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const removeCartItemController = async (req, res) => {
  const { userId } = req.user;
  const { itemId } = req.params;

  try {
    const cart = await cartModel.findOne({ user: userId });

    if (!cart) {
      return res.status(404).json({
        message: "user cart not found",
      });
    }

    const item = cart.products.id(itemId);

    if (!item) {
      return res.status(404).json({
        message: "item not found in cart",
      });
    }

    item.deleteOne();
    await cart.save();

    res.status(200).json({
      message: "Item removed successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

export const removeCartController = async (req, res) => {
  const { userId } = req.user;

  try {
    const cart = await cartModel.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        message: "user cart not found in database",
      });
    }

    cart.products = [];

    await cart.save();

    return res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
