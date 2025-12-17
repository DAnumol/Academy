-- Create common_attendance table
CREATE TABLE IF NOT EXISTS `common_attendance` (
  `commonAttendanceId` VARCHAR(20) NOT NULL,
  `batchId` VARCHAR(20) NOT NULL,
  `date` DATE NOT NULL,
  `records` JSON NOT NULL,
  `status` VARCHAR(20) NOT NULL DEFAULT 'Active',
  `createdAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`commonAttendanceId`),
  KEY `batchId` (`batchId`),
  CONSTRAINT `common_attendance_ibfk_1` FOREIGN KEY (`batchId`) REFERENCES `batches` (`batchId`) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
