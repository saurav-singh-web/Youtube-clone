import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../services/api";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await api.post("/auth/login", formData);

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      navigate("/");
    } catch (loginError) {
      setError(loginError.response?.data?.message || "Login failed. Please try again.");
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
        <h1 className="mb-2 text-3xl font-normal leading-tight text-gray-900">Sign in</h1>
        <p className="m-0 text-gray-600 leading-relaxed">Use your account to continue to the home page.</p>

        <form className="grid gap-4 mt-7" onSubmit={handleSubmit}>
          <label className="grid gap-2 text-gray-800 font-semibold">
            Email
            <input className="w-full h-11 px-3 border border-gray-300 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" type="email" name="email" value={formData.email} onChange={handleChange} />
          </label>

          <label className="grid gap-2 text-gray-800 font-semibold">
            Password
            <input className="w-full h-11 px-3 border border-gray-300 rounded-md outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600" type="password" name="password" value={formData.password} onChange={handleChange} />
          </label>

          {error && <p className="text-red-600 text-sm">{error}</p>}

          <button className="min-h-[44px] px-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-md disabled:bg-blue-300 disabled:cursor-not-allowed" type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <p className="mt-6">
          New to YouTube Clone? <Link className="text-blue-600 font-bold hover:underline" to="/register">Create an account</Link>
        </p>
      </section>
    </main>
  );
}

export default LoginPage;

