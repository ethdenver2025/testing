import React from 'react';
import { Card } from '../shared/Card';
import { Button } from '../shared/Button';
import { motion } from 'framer-motion';

interface Skill {
  name: string;
  level: string;
}

interface JobCardProps {
  title: string;
  client: string;
  description: string;
  requiredSkills: Skill[];
  estimatedPay: string;
  deadline: string;
  matchScore?: number;
  onApply: () => void;
}

export const JobCard: React.FC<JobCardProps> = ({
  title,
  client,
  description,
  requiredSkills,
  estimatedPay,
  deadline,
  matchScore,
  onApply,
}) => {
  return (
    <Card className="w-full max-w-2xl">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-600 mt-1">Posted by {client}</p>
        </div>
        {matchScore && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-green-100 px-3 py-1 rounded-full"
          >
            <span className="text-green-800 font-medium">{matchScore}% Match</span>
          </motion.div>
        )}
      </div>

      <p className="mt-4 text-gray-700">{description}</p>

      <div className="mt-4 flex flex-wrap gap-2">
        {requiredSkills.map((skill, index) => (
          <span key={index} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
            {skill.name} ({skill.level})
          </span>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div>
          <p className="text-lg font-semibold text-gray-900">{estimatedPay}</p>
          <p className="text-sm text-gray-600">Deadline: {deadline}</p>
        </div>
        <Button onClick={onApply} variant="primary">
          Apply Now
        </Button>
      </div>
    </Card>
  );
};
