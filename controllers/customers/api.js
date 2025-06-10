const Product = require('../../models/Product');
const Customer = require('../../models/User');
const { NotFoundError } = require('../../errors');



// @desc    Get all products (customer view)
// @route   GET /api/customer/products
// @access  Customer
const getAllProducts = async (req, res) => {
  const { search, category, minPrice, maxPrice } = req.query;
  
  const query = { 
    isActive: true,
    ...(search && { 
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }),
    ...(category && { mainCategory: category }),
    ...(minPrice && { sellPrice: { $gte: Number(minPrice) } }),
    ...(maxPrice && { sellPrice: { $lte: Number(maxPrice) } })
  };

  const products = await Product.find(query)
    .select('-purchasePrice -secondaryUnitRatio -initialStock') // Hide sensitive fields
    .sort('-createdAt');

  res.json(products);
};

// @desc    Get single product details
// @route   GET /api/customer/products/:id
// @access  Customer
const getProductDetails = async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    isActive: true
  })
    .populate('seller', 'name avatar') // Show basic seller info
    .select('-purchasePrice -internalNotes'); // Hide sensitive fields

  if (!product) {
    throw new NotFoundError('Product not found or unavailable');
  }

  res.json(product);
};

// @desc    Add product to favorites
// @route   POST /api/customer/products/:id/favorite
// @access  Customer
const addToFavorites = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) throw new NotFoundError('Product not found');

  await Customer.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { favoriteProducts: product._id } }, // Prevent duplicates
    { new: true }
  );

  res.json({ message: 'Product added to favorites' });
};

// @desc    Remove product from favorites
// @route   DELETE /api/customer/products/:id/favorite
// @access  Customer
const removeFromFavorites = async (req, res) => {
  await Customer.findByIdAndUpdate(
    req.user._id,
    { $pull: { favoriteProducts: req.params.id } }
  );

  res.json({ message: 'Product removed from favorites' });
};

// @desc    Get favorite products
// @route   GET /api/customer/products/favorites
// @access  Customer
const getFavorites = async (req, res) => {
  const customer = await Customer.findById(req.user._id)
    .populate({
      path: 'favoriteProducts',
      match: { isActive: true },
      select: 'title photo sellPrice'
    });

  res.json(customer.favoriteProducts);
};

module.exports = {
  getAllProducts,
  getProductDetails,
  addToFavorites,
  removeFromFavorites,
  getFavorites
};