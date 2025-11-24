-- Create theme_preferences table
CREATE TABLE IF NOT EXISTS theme_preferences (
  id INT PRIMARY KEY AUTO_INCREMENT,
  userId VARCHAR(20) UNIQUE NOT NULL,
  colors JSON NOT NULL DEFAULT ('{"primary":"#0ea5e9","secondary":"#d946ef","success":"#10b981","warning":"#f59e0b","error":"#ef4444","info":"#3b82f6","background":"#ffffff","surface":"#f9fafb","text":"#111827","border":"#e5e7eb","sidebar":"#1e293b","header":"#ffffff"}'),
  typography JSON NOT NULL DEFAULT ('{"fontFamily":"Inter","fontSize":"medium","fontWeight":"normal"}'),
  layout JSON NOT NULL DEFAULT ('{"borderRadius":"medium","spacing":"medium","shadows":"medium"}'),
  mode ENUM('light', 'dark', 'system') DEFAULT 'system',
  createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add index for faster lookups
CREATE INDEX idx_theme_userId ON theme_preferences(userId);
