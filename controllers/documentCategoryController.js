const DocumentCategory = require('../models/DocumentCategory');

// CREATE Document Category
exports.createDocumentCategory = async (req, res) => {
    try {
        const { name, is_active } = req.body;
        const newCategory = new DocumentCategory({ name, is_active });
        const result = await newCategory.save();
        res.status(201).json(result);
    } catch (error) {
        res.status(500).json({ message: 'Failed to add document category', error });
    }
};

// READ All Document Categories
exports.getAllCategories = async (req, res) => {
    try {
        const categories = await DocumentCategory.find();
        res.status(200).json(categories);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// READ One Document Category by ID (ID from req.body)
exports.getCategoryById = async (req, res) => {
    try {
        const { id } = req.body;
        const category = await DocumentCategory.findById(id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// UPDATE Document Category by ID (ID from req.body)
exports.updateDocumentCategory = async (req, res) => {
    try {
        const { id, name, is_active } = req.body;
        const updatedCategory = await DocumentCategory.findByIdAndUpdate(
            id,
            { name, is_active },
            { new: true }
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(updatedCategory);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update document category', error });
    }
};

// DELETE Document Category by ID (ID from req.body)
exports.deleteDocumentCategory = async (req, res) => {
    try {
        const { id } = req.body;
        const deletedCategory = await DocumentCategory.findByIdAndDelete(id);
        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json({ message: 'Category deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete document category', error });
    }
};
