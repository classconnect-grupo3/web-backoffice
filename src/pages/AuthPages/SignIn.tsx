import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../lib/http";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await apiClient.post("/login/email", {
        email,
        password,
      });

      console.log("API response:", response);
      
      // Check if response is 200 Ok and check is_admin field. 
      if (response.status === 200) {
        const { id_token, is_admin } = response.data as {
          id_token: string;
          is_admin: boolean;
          user_location: string;
        };

      // Save token and user info (adjust as per your app context/state management)
        localStorage.setItem("id_token", id_token);
        localStorage.setItem("is_admin", is_admin.toString());

        if (!is_admin) {
          navigate("/unauthorized");
          return;
        }

      // Redirect to the dashboard or home of backoffice
      navigate("/");

      } else {
        setError("Invalid credentials.");
      }

    } catch (err: any) {
      console.error("Login error:", err);
    
      if (err.response) {
        console.error("Response data:", err.response.data);
        console.error("Response status:", err.response.status);
        setError(`Server error: ${err.response.status}`);
      } else if (err.request) {
        console.error("No response received:", err.request);
        setError("No response from server.");
      } else {
        console.error("Error during setup:", err.message);
        setError("Unexpected error occurred.");
      }
    }
     finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h1 className="text-xl font-bold mb-6">Sign In to Backoffice</h1>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-1" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label className="block mb-1" htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border px-3 py-2 rounded"
            placeholder="Your password"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  );
}
