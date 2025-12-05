import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface Props {
  userId: string;
  onClose: () => void;
}

export default function ChangePasswordModal({ userId, onClose }: Props) {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!oldPassword || !newPassword) {
      toast.error("יש למלא את כל השדות");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8181/api/users/${userId}/change-password`,
        { oldPassword, newPassword },
        {
          headers: { "x-auth-token": token || "" },
        },
      );

      toast.success("הסיסמה עודכנה בהצלחה!");
      onClose();
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.message || "שגיאה בעדכון סיסמה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="w-full max-w-md rounded-xl bg-white p-6 text-right shadow-xl">
        <h2 className="mb-4 text-2xl font-bold">שינוי סיסמה</h2>

        <input
          type="password"
          placeholder="סיסמה ישנה"
          className="mb-3 w-full rounded border p-2"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
        />

        <input
          type="password"
          placeholder="סיסמה חדשה"
          className="mb-3 w-full rounded border p-2"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <p className="mb-3 text-xs text-gray-500">
          הסיסמה חייבת להיות לפחות 9 תווים, כולל אות גדולה, אות קטנה, מספר ותו
          מיוחד.
        </p>

        <div className="mt-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            ביטול
          </button>

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
          >
            {loading ? "טוען..." : "עדכון סיסמה"}
          </button>
        </div>
      </div>
    </div>
  );
}
