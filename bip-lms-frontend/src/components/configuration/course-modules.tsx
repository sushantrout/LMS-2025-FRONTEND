"use client";

import { useEffect, useState, useCallback } from "react";
import { ChevronDown, ChevronRight, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Module } from "@/types/model/module-model";
import { moduleService } from "@/http/module-service";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { Session } from "@/types/model/session-model";
import ManageSessionModal from "./section/manage-session";
import { sessionService } from "@/http/session-service";
import { showSuccessToast } from "@/util/helpers/toast-helper";

interface CourseModulesProps {
  courseId: string;
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  getModulesByCourseId: () => Promise<void>;
  setSelectedModule: React.Dispatch<React.SetStateAction<Module | null>>;
  setIsModuleModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function CourseModules({
  courseId,
  modules,
  setModules,
  getModulesByCourseId,
  setSelectedModule,
  setIsModuleModalOpen,
}: CourseModulesProps) {
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [moduleToDelete, setModuleToDelete] = useState<Module | null>(null);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
  const [isSessionDeleteModalOpen, setIsSessionDeleteModalOpen] = useState(false);
  const [sessionToDelete, setSessionToDelete] = useState<Session | null>(null);
  const [moduleIdToExpand, setModuleIdToExpand] = useState<string | null>(null);

  const getModulesWithExpansionPersistence = async () => {
    const expandedStateMap: Record<string, boolean> = {};
    modules.forEach((mod) => {
      expandedStateMap[mod.id] = !!mod.expanded;
    });

    await getModulesByCourseId();

    // Restore expansion
    setModules((prevModules) =>
      prevModules.map((mod) => ({
        ...mod,
        expanded: expandedStateMap[mod.id] || false,
      }))
    );
  };

  useEffect(() => {
    getModulesWithExpansionPersistence();
  }, [courseId]);

  const toggleModule = useCallback(
    (id: string) => {
      setModules((prevModules) =>
        prevModules.map((module) =>
          module.id === id ? { ...module, expanded: !module.expanded } : module
        )
      );
    },
    [setModules]
  );

  const handleDeleteSession = async () => {
    console.log("Modules=======>"+modules)
    console.log("session to be deleted "+sessionToDelete);
    if (sessionToDelete) {
      try {
        await sessionService.deleteSession(sessionToDelete.id);
        const moduleId = sessionToDelete.moduleId;

        await getModulesByCourseId();

        // Re-expand the module
        setModules((prevModules) =>
          prevModules.map((mod) =>
            mod.id === moduleId ? { ...mod, expanded: true } : mod
          )
        );

        setIsSessionDeleteModalOpen(false);
        setSessionToDelete(null);
        showSuccessToast("Session deleted successfully");
      } catch (error) {
        console.error("Error deleting session:", error);
      }
    }
  };

  const handleDeleteModule = async () => {
    if (moduleToDelete) {
      try {
        await moduleService.deleteModule(moduleToDelete.id);
        await getModulesWithExpansionPersistence();
        setIsDeleteModalOpen(false);
        showSuccessToast("Module deleted successfully");
      } catch (error) {
        console.error("Error deleting module:", error);
      }
    }
  };

  const handleEdit = (session: Session) => {
    setSelectedSession(session);
    setModuleIdToExpand(session.moduleId);
    setIsSessionModalOpen(true);
  };

  const handleCloseSessionModal = async () => {
    setSelectedSession(null);
    setIsSessionModalOpen(false);

    await getModulesByCourseId();

    if (moduleIdToExpand) {
      setModules((prevModules) =>
        prevModules.map((mod) =>
          mod.id === moduleIdToExpand ? { ...mod, expanded: true } : mod
        )
      );
      setModuleIdToExpand(null);
    }
  };

  const handleDelete = (session: Session) => {
    console.log("Session to delet ====="+session.id)
    setSessionToDelete(session);
    setIsSessionDeleteModalOpen(true);
  };

  const handleAddNote = (session: Session) => {
    console.log("Add note to session:", session);
  };

  const renderModuleActions = (module: Module) => (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" className="text-xs h-8">
        Sort Lessons
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8 flex items-center gap-1"
        onClick={() => {
          setSelectedModule(module);
          setIsModuleModalOpen(true);
        }}
      >
        <Edit className="h-3 w-3" />
        Edit Module
      </Button>
      <Button
        variant="outline"
        size="sm"
        className="text-xs h-8 text-red-500 flex items-center gap-1"
        onClick={() => {
          setModuleToDelete(module);
          setIsDeleteModalOpen(true);
        }}
      >
        <Trash2 className="h-3 w-3" />
        Delete Module
      </Button>
    </div>
  );

  return (
    <>
      <div className="grid grid-cols-1">
        <div className="md:col-span-2 space-y-4">
          {modules.map((module) => (
            <Card key={module.id} className="p-4">
              <div className="flex items-start">
                <button
                  onClick={() => toggleModule(module.id)}
                  className="mr-2 mt-1"
                >
                  {module.expanded ? (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-gray-500" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="text-md font-medium">{module.name}</h3>
                    {renderModuleActions(module)}
                  </div>

                  {module.expanded && (
                    <>
                      {module.sessions?.length > 0 ? (
                        <div className="mt-6 space-y-4">
                          {module.sessions
                            .map((session) => (
                              <div
                                key={session.id}
                                className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-tr from-white via-slate-50 to-white px-5 py-4 shadow transition-all duration-200 hover:shadow-md"
                              >
                                <div>
                                  <div className="text-lg font-semibold text-gray-800 group-hover:text-indigo-600 flex items-center gap-2">
                                    <svg
                                      className="w-5 h-5 text-indigo-400 group-hover:text-indigo-600 transition-colors"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={1.5}
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M12 8v4l3 3" />
                                      <path d="M12 2a10 10 0 1 1-7.07 2.93A10 10 0 0 1 12 2z" />
                                    </svg>
                                    {session.name}
                                  </div>
                                  {session.mode && (
                                    <div className="mt-1 inline-block rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-indigo-600">
                                      Mode: {session.mode}
                                    </div>
                                  )}
                                </div>

                                <div className="flex gap-2 items-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs flex items-center gap-1"
                                    onClick={() => handleEdit(session)}
                                  >
                                    <Edit className="h-4 w-4" />
                                    Edit Session
                                  </Button>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs text-red-500 flex items-center gap-1"
                                    onClick={() => handleDelete(session)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    Delete Session
                                  </Button>

                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 text-xs text-amber-600 flex items-center gap-1"
                                    onClick={() => handleAddNote(session)}
                                  >
                                    <svg
                                      className="w-4 h-4"
                                      fill="none"
                                      stroke="currentColor"
                                      strokeWidth={1.5}
                                      viewBox="0 0 24 24"
                                    >
                                      <path d="M15 3H5a2 2 0 0 0-2 2v14l4-4h8a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2z" />
                                    </svg>
                                    Add Note
                                  </Button>
                                </div>
                              </div>
                            ))}
                        </div>
                      ) : (
                        <div className="mt-6 flex items-center justify-center text-sm text-gray-500">
                          <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 text-gray-600">
                            <svg
                              className="w-4 h-4 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={1.5}
                              viewBox="0 0 24 24"
                            >
                              <path d="M12 2a10 10 0 1 1 0 20 10 10 0 0 1 0-20z" />
                              <path d="M12 8v4l3 3" />
                            </svg>
                            No sessions available
                          </div>
                        </div>
                      )}
                    </>

                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDeleteModule}
        title="Are you sure?"
        description="This action cannot be undone. The module will be permanently deleted."
      />
      <DeleteConfirmationModal
        isOpen={isSessionDeleteModalOpen}
        onClose={() => setIsSessionDeleteModalOpen(false)}
        onDelete={handleDeleteSession}
        title="Delete this session?"
        description="This action cannot be undone. The session will be permanently deleted."
      />

      <ManageSessionModal
        selectedSession={selectedSession}
        isSessionModalOpen={isSessionModalOpen}
        setIsSessionModalOpen={handleCloseSessionModal}
        setSelectedSession={setSelectedSession}
        modules={modules}
      />
    </>
  );
}
