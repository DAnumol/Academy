const express = require('express');
const { body } = require('express-validator');
const { uploadMaterial, getAllMaterials, getMaterialById, updateMaterial, deleteMaterial } = require('../controllers/materialController');
const { authenticate, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

const materialValidation = [
  body('subjectId').notEmpty().withMessage('Subject ID is required'),
  body('title').notEmpty().withMessage('Title is required')
];

router.post('/', authenticate, authorize('staff'), upload.single('material'), materialValidation, uploadMaterial);
router.get('/', authenticate, getAllMaterials);
router.get('/:id', authenticate, getMaterialById);
router.put('/:id', authenticate, authorize('staff'), upload.single('material'), updateMaterial);
router.delete('/:id', authenticate, authorize('admin', 'staff'), deleteMaterial);

module.exports = router;