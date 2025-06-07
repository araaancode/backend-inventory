const Product = require('../../models/Product');
const Inventory = require('../../models/Inventory');
const { NotFoundError, BadRequestError } = require('../../errors');

// @desc    Get all seller's products
// @route   GET /api/seller/products
// @access  Seller
const getSellerProducts = async (req, res) => {
  const products = await Product.find({ 
    seller: req.user.userId,
    isActive: true
  }).sort('-createdAt');

  res.json(products);
};

// @desc    Create new product
// @route   POST /api/seller/products
// @access  Seller
const createProduct = async (req, res) => {
  req.body.seller = req.user.userId; // Force ownership
  const product = await Product.create(req.body);
  
  // Initialize inventory
  await Inventory.create({
    product: product._id,
    seller: req.user.userId,
    currentStock: req.body.initialStock || 0
  });

  res.status(201).json(product);
};

// @desc    Get single seller product
// @route   GET /api/seller/products/:id
// @access  Seller
const getSellerProduct = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    seller: req.user.userId
  }).populate('inventory');

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  res.json(product);
};

// @desc    Update seller product
// @route   PATCH /api/seller/products/:id
// @access  Seller
const updateSellerProduct = async (req, res) => {
  // Prevent changing ownership
  if (req.body.seller) {
    throw new BadRequestError('Cannot change product ownership');
  }

  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user.userId },
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Update inventory if stock changed
  if (req.body.initialStock !== undefined) {
    await Inventory.updateOne(
      { product: product._id },
      { currentStock: req.body.initialStock }
    );
  }

  res.json(product);
};

// @desc    Deactivate product
// @route   DELETE /api/seller/products/:id
// @access  Seller
const deactivateProduct = async (req, res) => {
  const product = await Product.findOneAndUpdate(
    { _id: req.params.id, seller: req.user.userId },
    { isActive: false },
    { new: true }
  );

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  res.json({ message: 'Product deactivated' });
};

// @desc    Get product inventory
// @route   GET /api/seller/products/:id/inventory
// @access  Seller
const getProductInventory = async (req, res) => {
  const inventory = await Inventory.findOne({
    product: req.params.id,
    seller: req.user.userId
  });

  if (!inventory) {
    throw new NotFoundError('Inventory record not found');
  }

  res.json(inventory);
};

module.exports = {
  getSellerProducts,
  createProduct,
  getSellerProduct,
  updateSellerProduct,
  deactivateProduct,
  getProductInventory
};