export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Professional Resume Builder
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create stunning resumes with our easy-to-use builder powered by modern technology
          </p>
          <div className="bg-white rounded-lg shadow-lg p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
              Get Started
            </h2>
            <p className="text-gray-600 mb-6">
              This is a Next.js application with TypeScript, Tailwind CSS, and shadcn/ui components.
              Ready for development!
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800">Next.js 14</h3>
                <p className="text-blue-600">App Router & Server Components</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="font-semibold text-green-800">TypeScript</h3>
                <p className="text-green-600">Type-safe development</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800">Tailwind CSS</h3>
                <p className="text-purple-600">Utility-first styling</p>
              </div>
            </div>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            Created with Comet Assistant
          </div>
        </div>
      </div>
    </main>
  )
}
