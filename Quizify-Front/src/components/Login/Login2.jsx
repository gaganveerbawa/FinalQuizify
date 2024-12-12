import { useState } from "react";
import { login } from "../../api/auth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
// import "./login.css";

function Login2() {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleRegister = () => {
    navigate('/register'); // Navigate to the register page
  };

  const { email, password } = userData;
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSubmitL = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please fill all the fields");
      return;
    }
    
    setLoading(true);

    try {
      const response = await login({ email, password });
      console.log(response);
      if (response.status === 200) {
        toast.success("Logged in successfully");
        setUserData({ email: "", password: "" });
        localStorage.setItem("token", response.data.token);
        setLoading(false);
        navigate("/dashboard");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to login. Please check your credentials");
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="h-screen flex justify-center items-center bg-gray-200">
        {/* <div className="absolute inset-0 bg-[url('/images/bg-img.jpeg')] bg-cover bg-center opacity-30"></div> */}
        <div className="bg-white p-10 rounded-xl drop-shadow-xl">
          <h1 className="text-5xl text-center font-semibold p-5 text-indigo-700">
            QUIZIFY
          </h1>
          <h1 className="text-2xl text-center font-semibold p-5 text-indigo-700">
            Welcome to our website
          </h1>
          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmitL}>
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autocomplete="email"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium leading-6 text-gray-900"
                  >
                    Password
                  </label>
                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autocomplete="current-password"
                    required
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    value={password}
                    placeholder="Enter your password"
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  disabled={loading}
                >
                  Login
                </button>
                {/* <br /> */}
                <button className="flex w-full justify-center pt-8 hover:text-blue-700 transition " onClick={handleRegister}>
                    Don't have an account? Register
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login2;
