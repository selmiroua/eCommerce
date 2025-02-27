const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|gif/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).single('image');

// Get all products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: 'Error fetching products' });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new product
exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    // Basic validation
    if (!name?.trim()) {
      return res.status(400).json({ message: 'Le nom du produit est requis' });
    }
    if (!description?.trim()) {
      return res.status(400).json({ message: 'La description est requise' });
    }
    if (!category?.trim()) {
      return res.status(400).json({ message: 'La catégorie est requise' });
    }
    
    // Convert and validate price and stock
    const numericPrice = Number(price);
    const numericStock = Number(stock);
    
    if (isNaN(numericPrice) || numericPrice <= 0) {
      return res.status(400).json({ message: 'Le prix doit être un nombre positif' });
    }
    if (isNaN(numericStock) || numericStock < 0 || !Number.isInteger(numericStock)) {
      return res.status(400).json({ message: 'Le stock doit être un nombre entier positif' });
    }

    let imagePath = '';
    if (image) {
      try {
        // Extract base64 data
        const matches = image.match(/^data:image\/([A-Za-z-+/]+);base64,(.+)$/);
        
        if (matches && matches.length === 3) {
          const imageBuffer = Buffer.from(matches[2], 'base64');
          const fileExtension = matches[1];
          const fileName = `${Date.now()}.${fileExtension}`;
          const uploadDir = path.join(__dirname, '..', 'uploads');
          
          // Create uploads directory if it doesn't exist
          if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
          }
          
          // Save the image file
          const filePath = path.join(uploadDir, fileName);
          fs.writeFileSync(filePath, imageBuffer);
          imagePath = `/uploads/${fileName}`;
          
          console.log('Image saved successfully:', filePath);
        } else {
          console.log('Invalid image data format');
        }
      } catch (error) {
        console.error('Error saving image:', error);
        return res.status(400).json({ message: 'Erreur lors de l\'enregistrement de l\'image' });
      }
    } else if (req.file) {
      try {
        const uploadDir = path.join(__dirname, '..', 'uploads');
        
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }
        
        // Save the image file
        const filePath = path.join(uploadDir, req.file.filename);
        imagePath = `/uploads/${req.file.filename}`;
        
        console.log('Image saved successfully:', filePath);
      } catch (error) {
        console.error('Error saving image:', error);
      }
    }

    const product = new Product({
      name: name.trim(),
      description: description.trim(),
      price: numericPrice,
      stock: numericStock,
      category: category.trim(),
      image: imagePath
    });

    await product.save();
    res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({ message: 'Erreur lors de la création du produit' });
  }
};

// Update product
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    
    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }
    res.status(200).json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get product statistics
exports.getProductStats = async (req, res) => {
  try {
    const total = await Product.countDocuments();
    const outOfStock = await Product.countDocuments({ stock: 0 });
    const lowStock = await Product.countDocuments({ stock: { $gt: 0, $lte: 5 } });

    res.status(200).json({
      total,
      outOfStock,
      lowStock
    });
  } catch (error) {
    console.error('Error getting product stats:', error);
    res.status(500).json({ message: 'Error getting product statistics' });
  }
};