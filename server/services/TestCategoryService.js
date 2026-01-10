import TestCategory from "../models/TestCategory.js";

class TestCategoryService {
  static async createCategory(name, description) {
    const existingCategory = await TestCategory.findOne({ where: { name } });
    if (existingCategory) {
      throw new Error("Test category with this name already exists");
    }
    const category = await TestCategory.create({ name, description });
    return category;
  }

  static async getAllCategories() {
    return await TestCategory.findAll();
  }

  static async getCategoryById(id) {
    return await TestCategory.findByPk(id);
  }
}

export { TestCategoryService };
