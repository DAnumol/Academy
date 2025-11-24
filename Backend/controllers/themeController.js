const db = require('../models')
const ThemePreference = db.ThemePreference

const successResponse = (res, data, message = 'Success') => {
  return res.status(200).json({ success: true, message, data })
}

const errorResponse = (res, message = 'Error', statusCode = 500) => {
  return res.status(statusCode).json({ success: false, message })
}

exports.getThemePreference = async (req, res) => {
  try {
    const userId = req.user.userId
    let theme = await ThemePreference.findOne({ where: { userId } })
    
    if (!theme) {
      theme = await ThemePreference.create({ userId })
    }
    
    return successResponse(res, theme, 'Theme preference retrieved successfully')
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

exports.updateThemePreference = async (req, res) => {
  try {
    const userId = req.user.userId
    const { colors, typography, layout, mode } = req.body
    
    let theme = await ThemePreference.findOne({ where: { userId } })
    
    if (!theme) {
      theme = await ThemePreference.create({
        userId,
        colors,
        typography,
        layout,
        mode
      })
    } else {
      await theme.update({
        colors: colors || theme.colors,
        typography: typography || theme.typography,
        layout: layout || theme.layout,
        mode: mode || theme.mode
      })
    }
    
    return successResponse(res, theme, 'Theme preference updated successfully')
  } catch (error) {
    return errorResponse(res, error.message)
  }
}

exports.resetThemePreference = async (req, res) => {
  try {
    const userId = req.user.userId
    
    await ThemePreference.destroy({ where: { userId } })
    const theme = await ThemePreference.create({ userId })
    
    return successResponse(res, theme, 'Theme preference reset successfully')
  } catch (error) {
    return errorResponse(res, error.message)
  }
}
