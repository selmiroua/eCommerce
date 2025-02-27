const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Le nom du produit est requis']
  },
  description: {
    type: String,
    required: [true, 'La description est requise']
  },
  price: {
    type: Number,
    required: [true, 'Le prix est requis'],
    min: [0, 'Le prix ne peut pas être négatif']
  },
  stock: {
    type: Number,
    required: [true, 'Le stock est requis'],
    min: [0, 'Le stock ne peut pas être négatif'],
    validate: {
      validator: Number.isInteger,
      message: 'Le stock doit être un nombre entier'
    }
  },
  category: {
    type: String,
    required: [true, 'La catégorie est requise'],
    enum: {
      values: ['robes', 'pantalons', 'accessoires'],
      message: '{VALUE} n\'est pas une catégorie valide'
    }
  },
  sizes: { 
    type: [String],
    default: []
  },
  colors: { 
    type: [String],
    default: []
  },
  image: {
    type: String,
    default: ''
  },
  images: { 
    type: [String],
    default: []
  },
  categories: {
    style: { 
      type: [String],
      default: []
    },
    fabric: { 
      type: [String],
      default: []
    },
    occasion: { 
      type: [String],
      default: []
    },
    type: { 
      type: [String],
      default: []
    }
  }
}, { 
  timestamps: true,
  toJSON: { getters: true }
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;