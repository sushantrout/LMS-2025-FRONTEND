import { Module } from "@/types/model/module-model";

export default function QuizModuleDropdown({
  selectedModule,
  setSelectedModule,
  modules,
  setSelectedSession,
}: {
  selectedModule : Module
  setSelectedModule : (module : Module) => void
  modules : Module[]
  setSelectedSession : (session : any) => void
}) {
  return (
    <select
      className="w-full border px-2 py-1 rounded mb-4"
      value={selectedModule?.id || ""}
      onChange={(e) => {
        const mod = modules.find((m) => m.id === e.target.value);
        setSelectedModule(mod || null);
        setSelectedSession(null);
      }}
    >
      <option value="">Select Module</option>
      {modules.map((mod) => (
        <option key={mod.id} value={mod.id}>
          {mod.name}
        </option>
      ))}
    </select>
  );
}
