import { Button } from "@/components/ui/button";
import { QuestionType, Option, Question } from "./manage-quiz";


export default function QuizQuestion({
    questions,
    expandedIndex,
    setExpandedIndex,
    updateQuestion,
    updateOption,
    removeOption,
    addOption,
    addQuestion,
  }: {
    questions: Question[];
    expandedIndex: number | null;
    setExpandedIndex: (index: number) => void;
    updateQuestion: (index: number, updated: Partial<Question>) => void;
    updateOption: (
      qIndex: number,
      oIndex: number,
      updated: Partial<Option>
    ) => void;
    removeOption: (qIndex: number, oIndex: number) => void;
    addOption: (qIndex: number) => void;
    addQuestion: () => void;
  }) {
    return (
      <div className="flex flex-col gap-6">
        {questions.map((q, qIndex) => (
          <div key={q.id} className="border border-gray-300 rounded mb-2">
            <div
              className="flex items-center justify-between p-4 cursor-pointer"
              onClick={() => setExpandedIndex(qIndex)}
            >
              <span className="font-medium">
                {q.question || `Question ${qIndex + 1}`}
              </span>
              <span>{expandedIndex === qIndex ? "▲" : "▼"}</span>
            </div>
            {expandedIndex === qIndex && (
              <div className="p-4 border-t space-y-3">
                <label className="font-medium">Question</label>
                <input
                  className="w-full border px-2 py-1 rounded"
                  type="text"
                  placeholder="Enter your question"
                  value={q.question}
                  onChange={(e) =>
                    updateQuestion(qIndex, { question: e.target.value })
                  }
                />
  
                <label className="font-medium">Type</label>
                <select
                  className="w-full border px-2 py-1 rounded"
                  value={q.type}
                  onChange={(e) =>
                    updateQuestion(qIndex, {
                      type: e.target.value as QuestionType,
                      options: [],
                    })
                  }
                >
                  <option value="SINGLE_SELECT">Single Select</option>
                  <option value="MULTI_SELECT">Multi Select</option>
                  <option value="DESCRIPTIVE">Description</option>
                </select>
  
                {q.type !== "DESCRIPTIVE" && (
                  <div className="space-y-2">
                    {q.options.map((opt, oIndex) => (
                      <div key={opt.id} className="flex gap-2 items-center">
                        <input
                          className="flex-1 border px-2 py-1 rounded"
                          type="text"
                          placeholder="Option value"
                          value={opt.value}
                          onChange={(e) =>
                            updateOption(qIndex, oIndex, {
                              value: e.target.value,
                            })
                          }
                        />
                        {q.type === "SINGLE_SELECT" ? (
                          <input
                            type="radio"
                            name={`single-select-${q.id}`}
                            checked={opt.isCorrect}
                            onChange={() => {
                              const updatedOptions = q.options.map(
                                (option, idx) => ({
                                  ...option,
                                  isCorrect: idx === oIndex,
                                })
                              );
                              updateQuestion(qIndex, { options: updatedOptions });
                            }}
                          />
                        ) : (
                          <input
                            type="checkbox"
                            checked={opt.isCorrect}
                            onChange={(e) =>
                              updateOption(qIndex, oIndex, {
                                isCorrect: e.target.checked,
                              })
                            }
                          />
                        )}
                        <span>Correct</span>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeOption(qIndex, oIndex)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      onClick={() => addOption(qIndex)}
                      className="mt-2"
                    >
                      + Add Option
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
  
        {/* <div>
                <label className="font-semibold block mb-2">JSON Preview:</label>
                <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                  {JSON.stringify({ questions }, null, 2)}
                </pre>
              </div> */}
        <Button onClick={addQuestion}>+ Add Question</Button>
      </div>
    );
  }