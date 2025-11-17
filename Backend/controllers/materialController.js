const { Material, Subject } = require('../models');
const generateIds = require('../utils/generateId');
const { sendSuccess, sendError } = require('../utils/response');

const uploadMaterial = async (req, res) => {
  try {
    const { subjectId, title, description } = req.body;

    if (!req.file) {
      return sendError(res, 400, 'File is required');
    }

    const material = await Material.create({
      materialId: generateIds.material(),
      subjectId, title, description,
      fileUrl: req.file.path,
      uploadedBy: req.user.role === 'staff' ? req.user.staffProfile?.staffId : req.user.userId
    });

    sendSuccess(res, 'Material uploaded successfully', material, 201);
  } catch (error) {
    sendError(res, 500, 'Failed to upload material', error);
  }
};

const getAllMaterials = async (req, res) => {
  try {
    const { page = 1, limit = 10, subjectId } = req.query;
    const where = {};
    if (subjectId) where.subjectId = subjectId;

    const materials = await Material.findAndCountAll({
      where,
      include: [{ model: Subject, as: 'subject', attributes: ['name'] }],
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      order: [['createdAt', 'DESC']]
    });

    sendSuccess(res, 'Materials retrieved successfully', {
      items: materials.rows,
      totalCount: materials.count,
      currentPage: parseInt(page),
      totalPages: Math.ceil(materials.count / parseInt(limit))
    });
  } catch (error) {
    sendError(res, 500, 'Failed to get materials', error);
  }
};

const getMaterialById = async (req, res) => {
  try {
    const material = await Material.findByPk(req.params.id, {
      include: [{ model: Subject, as: 'subject' }]
    });

    if (!material) return sendError(res, 404, 'Material not found');
    sendSuccess(res, 'Material retrieved successfully', material);
  } catch (error) {
    sendError(res, 500, 'Failed to get material', error);
  }
};

const updateMaterial = async (req, res) => {
  try {
    const updateData = req.body;
    if (req.file) updateData.fileUrl = req.file.path;

    const [updatedRowsCount] = await Material.update(updateData, {
      where: { materialId: req.params.id }
    });

    if (updatedRowsCount === 0) return sendError(res, 404, 'Material not found');

    const updatedMaterial = await Material.findByPk(req.params.id);
    sendSuccess(res, 'Material updated successfully', updatedMaterial);
  } catch (error) {
    sendError(res, 500, 'Failed to update material', error);
  }
};

const deleteMaterial = async (req, res) => {
  try {
    const deletedRowsCount = await Material.destroy({
      where: { materialId: req.params.id }
    });

    if (deletedRowsCount === 0) return sendError(res, 404, 'Material not found');
    sendSuccess(res, 'Material deleted successfully');
  } catch (error) {
    sendError(res, 500, 'Failed to delete material', error);
  }
};

module.exports = { uploadMaterial, getAllMaterials, getMaterialById, updateMaterial, deleteMaterial };