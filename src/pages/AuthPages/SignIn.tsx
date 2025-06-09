import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiClient } from "../../lib/http";
import * as SecureStore from "expo-secure-store";


const TOKEN_KEY = 'session';
const USER_ID_KEY = 'user_id';
const USER_NAME_KEY = 'user_name';
const USER_SURNAME_KEY = 'user_surname';

interface LoginResponse {
  id_token: string;
  user_info: {
    uid: string;
    name: string;
    surname: string;
    is_admin: boolean;
    latitude?: number | null;
    longitude?: number | null;
  };
}

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
      const { data } = await apiClient.post<LoginResponse>("/login/email", { email, password });
      const token = data.id_token;
      const user_info = data.user_info;
      const user = {
        id: user_info.uid,
        name: user_info.name,
        surname: user_info.surname,
      }
      console.log("Login data: ", data);
  
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(USER_ID_KEY, user.id);
      await SecureStore.setItemAsync(USER_NAME_KEY, user.name);
      await SecureStore.setItemAsync(USER_SURNAME_KEY, user.surname);
      apiClient.defaults.headers.common['Authorization'] = "Bearer ${token}";


      console.log("API response:", data);
      
      const { is_admin } = user_info;

      // Save token and user info (adjust as per your app context/state management)
        localStorage.setItem("id_token", token);
        localStorage.setItem("is_admin", is_admin.toString());

      if (!is_admin) {
        navigate("/unauthorized");
        return;
      }
      // Redirect to the dashboard or home of backoffice
      navigate("/");

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
