import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function RegisterPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const validateForm = () => {
    if (formData.username.trim().length < 3) {
      return "Username must be at least 3 characters long.";
    }

    if (!formData.email.includes("@")) {
      return "Please enter a valid email address.";
    }

    if (formData.password.length < 6) {
      return "Password must be at least 6 characters long.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationError = validateForm();
    setError(validationError);

    if (validationError) {
      return;
    }

    try {
      setIsSubmitting(true);
      await api.post("/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password
      });
      navigate("/login");
    } catch (registerError) {
      setError(registerError.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-gray-50 relative">
      <Link to="/" className="absolute top-6 left-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 font-semibold text-sm sm:text-base">
        &larr; Back to home
      </Link>
      <section className="w-full max-w-[440px] p-9 border border-gray-300 rounded-xl bg-white">
        <div className="mb-7 text-red-600 text-xl font-bold">YouTube Clone</div>
        <h1 className="mb-2 text-3xl font-normal leading-tight text-gray-900">Create your account</h1>
        <p className="m-0 text-gray-600 leading-relaxed">Register first, then sign in with your email and password.</p>

        <form className="grid gap-4 mt-7" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-gray-800 font-semibold">
            Username
            <input className="w-full h-11 px-3 border border-gray-300 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" type="text" name="username" value={formData.username} onChange={handleChange} />
          </label>

          <label className="grid gap-2 text-gray-800 font-semibold">
            Email
            <input className="w-full h-11 px-3 border border-gray-300 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>

          <label className="grid gap-2 text-gray-800 font-semibold">
            Password
            <input className="w-full h-11 px-3 border border-gray-300 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>

          <label className="grid gap-2 text-gray-800 font-semibold">
            Confirm Password
            <input className="w-full h-11 px-3 border border-gray-300 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} />
          </label>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button className="min-h-[44px] px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating account..." : "Create account"}
          </button>
        </form>

        <p className="mt-6">
          Already have an account? <Link className="text-blue-600 font-bold hover:underline" to="/login">Sign in</Link>
        </p>
      </section>
    </main>
  );
}

export default RegisterPage;

