-- Fix duplicate /uploads/uploads/ in questionSet imageUrl
UPDATE questionpapers
SET questionSet = REPLACE(questionSet, '"/uploads/uploads/', '"/uploads/')
WHERE questionSet LIKE '%/uploads/uploads/%';
