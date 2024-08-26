import Category from '../models/Category.model.js';
import errorHandler from '../middlewares/errorHandler.js';

export const createCategory = async (req, res, next) => {
  const { name, image } = req.body;

  const newCategory = new Category({
    name,
    image,
  });

  try {
    await newCategory.save();
    res.status(201).send({
      message: 'Category created',
      category: newCategory,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res, next) => {
  const categories = await Category.find({});

  res.status(200).json(categories);
};

export const getCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(errorHandler(404, 'Category not found'));
  }

  res.status(200).json(category);
};

export const updateCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(errorHandler(404, 'Category not found'));
  }

  try {
    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          name: req.body.name,
          image: req.body.image,
        },
      },
      { new: true }
    );

    res.status(202).json(updatedCategory);
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return next(errorHandler(404, 'Category not found'));
  }

  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json('Category has been deleted');
  } catch (error) {
    next(error);
  }
};