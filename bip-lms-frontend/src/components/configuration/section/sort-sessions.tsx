import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Button } from "@/components/ui/button";
import { Module } from "@/types/model/module-model";
import { Session } from "@/types/model/session-model";

export default function SortSessions({
  sortModuleId,
  setSortModuleId,
  sortModule,
  sortedSessions,
  handleDragEnd,
  handleSave,
  isSavingSort,
}: {
  sortModuleId: string | null;
  setSortModuleId: (id: string | null) => void;
  sortModule: Module | null;
  sortedSessions: Session[];
  handleDragEnd: (event: any) => void;
  handleSave: () => void;
  isSavingSort: boolean;
}) {
  return (
    <Dialog open={!!sortModuleId} onOpenChange={() => setSortModuleId(null)}>
      <DialogContent className="sm:max-w-[1200px] max-h-[100vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Drag and Drop to Sort Sessions</DialogTitle>
        </DialogHeader>
        {sortModule && (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={sortedSessions.map((s) => s.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="mt-6 space-y-2">
                {sortedSessions.map((session, idx) => (
                  <SortableSession
                    key={session.id}
                    session={session}
                    index={idx}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
        <DialogFooter>
          <Button
            onClick={() => setSortModuleId(null)}
            size="sm"
            variant="outline"
            disabled={isSavingSort}
          >
            Close
          </Button>
          <Button onClick={handleSave} size="sm" disabled={isSavingSort}>
            {isSavingSort ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// Sortable session item
function SortableSession({ session, index }: { session: Session; index: number }) {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
      id: session.id,
    });
    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
      zIndex: isDragging ? 50 : 1,
      opacity: isDragging ? 0.7 : 1,
      cursor: isDragging ? 'grabbing' : 'grab',
    };
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="group flex items-center justify-between rounded-xl border border-gray-200 bg-gradient-to-tr from-white via-slate-50 to-white px-5 py-4 shadow transition-all duration-200 hover:shadow-md mb-2"
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
      </div>
    );
  }
