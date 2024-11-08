"use client";

import { useState } from 'react';

export default function QuizPage() {
  const [interest, setInterest] = useState('');
  const [semester, setSemester] = useState('');
  const [questions, setQuestions] = useState([]);
  const [userAnswers, setUserAnswers] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleGenerateQuiz = async () => {
    const res = await fetch(`/api/quiz/generate?interest=${interest}&semester=${semester}`);
    const data = await res.json();
    setQuestions(data.questions || []);
    setUserAnswers(new Array(data.questions.length).fill(''));
    setShowResults(false);
    setScore(0);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let newScore = 0;
    questions.forEach((question, index) => {
      if (question.correct_answer === userAnswers[index]) {
        newScore++;
      }
    });
    setScore(newScore);
    setShowResults(true);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Start a Quiz</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label htmlFor="interest" className="block mb-2">Select Interest</label>
          <select
            id="interest"
            value={interest}
            onChange={(e) => setInterest(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Choose an interest</option>
            <option value="Web Development">Web Development</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Machine Learning">Machine Learning</option>
          </select>
        </div>
        <div>
          <label htmlFor="semester" className="block mb-2">Select Semester</label>
          <select
            id="semester"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
            className="border rounded p-2 w-full"
          >
            <option value="">Choose a semester</option>
            <option value="1">Semester 1</option>
            <option value="2">Semester 2</option>
            <option value="3">Semester 3</option>
          </select>
        </div>
      </div>
      <button onClick={handleGenerateQuiz} className="bg-blue-500 text-white rounded p-2 mb-6">
        Generate Quiz
      </button>

      {questions.length > 0 && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold">Your Quiz</h2>
          {questions.map((questionObj, index) => (
            <div key={index} className="border rounded p-4">
              <h3 className="font-bold">Question {index + 1}</h3>
              <p className="mb-4">{questionObj.question}</p>
              {questionObj.options.map((option, i) => (
                <div key={i} className="flex items-center space-x-2 mb-2">
                  <input
                    type="radio"
                    id={`q${index}-option${i}`}
                    name={`question${index}`}
                    value={option}
                    checked={userAnswers[index] === option}
                    onChange={() => handleAnswerChange(index, option)}
                    className="mr-2"
                  />
                  <label htmlFor={`q${index}-option${i}`}>{option}</label>
                </div>
              ))}
              {showResults && (
                <div>
                  {userAnswers[index] === questionObj.correct_answer ? (
                    <p className="text-green-600">Correct!</p>
                  ) : (
                    <p className="text-red-600">
                      Incorrect. The correct answer is: {questionObj.correct_answer}
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
          {!showResults && (
            <button onClick={handleSubmit} className="bg-blue-500 text-white rounded p-2 mt-6">
              Submit Quiz
            </button>
          )}
          {showResults && (
            <div className="border rounded p-4">
              <h3 className="font-bold">Quiz Results</h3>
              <p className="text-xl">Your score: {score} out of {questions.length}</p>
              <p className="text-lg">Percentage: {((score / questions.length) * 100).toFixed(2)}%</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}