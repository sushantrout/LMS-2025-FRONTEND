import { Module } from "@/types/model/module-model";

export default function QuizSessionDropdown({
    selectedSession,
    selectedModule,
    setSelectedSession
} : {
    selectedSession : any
    selectedModule : Module
    setSelectedSession : (session : any) => void
}){
    return(
        <select
            className="w-full border px-2 py-1 rounded mb-4"
            value={selectedSession?.id || ""}
            onChange={(e) => {
              const sess = selectedModule.sessions.find(
                (s: any) => s.id === e.target.value
              );
              setSelectedSession(sess || null);
            }}
          >
            <option value="">Select Session</option>
            {selectedModule.sessions.map((sess: any) => (
              <option key={sess.id} value={sess.id}>
                {sess.name}
              </option>
            ))}
          </select>
    )
}