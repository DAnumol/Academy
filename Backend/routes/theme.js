const express = require('express')
const router = express.Router()
const themeController = require('../controllers/themeController')
const { authenticate } = require('../middleware/auth')

router.get('/', authenticate, themeController.getThemePreference)
router.put('/', authenticate, themeController.updateThemePreference)
router.post('/reset', authenticate, themeController.resetThemePreference)

module.exports = router
