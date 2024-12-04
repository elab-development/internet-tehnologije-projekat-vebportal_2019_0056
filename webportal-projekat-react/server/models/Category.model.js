import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    image: {
      type: String,
      default:
        'https://png.pngtree.com/png-vector/20220702/ourmid/pngtree-coding-logo-template-illustration-design-png-image_5673078.png',
    },
  },
  {
    timestamps: true,
  }
);

const Category = mongoose.model('Category', CategorySchema);
export default Category;