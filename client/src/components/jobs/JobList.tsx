import React, { useEffect, useState, useCallback } from 'react';
import { JobCard } from './JobCard';
import { useBase } from '../../hooks/useBase';
import { Button } from '../shared/Button';

interface Job {
  id: string;
  title: string;
  client: string;
  description: string;
  requiredSkills: Array<{ name: string; level: string }>;
  estimatedPay: string;
  deadline: string;
  matchScore?: number;
}

interface MatchedJob {
  job: Job;
  score: number;
}

export const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { agent, walletAddress } = useBase();

  const fetchAndMatchJobs = useCallback(async () => {
    try {
      setLoading(true);
      // This would be replaced with actual API call to fetch jobs
      const availableJobs = await fetch('/api/jobs').then(res => res.json());

      // Get worker profile from your backend
      const workerProfile = await fetch(`/api/workers/${walletAddress}`).then(res => res.json());

      // Use Base AI Agent to match jobs
      const matchedJobs = await agent.matchJobs(workerProfile, availableJobs);

      // Transform the matched jobs to include match scores
      const processedJobs = (matchedJobs.data as MatchedJob[]).map(match => ({
        ...match.job,
        matchScore: Math.round(match.score * 100),
      }));

      setJobs(processedJobs);
    } catch (err) {
      setError('Failed to load jobs. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [agent, walletAddress]);

  useEffect(() => {
    if (walletAddress) {
      fetchAndMatchJobs();
    }
  }, [walletAddress, fetchAndMatchJobs]);

  const handleApply = async (jobId: string) => {
    try {
      // Implementation for job application
      await fetch('/api/jobs/apply', {
        method: 'POST',
        body: JSON.stringify({ jobId, workerAddress: walletAddress }),
      });
      // Show success message or update UI
    } catch (err) {
      setError('Failed to apply for job. Please try again.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="w-8 h-8 border-t-2 border-b-2 border-blue-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <Button onClick={fetchAndMatchJobs} variant="primary">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {jobs.map(job => (
        <JobCard key={job.id} {...job} onApply={() => handleApply(job.id)} />
      ))}
      {jobs.length === 0 && (
        <div className="text-center py-8 text-gray-600">No jobs found matching your profile.</div>
      )}
    </div>
  );
};
