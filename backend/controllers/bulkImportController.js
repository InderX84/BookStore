import csv from 'csv-parser';
import fs from 'fs';
import Book from '../models/Book.js';
import Category from '../models/Category.js';

const VALID_CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Mystery', 'Romance', 'Sci-Fi', 'Fantasy',
  'Biography', 'History', 'Science', 'Technology', 'Business', 'Self-Help',
  'Children', 'Young Adult', 'Poetry', 'Drama', 'Punjabi Literature',
  'Indian Poetry', 'Partition Literature'
];

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
            
            // Validate category
            let categories = ['Fiction']; // default
            if (row.categories?.trim()) {
              const categoryName = row.categories.trim();
              if (VALID_CATEGORIES.includes(categoryName)) {
                categories = [categoryName];
              } else {
                throw new Error(`Invalid category: ${categoryName}. Valid categories are: ${VALID_CATEGORIES.join(', ')}`);
              }
            }
            
            const bookData = {
              title: row.title.trim(),
              authors: authors,
              description: row.description.trim(),
              price: price,
              stock: stock,
              categories: categories,
              currency: 'INR',
              availability: row.availability?.trim() || 'In Stock',
              format: row.format?.trim() || 'Paperback',
              language: row.language?.trim() || 'English'
            };

            // Optional fields
            if (row.publisher?.trim()) bookData.publisher = row.publisher.trim();
            if (row.pages && !isNaN(parseInt(row.pages))) bookData.pages = parseInt(row.pages);
            if (row.isbn?.trim()) bookData.isbn = row.isbn.trim();
            if (row.isbn13?.trim()) bookData.isbn13 = row.isbn13.trim();
            if (row.edition?.trim()) bookData.edition = row.edition.trim();
            if (row.publishedDate?.trim()) bookData.publishedDate = new Date(row.publishedDate.trim());
            if (row.ageGroup?.trim()) bookData.ageGroup = row.ageGroup.trim();
            if (row.tags?.trim()) bookData.tags = row.tags.split(',').map(t => t.trim()).filter(t => t);
            if (row.discount && !isNaN(parseFloat(row.discount))) bookData.discount = parseFloat(row.discount);
            if (row.originalPrice && !isNaN(parseFloat(row.originalPrice))) bookData.originalPrice = parseFloat(row.originalPrice);
            if (row.featured === 'true' || row.featured === '1') bookData.featured = true;
            if (row.bestseller === 'true' || row.bestseller === '1') bookData.bestseller = true;

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
    csvContent = 'title,authors,description,price,stock,categories,publisher,pages,language,format,isbn,isbn13,edition,publishedDate,ageGroup,tags,discount,originalPrice,availability,featured,bestseller\n';
    csvContent += 'The Great Indian Novel,Shashi Tharoor,A satirical novel about Indian politics and society,899,25,Fiction,Penguin Books,432,English,Paperback,9780140107586,9780140107586,1st,1989-01-01,Adult (18+),"classic,indian-literature",10,999,In Stock,true,false\n';
    csvContent += 'Wings of Fire,A.P.J. Abdul Kalam,Autobiography of India\'s former President,599,40,Biography,Universities Press,196,English,Paperback,9788173711466,9788173711466,1st,1999-01-01,Adult (18+),"autobiography,inspiration",0,599,In Stock,false,true\n';
    csvContent += 'Pinjar,Amrita Pritam,A heart-wrenching partition story,450,25,Punjabi Literature,Navyug Publishers,156,English,Paperback,,,1st,1950-01-01,Adult (18+),"partition,punjabi",0,450,In Stock,true,false\n';
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