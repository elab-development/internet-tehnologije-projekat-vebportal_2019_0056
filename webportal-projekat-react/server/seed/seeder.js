import dotenv from 'dotenv';
import users from './users.js';
import categories from './categories.js';
import posts from './posts.js';
import User from '../models/User.model.js';
import Category from '../models/Category.model.js';
import Comment from '../models/Comment.model.js';
import Post from '../models/Post.model.js';
import connectToMongoDB from '../utils/dbConnect.js';

dotenv.config();
connectToMongoDB();

const importData = async () => {
  try {
    await Comment.deleteMany();
    await Post.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();

    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const editorUser = createdUsers[1]._id;

    const createdCategories = await Category.insertMany(categories);
    const javaScriptCat = createdCategories[0]._id;
    const dataEngCat = createdCategories[1]._id;
    const machLearnCat = createdCategories[2]._id;
    const typeScriptCat = createdCategories[3]._id;
    const pythonCat = createdCategories[4]._id;
    const htmlCat = createdCategories[5]._id;
    const devCat = createdCategories[6]._id;

    const samplePosts = posts.map((post) => {
      if (post.category === 'JavaScript') {
        post.category = javaScriptCat;
      } else if (post.category === 'Data Engineering') {
        post.category = dataEngCat;
      } else if (post.category === 'Machine Learning') {
        post.category = machLearnCat;
      } else if (post.category === 'TypeScript') {
        post.category = typeScriptCat;
      } else if (post.category === 'Python') {
        post.category = pythonCat;
      } else if (post.category === 'HTML') {
        post.category = htmlCat;
      } else {
        post.category = devCat;
      }

      if (post.author === 'admin') {
        post.author = adminUser;
      } else {
        post.author = editorUser;
      }

      return { ...post, author: adminUser };
    });

    await Post.insertMany(samplePosts);

    console.log('Data Imported!');
    process.exit();
  } catch (error) {
    console.error(
      'Something went wrong while seeding the database: ' + error.message
    );
    products.exit(1);
  }
};

importData();