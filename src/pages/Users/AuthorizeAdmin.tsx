import { useState } from "react";
import PageMeta from "../../components/common/PageMeta";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import Button from "../../components/ui/button/Button";
import { CheckCircle, AlertCircle } from "lucide-react";
import apiClient from "../../lib/http";
import Input from "../../components/form/input/InputField";

export default function AuthorizeAdmin() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleAuthorize = async () => {
    setSuccess(false);
    setError("");

    try {
      const response = await apiClient.post("/users/admin", { email });

      if (response.status === 201) {
        setSuccess(true);
        setEmail("");
      } else {
        setError("Authorization failed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      setError(
        err?.response?.data?.message ||
          "An error occurred. Please check the email and try again."
      );
    }
  };

  return (
    <div>
      <PageMeta title="Authorize a new administrator" description={""} />
      <PageBreadcrumb pageTitle="Authorize a new administrator" />

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

        <Button onClick={handleAuthorize} className="w-full">
          Authorize User
        </Button>

        {success && (
          <div className="flex items-center gap-2 text-green-600 font-medium mt-4">
            <CheckCircle className="h-5 w-5" />
            Authorization successful
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
