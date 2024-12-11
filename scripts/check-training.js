require('dotenv').config();

async function checkTrainingStatus() {
    try {
        console.log('Checking training status...');
        const url = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/v1/admin/ai/train/status';

        const response = await fetch(url);
        const data = await response.json();

        if (data.lastTraining) {
            console.log('\nLast Training:');
            console.log('Timestamp:', new Date(data.lastTraining.timestamp).toLocaleString());
            console.log('Status:', data.lastTraining.status);
            console.log('Stats:', {
                subjects: data.lastTraining.stats.subjects.length,
                posts: data.lastTraining.stats.posts.length,
                conversations: Object.values(data.lastTraining.stats.successfulResponses || {}).flat().length
            });
        }

        console.log('\nTotal Trainings:', data.totalTrainings);

        if (data.recentTrainings?.length) {
            console.log('\nRecent Trainings:');
            data.recentTrainings.forEach((training, index) => {
                console.log(`\n${index + 1}. ${new Date(training.timestamp).toLocaleString()}`);
                console.log('   Status:', training.status);
                console.log('   Data Points:', {
                    subjects: training.stats.subjects.length,
                    posts: training.stats.posts.length,
                    conversations: Object.values(training.stats.successfulResponses || {}).flat().length
                });
            });
        }

    } catch (error) {
        console.error('\n❌ Error checking training status:', error.message);
        process.exit(1);
    }
}

checkTrainingStatus(); 