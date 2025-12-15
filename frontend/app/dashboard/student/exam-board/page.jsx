'use client';

import { useState } from 'react';
import TitleSection from "@/components/dashboard/shared/TitleSection";

export default function ExamBoard() {
  const [subjects, setSubjects] = useState([
    { id: 1, name: 'Science', board: '' },
    { id: 2, name: 'Math', board: '' },
    { id: 3, name: 'English', board: '' },
    { id: 4, name: 'Math', board: '' },
    { id: 5, name: 'English', board: '' }
  ]);

  const examBoards = [
    'AQA',
    'Pearson Edexcel',
    'OCR',
    'WJEC (Eduqas)',
    'CCEA'
  ];

  const handleBoardChange = (id, board) => {
    setSubjects(subjects.map(subject => 
      subject.id === id ? { ...subject, board } : subject
    ));
  };

  const handleSave = () => {
    console.log('Saved subjects:', subjects);
    // Add your save logic here
  };

  const handleCancel = () => {
    setSubjects(subjects.map(subject => ({ ...subject, board: '' })));
  };

  return (
    <div className="min-h-screen">
      <TitleSection className="bg-[#F7FFF5]" bg={'#F7FFF5'} title={"Exam Board"} />
      <div className="max-w-6xl  p-8">
        <h1 className="text-3xl font-bold mb-8">Exam schedule</h1>
        
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left p-4 font-medium text-gray-500">Subject</th>
                <th className="text-left p-4 font-medium text-gray-500">Select Exam Board</th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => (
                <tr key={subject.id} className=" hover:bg-gray-50">
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded text-sm font-medium ${
                      subject.name === 'Science' ? 'bg-green-100 text-green-700' :
                      subject.name === 'Math' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {subject.name}
                    </span>
                  </td>
                  <td className="p-4">
                    <select
                      value={subject.board}
                      onChange={(e) => handleBoardChange(subject.id, e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    >
                      <option value="">select your board</option>
                      {examBoards.map((board) => (
                        <option key={board} value={board}>
                          {board}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={handleCancel}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}