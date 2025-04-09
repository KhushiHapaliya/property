const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const Property = require('../models/PropertyModel');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const uploadDir = 'public/uploads/properties';
    
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'property-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter to only allow image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Not an image! Please upload only images.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all properties
router.get('/', async (req, res) => {
  try {
    const properties = await Property.find().sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search properties with filters
router.get('/search', async (req, res) => {
  try {
    const { type, minPrice, maxPrice, bedrooms, bathrooms, status } = req.query;
    
    // Build query object
    const query = {};
    
    if (type) query.type = type;
    if (status) query.status = status;
    if (bedrooms) query.bedrooms = { $gte: parseInt(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: parseInt(bathrooms) };
    
    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseInt(minPrice);
      if (maxPrice) query.price.$lte = parseInt(maxPrice);
    }
    
    const properties = await Property.find(query).sort({ createdAt: -1 });
    res.status(200).json(properties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a single property by ID
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    res.status(200).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// IMPORTANT: This is the route your frontend is looking for
router.get('/PropertyModel/properties', async (req, res) => {
  try {
    const properties = await Property.find();
    res.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/properties', async (req, res) => {
  try {
    console.log("GET /properties route hit");
    const properties = await Property.find();
    console.log(`Found ${properties.length} properties`);
    res.status(200).json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    res.status(500).json({ message: error.message });
  }
});

// Create a new property
router.post('/', upload.single('propertyImage'), async (req, res) => {
  try {
    // Add image path to property data
    const propertyData = req.body;
    
    if (req.file) {
      propertyData.picture = `/uploads/properties/${req.file.filename}`;
    } else {
      return res.status(400).json({ message: 'Property image is required' });
    }
    
    // Create new property
    const property = new Property(propertyData);
    const savedProperty = await property.save();
    
    res.status(201).json(savedProperty);
  } catch (error) {
    // If there was an error and we uploaded a file, delete it
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// Update a property
router.put('/:id', upload.single('propertyImage'), async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Handle image update
    if (req.file) {
      // Delete old image if it exists (and not a default image)
      if (property.picture && property.picture.startsWith('/uploads/properties/')) {
        const oldImagePath = path.join('public', property.picture);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }
      
      // Set new image path
      req.body.picture = `/uploads/properties/${req.file.filename}`;
    }
    
    // Update property with new data
    Object.keys(req.body).forEach(key => {
      property[key] = req.body[key];
    });
    
    property.updatedAt = Date.now();
    const updatedProperty = await property.save();
    
    res.status(200).json(updatedProperty);
  } catch (error) {
    // If there was an error and we uploaded a file, delete it
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Failed to delete uploaded file:', err);
      });
    }
    
    res.status(400).json({ message: error.message });
  }
});

// Delete a property
router.delete('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }
    
    // Delete property image if it exists (and not a default image)
    if (property.picture && property.picture.startsWith('/uploads/properties/')) {
      const imagePath = path.join('public', property.picture);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }
    
    // Delete property from database
    await Property.deleteOne({ _id: req.params.id });
    
    res.status(200).json({ message: 'Property deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;