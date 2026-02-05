import React, { useState } from 'react';
import { Task, Option, AnswerResult } from '../types';
import { submitAnswer, getSessionToken } from '../services/api';

interface TaskCardProps {
  task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null);
  const [answerResult, setAnswerResult] = useState<AnswerResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleOptionClick = async (optionId: number) => {
    if (isSubmitting) return;

    setSelectedOptionId(optionId);
    setIsSubmitting(true);

    try {
      const token = await getSessionToken();
      const result = await submitAnswer(task.id, optionId, token);
      setAnswerResult(result);
    } catch (error) {
      console.error('Error submitting answer:', error);
      setAnswerResult({
        isCorrect: false,
        message: 'Error submitting answer. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getOptionClasses = (option: Option) => {
    const baseClasses =
      'px-6 py-4 rounded-lg border-2 transition-all duration-200 cursor-pointer text-left';
    
    if (selectedOptionId === option.id) {
      if (answerResult) {
        return `${baseClasses} ${
          answerResult.isCorrect && option.isCorrect
            ? 'bg-primary-light border-primary shadow-lg scale-105'
            : 'bg-red-50 border-red-300 shadow-lg scale-105'
        }`;
      }
      return `${baseClasses} bg-primary-light border-primary shadow-md hover:shadow-lg`;
    }

    if (answerResult && option.isCorrect) {
      return `${baseClasses} bg-primary-light border-primary shadow-md`;
    }

    return `${baseClasses} bg-white border-gray-200 hover:border-primary hover:shadow-md`;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">
        {task.instruction}
      </h2>

      <div className="space-y-3">
        {task.options.map((option) => (
          <div
            key={option.id}
            onClick={() => handleOptionClick(option.id)}
            className={getOptionClasses(option)}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-700">{option.text}</span>
              {selectedOptionId === option.id && answerResult && (
                <span
                  className={`ml-4 text-2xl transition-transform duration-200 ${
                    answerResult.isCorrect && option.isCorrect
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {answerResult.isCorrect && option.isCorrect ? '✓' : '✗'}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {answerResult && (
        <div
          className={`mt-4 p-4 rounded-lg transition-all duration-300 animate-fade-in ${
            answerResult.isCorrect
              ? 'bg-green-50 border-2 border-green-200'
              : 'bg-red-50 border-2 border-red-200'
          }`}
        >
          <p
            className={`font-medium ${
              answerResult.isCorrect ? 'text-green-800' : 'text-red-800'
            }`}
          >
            {answerResult.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
