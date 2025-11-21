-- Fix qpId column size in exams table
ALTER TABLE exams MODIFY COLUMN qpId VARCHAR(200) NOT NULL;
