import Joi from 'joi';

export const registerSchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

export const bookSchema = Joi.object({
  title: Joi.string().max(200).required(),
  authors: Joi.array().items(Joi.string()).min(1).required(),
  description: Joi.string().max(2000).required(),
  isbn: Joi.string().allow('', null).optional(),
  isbn13: Joi.string().allow('', null).optional(),
  edition: Joi.string().allow('', null).optional(),
  format: Joi.string().valid('Hardcover', 'Paperback', 'eBook', 'Audiobook').default('Paperback'),
  dimensions: Joi.object({
    length: Joi.number().min(0).optional(),
    width: Joi.number().min(0).optional(),
    height: Joi.number().min(0).optional(),
    unit: Joi.string().valid('cm', 'inch').default('cm')
  }).optional(),
  weight: Joi.object({
    value: Joi.number().min(0).optional(),
    unit: Joi.string().valid('g', 'kg', 'oz', 'lb').default('g')
  }).optional(),
  categories: Joi.array().items(Joi.string()).min(1).required(),
  price: Joi.number().min(0).required(),
  currency: Joi.string().valid('INR', 'USD', 'EUR', 'GBP').default('INR'),
  stock: Joi.number().min(0).required(),
  images: Joi.array().items(Joi.object({
    url: Joi.string().uri().allow('', null).optional(),
    alt: Joi.string().allow('', null).optional()
  })).optional(),
  publishedDate: Joi.date().allow('', null).optional(),
  publisher: Joi.string().allow('', null).optional(),
  language: Joi.string().valid('English', 'Hindi', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Chinese', 'Japanese', 'Korean', 'Arabic', 'Bengali', 'Telugu', 'Marathi', 'Tamil', 'Gujarati', 'Urdu', 'Kannada', 'Malayalam', 'Punjabi').default('English'),
  ageGroup: Joi.string().valid('Children (0-12)', 'Young Adult (13-17)', 'Adult (18+)', 'All Ages').allow('', null).optional(),
  tags: Joi.array().items(Joi.string()).optional(),
  awards: Joi.array().items(Joi.object({
    name: Joi.string().required(),
    year: Joi.number().min(1900).max(new Date().getFullYear()).required()
  })).optional(),
  series: Joi.object({
    name: Joi.string().required(),
    number: Joi.number().min(1).optional()
  }).optional(),
  originalPrice: Joi.number().min(0).optional(),
  discount: Joi.number().min(0).max(100).default(0),
  availability: Joi.string().valid('In Stock', 'Out of Stock', 'Pre-order', 'Coming Soon').default('In Stock'),
  featured: Joi.boolean().default(false),
  bestseller: Joi.boolean().default(false),
  pages: Joi.number().min(1).optional()
});

export const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  title: Joi.string().max(100).required(),
  body: Joi.string().max(1000).required()
});

export const orderSchema = Joi.object({
  items: Joi.array().items(Joi.object({
    bookId: Joi.string().required(),
    quantity: Joi.number().min(1).required()
  })).min(1).required(),
  paymentMethod: Joi.string().valid('credit_card', 'debit_card', 'upi', 'net_banking', 'cod').required(),
  shippingAddress: Joi.object({
    street: Joi.string().required(),
    city: Joi.string().required(),
    state: Joi.string().required(),
    zipCode: Joi.string().required(),
    country: Joi.string().required()
  }).required()
});

export const validate = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { 
      allowUnknown: true,
      stripUnknown: true,
      convert: true
    });
    if (error) {
      return res.status(400).json({
        message: 'Validation error',
        details: error.details.map(detail => detail.message)
      });
    }
    req.body = value;
    next();
  };
};