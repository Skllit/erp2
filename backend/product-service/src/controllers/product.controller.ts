import { Request, Response } from 'express';
import ProductService from '../services/product.service';

export class ProductController {
  createProduct = async (req: Request, res: Response) => {
    try {
      console.log('Creating product with data:', req.body);
      const product = await ProductService.createProduct(req.body);
      console.log('Product created successfully:', product);
      res.status(201).json(product);
    } catch (error: any) {
      console.error('Error creating product:', error);
      res.status(error.status || 500).json({
        message: error.message || 'Error creating product',
        details: error.details || error.stack
      });
    }
  };

  getProducts = async (req: Request, res: Response) => {
    try {
      console.log('Fetching products with query:', req.query);
      const products = await ProductService.getAllProducts();
      console.log('Products fetched successfully:', products.length);
      res.json(products);
    } catch (error: any) {
      console.error('Error fetching products:', error);
      res.status(error.status || 500).json({
        message: error.message || 'Error fetching products',
        details: error.details || error.stack
      });
    }
  };

  getProductById = async (req: Request, res: Response) => {
    try {
      console.log('Fetching product by ID:', req.params.id);
      const product = await ProductService.getProductById(req.params.id);
      if (!product) {
        return res.status(404).json({ message: 'Product not found' });
         }
      console.log('Product fetched successfully:', product);
      res.json(product);
    } catch (error: any) {
      console.error('Error fetching product:', error);
      res.status(error.status || 500).json({
        message: error.message || 'Error fetching product',
        details: error.details || error.stack
      });
    }
  };

  getProductsByCompanyId = async (req: Request, res: Response) => {
    try {
      console.log('Fetching products for company:', req.params.companyId);
      const products = await ProductService.getProductsByCompanyId(req.params.companyId);
      console.log('Products fetched successfully:', products.length);
      res.json(products);
    } catch (error: any) {
      console.error('Error fetching company products:', error);
      res.status(error.status || 500).json({
        message: error.message || 'Error fetching company products',
        details: error.details || error.stack
      });
    }
  };
}
