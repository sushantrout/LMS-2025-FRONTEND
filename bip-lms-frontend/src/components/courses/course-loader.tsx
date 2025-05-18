export default function CourseLoader() {
    return (
        <div className="flex items-center justify-center h-screen bg-gray-50">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-t-indigo-600 border-indigo-200 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading your course...</p>
          </div>
        </div>
      );
}
