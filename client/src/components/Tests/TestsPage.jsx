import { useState, useEffect } from "react";
import TestsService from "../../services/TestsService.js";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaChevronDown,
  FaChevronRight,
  FaVial,
  FaFileMedical,
  FaDna,
} from "react-icons/fa";
import CategoryModal from "./Modals/CategoryModal.jsx";
import PanelModal from "./Modals/PanelModal.jsx";
import ParameterModal from "./Modals/ParameterModal.jsx";
import ConfirmationModal from "../ConfirmationModal.jsx";

const TestsPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [expandedPanels, setExpandedPanels] = useState({});

  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isPanelModalOpen, setIsPanelModalOpen] = useState(false);
  const [isParameterModalOpen, setIsParameterModalOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [selectedParameter, setSelectedParameter] = useState(null);
  const [modalMode, setModalMode] = useState("create");

  const [showDeleteCategoryModal, setShowDeleteCategoryModal] = useState(false);
  const [showDeletePanelModal, setShowDeletePanelModal] = useState(false);
  const [showDeleteParameterModal, setShowDeleteParameterModal] =
    useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const data = await TestsService.getAllCategories();
      setCategories(data);
      setError(null);
    } catch (error) {
      console.error("Error fetching categories:", error);
      setError("Failed to load tests. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchPanels = async (categoryId) => {
    try {
      const panels = await TestsService.getPanels(categoryId);
      setCategories((prev) =>
        prev.map((cat) => (cat.id === categoryId ? { ...cat, panels } : cat)),
      );
    } catch (error) {
      console.error("Error fetching panels:", error);
    }
  };

  const toggleCategory = (categoryId) => {
    setExpandedCategories((prev) => {
      const isExpanding = !prev[categoryId];
      if (isExpanding) {
        fetchPanels(categoryId);
      }
      return { ...prev, [categoryId]: isExpanding };
    });
  };

  const togglePanel = (panelId) => {
    setExpandedPanels((prev) => ({ ...prev, [panelId]: !prev[panelId] }));
  };

  const handleAddCategory = () => {
    setSelectedCategory(null);
    setModalMode("create");
    setIsCategoryModalOpen(true);
  };

  const handleEditCategory = (e, category) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setModalMode("edit");
    setIsCategoryModalOpen(true);
  };

  const handleDeleteCategory = (e, id) => {
    e.stopPropagation();
    setItemToDelete(id);
    setShowDeleteCategoryModal(true);
  };

  const confirmDeleteCategory = async () => {
    try {
      await TestsService.deleteCategory(itemToDelete);
      fetchCategories();
      setShowDeleteCategoryModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  const handleAddPanel = (e, category) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setSelectedPanel(null);
    setModalMode("create");
    setIsPanelModalOpen(true);
  };

  const handleEditPanel = (e, panel, category) => {
    e.stopPropagation();
    setSelectedPanel(panel);
    setSelectedCategory(category);
    setModalMode("edit");
    setIsPanelModalOpen(true);
  };

  const handleDeletePanel = (e, id, categoryId) => {
    e.stopPropagation();
    setItemToDelete({ id, categoryId });
    setShowDeletePanelModal(true);
  };

  const confirmDeletePanel = async () => {
    try {
      await TestsService.deletePanel(itemToDelete.id);
      fetchPanels(itemToDelete.categoryId);
      setShowDeletePanelModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting panel:", error);
    }
  };

  const handleAddParameter = (e, panel) => {
    e.stopPropagation();
    setSelectedPanel(panel);
    setSelectedParameter(null);
    setModalMode("create");
    setIsParameterModalOpen(true);
  };

  const handleEditParameter = (e, parameter, panel) => {
    e.stopPropagation();
    setSelectedParameter(parameter);
    setSelectedPanel(panel);
    setModalMode("edit");
    setIsParameterModalOpen(true);
  };

  const handleDeleteParameter = (e, id, categoryId, panelId) => {
    e.stopPropagation();
    setItemToDelete({ id, categoryId, panelId });
    setShowDeleteParameterModal(true);
  };

  const confirmDeleteParameter = async () => {
    try {
      await TestsService.deleteParameter(itemToDelete.id);
      fetchPanels(itemToDelete.categoryId);
      setShowDeleteParameterModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Error deleting parameter:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <p className="text-gray-600 mt-1">
            Manage Test Categories, Panels, and Parameters
          </p>
        </div>
        <button
          onClick={handleAddCategory}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaPlus /> New Category
        </button>
      </div>

      {error && (
        <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-lg border border-red-100">
          {error}
        </div>
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Loading tests...</div>
        ) : categories.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
            <FaFileMedical className="text-4xl text-gray-300 mb-3" />
            <p className="text-lg font-medium text-gray-600">
              No categories found
            </p>
            <p className="text-sm">
              Get started by creating a new test category.
            </p>
            <button
              onClick={handleAddCategory}
              className="mt-4 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors"
            >
              Create Category
            </button>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {categories.map((category) => (
              <div key={category.id} className="group">
                <div
                  className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors"
                  onClick={() => toggleCategory(category.id)}
                >
                  <div className="flex items-center gap-3">
                    {expandedCategories[category.id] ? (
                      <FaChevronDown className="text-gray-400" />
                    ) : (
                      <FaChevronRight className="text-gray-400" />
                    )}
                    <div className="bg-blue-100 p-2 rounded-lg">
                      <FaFileMedical className="text-blue-600 text-xl" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">
                        {category.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {category.description || "No description"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={(e) => handleAddPanel(e, category)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-full text-sm flex items-center gap-1"
                      title="Add Panel"
                    >
                      <FaPlus /> Panel
                    </button>
                    <button
                      onClick={(e) => handleEditCategory(e, category)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={(e) => handleDeleteCategory(e, category.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>

                {expandedCategories[category.id] && (
                  <div className="pl-12 pr-4 py-2 bg-white">
                    {category.panels && category.panels.length > 0 ? (
                      <div className="space-y-3">
                        {category.panels.map((panel) => (
                          <div
                            key={panel.id}
                            className="border border-gray-100 rounded-lg overflow-hidden"
                          >
                            <div
                              className="flex items-center justify-between p-3 bg-gray-50/50 hover:bg-gray-50 cursor-pointer"
                              onClick={() => togglePanel(panel.id)}
                            >
                              <div className="flex items-center gap-3">
                                {expandedPanels[panel.id] ? (
                                  <FaChevronDown className="text-gray-400 text-sm" />
                                ) : (
                                  <FaChevronRight className="text-gray-400 text-sm" />
                                )}
                                <FaVial className="text-purple-500" />
                                <span className="font-medium text-gray-700">
                                  {panel.name}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={(e) => handleAddParameter(e, panel)}
                                  className="text-sm text-green-600 hover:bg-green-50 px-3 py-1.5 rounded-lg font-medium transition-colors"
                                >
                                  + Param
                                </button>
                                <button
                                  onClick={(e) =>
                                    handleEditPanel(e, panel, category)
                                  }
                                  className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                                >
                                  <FaEdit className="text-base" />
                                </button>
                                <button
                                  onClick={(e) =>
                                    handleDeletePanel(e, panel.id, category.id)
                                  }
                                  className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-2 rounded-lg transition-colors"
                                >
                                  <FaTrash className="text-base" />
                                </button>
                              </div>
                            </div>

                            {expandedPanels[panel.id] && (
                              <div className="p-4 bg-gradient-to-br from-gray-50 to-white">
                                {panel.parameters &&
                                panel.parameters.length > 0 ? (
                                  <div className="space-y-2">
                                    {panel.parameters.map((param) => (
                                      <div
                                        key={param.id}
                                        className="bg-white rounded-lg p-4 hover:shadow-md transition-shadow border border-gray-100"
                                      >
                                        <div className="flex items-center justify-between">
                                          <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                              <FaDna className="text-indigo-500" />
                                              <h4 className="font-semibold text-gray-900">
                                                {param.name}
                                              </h4>
                                            </div>
                                            <div className="flex items-center gap-4 text-sm">
                                              <div className="flex items-center gap-2">
                                                <span className="text-gray-500">
                                                  Unit:
                                                </span>
                                                <span className="font-medium text-gray-700">
                                                  {param.unit || "—"}
                                                </span>
                                              </div>
                                              {param.referenceRanges &&
                                                param.referenceRanges.length >
                                                  0 && (
                                                  <div className="flex items-center gap-2">
                                                    <span className="text-gray-500">
                                                      Reference Range:
                                                    </span>
                                                    <div className="flex gap-2">
                                                      {param.referenceRanges.map(
                                                        (range, idx) => (
                                                          <span
                                                            key={idx}
                                                            className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded-md text-xs font-medium"
                                                          >
                                                            {range.gender?.toUpperCase()}
                                                            : {range.normalMin}-
                                                            {range.normalMax}
                                                          </span>
                                                        ),
                                                      )}
                                                    </div>
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                          <div className="flex items-center gap-2 ml-4">
                                            <button
                                              onClick={(e) =>
                                                handleEditParameter(
                                                  e,
                                                  param,
                                                  panel,
                                                )
                                              }
                                              className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg text-base font-medium transition-colors"
                                            >
                                              Edit
                                            </button>
                                            <button
                                              onClick={(e) =>
                                                handleDeleteParameter(
                                                  e,
                                                  param.id,
                                                  category.id,
                                                  panel.id,
                                                )
                                              }
                                              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg text-base font-medium transition-colors"
                                            >
                                              Delete
                                            </button>
                                          </div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center text-sm text-gray-400 py-4">
                                    No parameters
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-gray-400 py-4 border border-dashed border-gray-200 rounded-lg">
                        No panels in this category.
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {isCategoryModalOpen && (
        <CategoryModal
          isOpen={isCategoryModalOpen}
          onClose={() => setIsCategoryModalOpen(false)}
          mode={modalMode}
          category={selectedCategory}
          onSuccess={fetchCategories}
        />
      )}

      {isPanelModalOpen && (
        <PanelModal
          isOpen={isPanelModalOpen}
          onClose={() => setIsPanelModalOpen(false)}
          mode={modalMode}
          panel={selectedPanel}
          categoryId={selectedCategory?.id}
          onSuccess={() => fetchPanels(selectedCategory.id)}
        />
      )}

      {isParameterModalOpen && (
        <ParameterModal
          isOpen={isParameterModalOpen}
          onClose={() => setIsParameterModalOpen(false)}
          mode={modalMode}
          parameter={selectedParameter}
          panelId={selectedPanel?.id}
          onSuccess={() => fetchPanels(selectedCategory.id)}
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteCategoryModal}
        onClose={() => {
          setShowDeleteCategoryModal(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteCategory}
        title="Delete Category"
        message="Are you sure you want to delete this category? All panels and parameters within it will also be deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <ConfirmationModal
        isOpen={showDeletePanelModal}
        onClose={() => {
          setShowDeletePanelModal(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeletePanel}
        title="Delete Panel"
        message="Are you sure you want to delete this panel? All parameters within it will also be deleted. This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />

      <ConfirmationModal
        isOpen={showDeleteParameterModal}
        onClose={() => {
          setShowDeleteParameterModal(false);
          setItemToDelete(null);
        }}
        onConfirm={confirmDeleteParameter}
        title="Delete Parameter"
        message="Are you sure you want to delete this parameter? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        confirmButtonClass="bg-red-600 hover:bg-red-700"
      />
    </div>
  );
};

export default TestsPage;
