import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { CheckCircle, AlertCircle } from "lucide-react";
import { apiClient } from "../../lib/http";
import Input from "../../components/form/input/InputField";

export default function BlockUser() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleBlock = async () => {
    setSuccess(false);
    setError("");

    try {
      const response = await apiClient.post("/users/block", { email });

      if (response.status === 201) {
        setSuccess(true);
        setEmail("");
      } else {
        setError("Could not block user. Please try again.");
      }
    } catch (err: any) {
      console.error(err);

      if (err?.response?.status === 400) {
        setError("This user is already blocked.");
      } else if (err?.response?.status === 404) {
        setError("User not found.");
      } else {
        setError(
          err?.response?.data?.message ||
            "An error occurred. Please check the email and try again."
        );
      }
    }
  };

  return (
    <div>
      <PageMeta title="Block a user" description="" />
      <PageBreadcrumb pageTitle="Block a user" />

      <div className="max-w-xl mx-auto mt-10 space-y-6">
        <div>
          <label className="block text-lg font-medium mb-2">User Email</label>
          <Input
            type="email"
            placeholder="user@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <Button onClick={handleBlock} className="w-full">
          Block User
        </Button>

        {success && (
          <div className="flex items-center gap-2 text-green-600 font-medium mt-4">
            <CheckCircle className="h-5 w-5" />
            User successfully blocked.
          </div>
        )}

        {error && (
          <div className="flex items-center gap-2 text-red-600 font-medium mt-4">
            <AlertCircle className="h-5 w-5" />
            {error}
          </div>
        )}
      </div>
    </div>
  );
}
