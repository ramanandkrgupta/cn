"use client";
import { useState } from 'react';
import { toast } from 'sonner';

export default function AITraining() {
  const [isTraining, setIsTraining] = useState(false);

  const startTraining = async () => {
    try {
      setIsTraining(true);
      const response = await fetch('/api/v1/admin/ai/train', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Admin-Token': process.env.NEXT_PUBLIC_ADMIN_API_KEY
        }
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error);

      toast.success('AI Training completed successfully');
      console.log('Training stats:', data.stats);
    } catch (error) {
      toast.error('Training failed: ' + error.message);
    } finally {
      setIsTraining(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">AI Training Dashboard</h1>
      <button 
        onClick={startTraining}
        disabled={isTraining}
        className="btn btn-primary"
      >
        {isTraining ? 'Training...' : 'Start Training'}
      </button>
    </div>
  );
} 