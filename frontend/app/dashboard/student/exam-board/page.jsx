"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import {
  useGetExamBoardQuery,
  useUpdateBoardMutation,
} from "@/feature/student/StudentApi";
import { useState } from "react";
import toast from "react-hot-toast";

export default function ExamBoard() {
  const [subjects, setSubjects] = useState([
    { id: 1, name: "Science", board: "" },
    { id: 2, name: "Math", board: "" },
    { id: 3, name: "English", board: "" },
  ]);

  const [savingId, setSavingId] = useState(null);
  const { data: examBoard, isLoading } = useGetExamBoardQuery();
  const [updateBoard, { isLoading: updateLoading }] = useUpdateBoardMutation();

  console.log(examBoard?.data?.boards, "Exam board is here");

  const examBoards = ["AQA", "Pearson Edexcel", "OCR", "WJEC (Eduqas)", "CCEA"];

  const handleBoardChange = (id, board) => {
    setSubjects(
      subjects.map((subject) =>
        subject.id === id ? { ...subject, board } : subject
      )
    );
  };

  const handleSaveSubject = async (subject) => {
    setSavingId(subject.id);

    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 800));

      // Prepare data for API
      const saveData = {
        subject: subject.name.toUpperCase(),
        board: subject.board,
      };

      const result = await updateBoard(saveData);
      console.log(result, "resutl is here ");

      // Here you would make your actual API call
      // await saveExamBoardAPI(saveData);

      toast.success(`${subject.name} exam board saved successfully!`);
    } catch (error) {
      console.error("Error saving exam board:", error);
      toast.error(`Failed to save ${subject.name} exam board`);
    } finally {
      setSavingId(null);
    }
  };

  const handleSaveAll = async () => {
    try {
      // Filter subjects that have board selected
      const subjectsWithBoard = subjects.filter((subject) => subject.board);

      if (subjectsWithBoard.length === 0) {
        toast.error("Please select at least one exam board");
        return;
      }

      // Prepare data for API
      const saveData = subjectsWithBoard.map((subject) => ({
        subject: subject.name.toUpperCase(),
        board: subject.board,
      }));

      console.log("Saving all subjects:", saveData);

      // Here you would make your actual API call
      // await saveAllExamBoardsAPI(saveData);

      toast.success("All exam boards saved successfully!");
    } catch (error) {
      console.error("Error saving all exam boards:", error);
      toast.error("Failed to save exam boards");
    }
  };

  const handleCancel = () => {
    setSubjects(subjects.map((subject) => ({ ...subject, board: "" })));
    toast.success("All selections cleared");
  };

  const getSubjectColor = (subjectName) => {
    switch (subjectName) {
      case "Science":
        return {
          bg: "bg-green-100",
          text: "text-green-700",
          border: "border-green-200",
        };
      case "Math":
        return {
          bg: "bg-red-100",
          text: "text-red-700",
          border: "border-red-200",
        };
      case "English":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-700",
          border: "border-yellow-200",
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-700",
          border: "border-gray-200",
        };
    }
  };

  return (
    <div className='min-h-screen'>
      <TitleSection
        className='bg-[#F7FFF5]'
        bg={"#F7FFF5"}
        title={"Exam Board"}
      />
      <div className='max-w-6xl p-8'>
        <h1 className='text-3xl font-bold mb-8'>Exam schedule</h1>

        <div className='bg-white rounded-lg shadow-sm overflow-hidden'>
          <table className='w-full'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='text-left p-4 font-medium text-gray-500'>
                  Subject
                </th>
                <th className='text-left p-4 font-medium text-gray-500'>
                  Select Exam Board
                </th>
                <th className='text-left p-4 font-medium text-gray-500'>
                  Action
                </th>
              </tr>
            </thead>
            <tbody>
              {subjects.map((subject) => {
                const colors = getSubjectColor(subject.name);
                return (
                  <tr
                    key={subject.id}
                    className='border-b border-gray-100 hover:bg-gray-50'>
                    <td className='p-4'>
                      <div className='flex items-center'>
                        <span
                          className={`inline-block px-3 py-1 rounded text-sm font-medium ${colors.bg} ${colors.text} border ${colors.border}`}>
                          {subject.name}
                        </span>
                      </div>
                    </td>
                    <td className='p-4'>
                      <div className='relative'>
                        <select
                          value={subject.board}
                          onChange={(e) =>
                            handleBoardChange(subject.id, e.target.value)
                          }
                          className='w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent'>
                          <option value=''>Select your board</option>
                          {examBoards.map((board) => (
                            <option key={board} value={board}>
                              {board}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>
                    <td className='p-4'>
                      <button
                        onClick={() => handleSaveSubject(subject)}
                        disabled={!subject.board || savingId === subject.id}
                        className={`px-4 py-2 rounded-md transition-colors text-sm font-medium ${
                          !subject.board
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : savingId === subject.id
                            ? "bg-purple-400 text-white cursor-wait"
                            : "bg-purple-500 text-white hover:bg-purple-600"
                        }`}>
                        {savingId === subject.id ? (
                          <span className='flex items-center gap-2'>
                            <svg
                              className='animate-spin h-4 w-4 text-white'
                              xmlns='http://www.w3.org/2000/svg'
                              fill='none'
                              viewBox='0 0 24 24'>
                              <circle
                                className='opacity-25'
                                cx='12'
                                cy='12'
                                r='10'
                                stroke='currentColor'
                                strokeWidth='4'></circle>
                              <path
                                className='opacity-75'
                                fill='currentColor'
                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                            </svg>
                            Saving...
                          </span>
                        ) : (
                          "Save"
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Action Buttons */}
        <div className='flex justify-end gap-4 mt-6'>
          <button
            onClick={handleCancel}
            className='px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium'>
            Clear All
          </button>
        </div>
      </div>
    </div>
  );
}
