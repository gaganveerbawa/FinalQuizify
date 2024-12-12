import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api/auth";
import toast from "react-hot-toast";
// import "./register.css";

function Register() {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const { name, email, password, confirmPassword } = userData;
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // Clear errors on input change
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    let validationErrors = {};

    if (!name) validationErrors.name = "Invalid name";
    if (!email) validationErrors.email = "Invalid email";
    if (!password) validationErrors.password = "Invalid password";
    if (!confirmPassword) validationErrors.confirmPassword = "Invalid confirm password";
    if (password !== confirmPassword) validationErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setLoading(false);
      return;
    }

    try {
      const response = await register({ name, email, password });
      if (response.status === 201) {
        toast.success("Registered successfully");
        setUserData({ name: "", email: "", password: "", confirmPassword: "" });
        setErrors({});
        setLoading(false);
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to register");
      setLoading(false);
    }
  };

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Name
          </label>
          <div className="mt-2">
            <input
              id="name"
              type="text"
              name="name"
              value={name}
              placeholder={errors.name || "Enter your name"}
              onChange={handleChange}
              autoComplete="name"
              className={
                errors.name
                  ? "error"
                  : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              }
            />
          </div>
        </div>
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            name="email"
            value={email}
            placeholder={errors.email || "Enter your email"}
            onChange={handleChange}
            autoComplete="email"
            // className={errors.email ? "error" : ""}
            className={
              errors.email
                ? "error"
                : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            }
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            name="password"
            value={password}
            placeholder={errors.password || "Enter your password"}
            onChange={handleChange}
            autoComplete="current-password"
            // className={errors.password ? "error" : ""}
            className={
              errors.password
                ? "error"
                : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            }
          />
        </div>
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium leading-6 text-gray-900"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            name="confirmPassword"
            value={confirmPassword}
            placeholder={errors.confirmPassword || "Confirm your password"}
            onChange={handleChange}
            // className={errors.confirmPassword ? "error" : ""}
            className={
              errors.confirmPassword
                ? "error"
                : "block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            }
          />
        </div>
        <button
          className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          disabled={loading}
          type="submit"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}

export default Register;
