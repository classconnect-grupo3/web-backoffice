import type React from "react"

const TestPage: React.FC = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Test Page</h1>
      <p>This is a simple test page to check if basic pages work.</p>
      <div className="mt-4 p-4 bg-gray-100 rounded">
        <p>If you can see this, the basic page structure works.</p>
      </div>
    </div>
  )
}

export default TestPage
