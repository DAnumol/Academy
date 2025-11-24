# Question Image Upload Feature

## Overview
Added image upload functionality for questions in question papers. Teachers can now add images to individual questions using a plus icon, and students will see these images during exams.

## Changes Made

### Backend Changes

1. **Upload Middleware** (`Backend/middleware/upload.js`)
   - Added support for `questionImage` field names
   - Created separate folder `uploads/questionpapers/images/` for question images
   - Added image file type validation (jpeg, jpg, png, gif)

2. **Question Paper Controller** (`Backend/controllers/questionPaperController.js`)
   - Updated `transformQuestionSet()` to include `imageUrl` field
   - Modified `createQuestionPaper()` to handle multiple image uploads
   - Modified `updateQuestionPaper()` to handle image uploads during updates
   - Images are mapped to questions by index (questionImage0, questionImage1, etc.)

3. **Routes** (`Backend/routes/questionpapers.js`)
   - Changed from `upload.single()` to `upload.any()` to handle multiple files

### Frontend Changes

1. **Form Configuration** (`Frontend/src/config/formConfigs.js`)
   - Added `questionImage` field to question set array
   - Field type: `image` with optional requirement
   - Accepts image files only

2. **Generic Form Modal** (`Frontend/src/components/ui/GenericFormModal.jsx`)
   - Added support for `image` field type
   - Implemented image preview functionality
   - Added image upload within array fields (for questions)
   - Image removal functionality with X button
   - Preview shows thumbnail of uploaded image

3. **Question Paper Service** (`Frontend/src/services/questionpaperService.js`)
   - Updated `create()` and `update()` methods
   - Extracts image files from question set
   - Appends images to FormData with indexed names (questionImage0, questionImage1, etc.)
   - Removes image objects from JSON before stringifying

4. **Exam Attempt Component** (`Frontend/src/features/exam/components/ExamAttempt.jsx`)
   - Added image display in question view
   - Images shown between question text and marks
   - Responsive image sizing with max-width

5. **Question Paper Table** (`Frontend/src/features/questionpapers/components/QuestionPaperTable.jsx`)
   - Updated print functionality to include images
   - Images displayed in printed question papers

## How to Use

### For Teachers (Creating Question Papers)

1. Navigate to Question Papers section
2. Click "Add Question Paper" or edit existing one
3. Choose "Question Set" option
4. For each question:
   - Enter question text
   - Click "Add Image" button (plus icon)
   - Select image file from computer
   - Preview appears next to button
   - Click X on preview to remove image
   - Add options and correct answer
5. Submit the form

### For Students (Taking Exams)

1. Start exam from available exams
2. Questions with images will display:
   - Question number and text
   - Image (if attached)
   - Options
   - Answer selection
3. Images are visible throughout the exam
4. Images also appear in printed question papers

## Technical Details

### Image Storage
- Location: `Backend/uploads/questionpapers/images/`
- Naming: `questionImage{index}-{timestamp}-{random}.{ext}`
- Supported formats: JPEG, JPG, PNG, GIF

### Data Structure
```javascript
{
  questionSet: [
    {
      id: "q1",
      question: "Question text",
      imageUrl: "/uploads/questionpapers/images/questionImage0-123456.jpg",
      type: "mcq",
      options: ["A", "B", "C", "D"],
      correctAnswer: "A",
      marks: 4
    }
  ]
}
```

### API Request Format
- Content-Type: `multipart/form-data`
- Fields:
  - `questionSet`: JSON string
  - `questionImage0`, `questionImage1`, etc.: Image files
  - Other question paper fields

## Features

✅ Upload images for individual questions
✅ Image preview before submission
✅ Remove uploaded images
✅ Display images during exam
✅ Include images in printed question papers
✅ Support for multiple image formats
✅ Responsive image display
✅ Works with existing question paper functionality

## Notes

- Images are optional for questions
- Maximum file size: 10MB (configurable in upload middleware)
- Images are stored on server, URLs saved in database
- Existing question papers without images continue to work
- File upload and question set creation remain mutually exclusive options
