const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Property title is required'],
    trim: true
  },
  type: {
    type: String,
    required: [true, 'Property type is required'],
    enum: ['House', 'Apartment', 'Villa', 'Land', 'Commercial'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Property location is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Property price is required'],
    min: [0, 'Price cannot be negative']
  },
  area: {
    type: Number,
    required: [true, 'Property area is required'],
    min: [0, 'Area cannot be negative']
  },
  bedrooms: {
    type: Number,
    required: [true, 'Number of bedrooms is required'],
    min: [0, 'Bedrooms cannot be negative']
  },
  bathrooms: {
    type: Number,
    required: [true, 'Number of bathrooms is required'],
    min: [0, 'Bathrooms cannot be negative']
  },
  status: {
    type: String,
    required: [true, 'Property status is required'],
    enum: ['Available', 'Sold', 'Pending', 'Rented'],
    default: 'Available'
  },
  description: {
    type: String,
    required: [true, 'Property description is required'],
    trim: true
  },
  picture: {
    type: String,
    required: [true, 'Property picture is required']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
propertySchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Add a pre-init hook to log model creation
propertySchema.pre('init', function() {
  console.log('Property model initialized');
});

// Create the model
const Property = mongoose.model('Property', propertySchema);

// Log that the model was created
console.log('Property model registered');

module.exports = Property;