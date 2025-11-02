import csv from 'csv-parser';
import fs from 'fs';
import Book from '../models/Book.js';
import Category from '../models/Category.js';

export const bulkImportBooks = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const errors = [];

    const stream = fs.createReadStream(req.file.path)
      .pipe(csv({ headers: true, skipEmptyLines: true }))
      .on('data', (data) => {
        // Only add rows with required fields
        if (data.title && data.title.trim() && data.authors && data.description) {
          results.push(data);
        }
      })
      .on('end', async () => {
        let imported = 0;

        for (let i = 0; i < results.length; i++) {
          const row = results[i];
          try {
            // Validate required fields
            const authors = row.authors.split(',').map(a => a.trim()).filter(a => a);
            if (authors.length === 0) {
              throw new Error('At least one author is required');
            }
            
            const price = parseFloat(row.price);
            if (isNaN(price) || price < 0) {
              throw new Error('Valid price is required');
            }
            
            const stock = parseInt(row.stock);
            if (isNaN(stock) || stock < 0) {
              throw new Error('Valid stock quantity is required');
            }
            
            // Validate category against database
            let categories = [];
            if (row.categories?.trim()) {
              const categoryName = row.categories.trim();
              const categoryExists = await Category.findOne({ name: categoryName });
              if (categoryExists) {
                categories = [categoryName];
              } else {
                throw new Error(`Category '${categoryName}' does not exist. Please create it first.`);
              }
            } else {
              throw new Error('Category is required');
            }
            
            const bookData = {
              title: row.title.trim(),
              authors: authors,
              description: row.description.trim(),
              price: price,
              stock: stock,
              categories: categories,
              currency: 'INR',
              format: row.format?.trim() || 'Paperback',
              language: row.language?.trim() || 'English',
              availability: 'In Stock'
            };

            // Optional fields
            if (row.publisher?.trim()) bookData.publisher = row.publisher.trim();
            if (row.pages && !isNaN(parseInt(row.pages))) bookData.pages = parseInt(row.pages);
            if (row.isbn?.trim()) bookData.isbn = row.isbn.trim();
            if (row.featured === 'true') bookData.featured = true;
            if (row.bestseller === 'true') bookData.bestseller = true;

            await Book.create(bookData);
            imported++;
          } catch (error) {
            errors.push(`Row ${i + 1}: ${error.message}`);
          }
        }

        // Clean up uploaded file
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('File cleanup error:', cleanupError);
        }

        res.json({
          imported,
          total: results.length,
          errors: errors.length > 0 ? errors.slice(0, 10) : null,
          message: `Successfully imported ${imported} out of ${results.length} books`
        });
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        res.status(400).json({ message: 'CSV parsing failed', error: error.message });
      });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};

export const bulkImportCategories = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const errors = [];

    fs.createReadStream(req.file.path)
      .pipe(csv({ headers: true, skipEmptyLines: true }))
      .on('data', (data) => {
        // Only add non-empty rows
        if (data.name && data.name.trim()) {
          results.push(data);
        }
      })
      .on('end', async () => {
        let imported = 0;

        for (let i = 0; i < results.length; i++) {
          const row = results[i];
          try {
            const categoryData = {
              name: row.name.trim(),
              description: row.description?.trim() || ''
            };

            await Category.create(categoryData);
            imported++;
          } catch (error) {
            if (error.code === 11000) {
              errors.push(`Category "${row.name}" already exists`);
            } else {
              errors.push(`Row ${i + 1}: ${error.message}`);
            }
          }
        }

        // Clean up uploaded file
        try {
          fs.unlinkSync(req.file.path);
        } catch (cleanupError) {
          console.error('File cleanup error:', cleanupError);
        }

        res.json({
          imported,
          total: results.length,
          errors: errors.length > 0 ? errors.slice(0, 10) : null,
          message: `Successfully imported ${imported} out of ${results.length} categories`
        });
      })
      .on('error', (error) => {
        console.error('CSV parsing error:', error);
        res.status(400).json({ message: 'CSV parsing failed', error: error.message });
      });
  } catch (error) {
    console.error('Import error:', error);
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};

export const downloadTemplate = (req, res) => {
  const { type } = req.params;
  
  let csvContent = '';
  let filename = '';

  if (type === 'books') {
    csvContent = 'title,authors,description,price,stock,categories,publisher,language,format,pages,isbn,featured,bestseller\n';
    csvContent += 'Sample Book Title,Author Name,Book description here,999,50,Fiction,Publisher Name,English,Paperback,300,9781234567890,false,false\n';
    csvContent += 'Another Book,Author Two,Another book description,599,25,Non-Fiction,Another Publisher,English,Hardcover,250,,true,false\n';
    filename = 'books_template.csv';
  } else if (type === 'categories') {
    csvContent = 'name,description\n';
    csvContent += 'Indian Literature,Books by Indian authors and about Indian culture\n';
    csvContent += 'Mythology,Books about Hindu mythology and ancient stories\n';
    filename = 'categories_template.csv';
  } else {
    return res.status(400).json({ message: 'Invalid template type' });
  }

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.send(csvContent);
};

export const bulkImportBooksJSON = async (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    let imported = 0;
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const bookData = data[i];
      try {
        if (!bookData.title || !bookData.authors || !bookData.description || !bookData.price || !bookData.stock || !bookData.categories) {
          throw new Error('Missing required fields');
        }

        // Validate category exists
        if (bookData.categories?.length > 0) {
          const categoryExists = await Category.findOne({ name: bookData.categories[0] });
          if (!categoryExists) {
            throw new Error(`Category '${bookData.categories[0]}' does not exist`);
          }
        }

        await Book.create(bookData);
        imported++;
      } catch (error) {
        errors.push(`Item ${i + 1}: ${error.message}`);
      }
    }

    res.json({
      imported,
      total: data.length,
      errors: errors.length > 0 ? errors.slice(0, 10) : null,
      message: `Successfully imported ${imported} out of ${data.length} books`
    });
  } catch (error) {
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};

export const bulkImportCategoriesJSON = async (req, res) => {
  try {
    const { data } = req.body;
    if (!Array.isArray(data)) {
      return res.status(400).json({ message: 'Data must be an array' });
    }

    let imported = 0;
    const errors = [];

    for (let i = 0; i < data.length; i++) {
      const categoryData = data[i];
      try {
        if (!categoryData.name) {
          throw new Error('Name is required');
        }

        await Category.create(categoryData);
        imported++;
      } catch (error) {
        if (error.code === 11000) {
          errors.push(`Category "${categoryData.name}" already exists`);
        } else {
          errors.push(`Item ${i + 1}: ${error.message}`);
        }
      }
    }

    res.json({
      imported,
      total: data.length,
      errors: errors.length > 0 ? errors.slice(0, 10) : null,
      message: `Successfully imported ${imported} out of ${data.length} categories`
    });
  } catch (error) {
    res.status(500).json({ message: 'Import failed', error: error.message });
  }
};