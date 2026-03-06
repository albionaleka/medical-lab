import TestCategory from "../models/TestCategory.js";

class TestCategoryService {
  static async createCategory(name, description, price) {
    const existingCategory = await TestCategory.findOne({ where: { name } });
    if (existingCategory) {
      throw new Error("Test category with this name already exists");
    }
    const category = await TestCategory.create({ name, description, price });
    return category;
  }

  static async getAllCategories() {
    return await TestCategory.findAll();
  }

  static async getCategoryById(id) {
    return await TestCategory.findByPk(id);
  }

  static async updateCategory(id, updates) {
    const category = await TestCategory.findByPk(id);
    if (!category) {
      throw new Error("Category not found");
    }
    await category.update(updates);
    return category;
  }

  static async deleteCategory(id) {
    const category = await TestCategory.findByPk(id, {
      include: { association: "panels" },
    });
    if (!category) {
      throw new Error("Category not found");
    }

    await category.destroy();
    return true;
  }
}

export { TestCategoryService };
