import { Link } from "react-router-dom"

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-green-100 gap-4">
        <h1 className="text-4xl font-bold mb-4">Welcome to Medica</h1>
        <p className="text-gray-700 mb-2">Your health, our priority.</p>
        <Link to="/login">
            <button className="bg-green-500 rounded-full px-8 py-2 text-white hover:bg-green-600 hover:shadow-lg hover:cursor-pointer">Login</button>
        </Link>
    </div>
  )
}

export default Home