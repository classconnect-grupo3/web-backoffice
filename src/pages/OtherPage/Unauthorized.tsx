export default function Unauthorized() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
        <div className="bg-white shadow rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">🚫</div>
          <h1 className="text-2xl font-semibold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-6">
            You do not have permission to view this page.
          </p>
          <a
            href="/signin"
            className="inline-block bg-primary text-white px-5 py-2 rounded hover:bg-opacity-90 transition"
          >
            Return to Sign In
          </a>
        </div>
      </div>
    );
  }
  