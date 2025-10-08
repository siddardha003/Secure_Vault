export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Secure Vault</h1>
        <p className="text-xl text-gray-600 mb-8">Your Password Manager</p>
        <div className="space-x-4">
          <a href="/login" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
            Login
          </a>
          <a href="/register" className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700">
            Register
          </a>
        </div>
      </div>
    </div>
  );
}
