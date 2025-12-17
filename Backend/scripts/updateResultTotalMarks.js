const { Result, Exam, QuestionPaper } = require('../models');

/**
 * Script to update all existing results with correct totalMarks from their question papers
 * Run this once to fix old results that have hardcoded 720 marks
 */
async function updateResultTotalMarks() {
  try {
    console.log('Starting to update result totalMarks...');
    
    // Get all results with their associated exams and question papers
    const results = await Result.findAll({
      include: [{
        model: Exam,
        as: 'exam',
        include: [{
          model: QuestionPaper,
          as: 'questionPaper',
          attributes: ['totalMarks']
        }]
      }]
    });

    console.log(`Found ${results.length} results to process`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const result of results) {
      if (!result.exam || !result.exam.questionPaper) {
        console.log(`Skipping result ${result.resultId} - no question paper found`);
        skippedCount++;
        continue;
      }

      const correctTotalMarks = result.exam.questionPaper.totalMarks;
      
      // Only update if totalMarks is different
      if (result.totalMarks !== correctTotalMarks) {
        const newPercentage = (result.obtainedMarks / correctTotalMarks) * 100;
        
        await result.update({
          totalMarks: correctTotalMarks,
          percentage: newPercentage
        });

        console.log(`Updated result ${result.resultId}: ${result.totalMarks} -> ${correctTotalMarks} marks`);
        updatedCount++;
      }
    }

    console.log('\n=== Update Complete ===');
    console.log(`Total results: ${results.length}`);
    console.log(`Updated: ${updatedCount}`);
    console.log(`Skipped: ${skippedCount}`);
    console.log(`No change needed: ${results.length - updatedCount - skippedCount}`);

  } catch (error) {
    console.error('Error updating results:', error);
  } finally {
    process.exit();
  }
}

// Run the script
updateResultTotalMarks();
