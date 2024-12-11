require('dotenv').config();

async function trainAI() {
  try {
    console.log('Starting AI training...');
    console.log('Connecting to:', process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');

    const url = (process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000') + '/api/v1/admin/ai/train';

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ timestamp: new Date().toISOString() })
    });

    // Check if response is JSON
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Expected JSON response but got: ' + contentType);
    }

    const data = await response.json();
    console.log('Response status:', response.status);
    console.log('Response data:', data);

    if (response.ok) {
      if (data.success) {
        console.log('\n✅ Training completed successfully!');
        console.log('\nTraining Stats:', data.stats);
      } else {
        console.log('\n⚠️ Training response:', data);
      }
    } else {
      throw new Error(data.error || 'Training failed');
    }
  } catch (error) {
    console.error('\n❌ Training Error:', error.message);
    process.exit(1);
  }
}

console.log('Environment check:', {
  NODE_ENV: process.env.NODE_ENV,
  APP_URL: process.env.NEXT_PUBLIC_APP_URL,
});

trainAI();