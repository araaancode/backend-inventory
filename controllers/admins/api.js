const Product = require('../../models/Product');
const User = require('../../models/User');
const { NotFoundError, BadRequestError } = require('../../errors');

// @desc    Get all products (admin view)
// @route   GET /api/admin/products
// @access  Admin
const getAllProducts = async (req, res) => {
  const { seller, status } = req.query;
  
  const query = {};
  if (seller) query.seller = seller;
  if (status) query.isActive = status === 'active';

  const products = await Product.find(query)
    .populate('seller', 'name email')
    .sort('-createdAt');

  res.json(products);
};

// @desc    Create product on behalf of seller
// @route   POST /api/admin/products
// @access  Admin
const createProduct = async (req, res) => {
  // Validate seller exists
  const seller = await User.findOne({
    _id: req.body.seller,
    role: 'seller'
  });
  
  if (!seller) {
    throw new BadRequestError('Valid seller ID required');
  }

  const product = await Product.create(req.body);
  res.status(201).json(product);
};

// @desc    Get any product details
// @route   GET /api/admin/products/:id
// @access  Admin
const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id)
    .populate('seller', 'name email')
    .populate('inventory');

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  res.json(product);
};

// @desc    Update any product
// @route   PATCH /api/admin/products/:id
// @access  Admin
const updateProduct = async (req, res) => {
  // Can change ownership if needed
  if (req.body.seller) {
    const seller = await User.findOne({
      _id: req.body.seller,
      role: 'seller'
    });
    if (!seller) throw new BadRequestError('Invalid seller ID');
  }

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  res.json(product);
};

// @desc    Delete product permanently
// @route   DELETE /api/admin/products/:id
// @access  Admin
const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  // Cascade delete inventory
  await Inventory.deleteMany({ product: req.params.id });

  res.json({ message: 'Product permanently deleted' });
};

// @desc    Toggle product status
// @route   PATCH /api/admin/products/:id/status
// @access  Admin
const toggleProductStatus = async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    throw new NotFoundError('Product not found');
  }

  product.isActive = !product.isActive;
  await product.save();

  res.json({ 
    message: `Product ${product.isActive ? 'activated' : 'deactivated'}`,
    isActive: product.isActive
  });
};

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  toggleProductStatus
};