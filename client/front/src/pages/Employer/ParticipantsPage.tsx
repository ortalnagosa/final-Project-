import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

interface IApplicant {
  name?: { first?: string; last?: string };
  user_id: string;
  email?: string;
  phone?: string;
  status: "pending" | "contacted";
  _id: string;
  submittedAt: string;
  image?: { url?: string; alt?: string };
  resume?: string;
}



export default function ParticipantsPage() {
  const { jobId } = useParams<{ jobId: string }>();
  const [participants, setParticipants] = useState<IApplicant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!jobId) return;

    const fetchParticipants = async () => {
      try {
        const token = localStorage.getItem("token");
        const { data } = await axios.get(
          `http://localhost:8181/api/jobs/${jobId}/participants`,
          { headers: { "x-auth-token": token || "" } },
        );

        
        setParticipants(data.applicants || []);
      } catch (err) {
        console.error("Failed to fetch participants", err);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [jobId]);

const handleDeleteApplicant = async (applicantId: string) => {
  if (!window.confirm("את/ה בטוח/ה שברצונך למחוק את המועמד?")) return;

  try {
    const token = localStorage.getItem("token");
    await axios.delete(
      `http://localhost:8181/api/jobs/${jobId}/applicants/${applicantId}`,
      { headers: { "x-auth-token": token || "" } },
    );

    // עדכון ה-state אחרי מחיקה
    setParticipants((prev) => prev.filter((app) => app._id !== applicantId));
    toast.success("המועמד נמחק בהצלחה!");
  } catch (err) {
    console.error("Failed to delete applicant", err);
    toast.error("שגיאה במחיקת המועמד");
  }
};


  if (loading) return <p>טוען מועמדים...</p>;

  return (
    <div className="p-6 dark:text-white bg-gray-100 dark:bg-gray-800 min-h-screen">
      <h2 className="mb-4 text-2xl font-bold">מועמדים למשרה</h2>

      {participants.length === 0 && <p>אין מועמדים למשרה זו</p>}

      {participants.map((p) => {

        return (
          <div key={p._id} className="mb-4 rounded border p-4">
            <div className="mb-2 flex items-center gap-4">
              {p.image?.url && (
                <img
                  src={p.image.url}
                  alt={p.image.alt || "User"}
                  className="h-12 w-12 rounded-full object-cover"
                />
              )}
              <h3 className="text-lg font-bold">
                {p.name?.first} {p.name?.last}
              </h3>
            </div>

            <p>אימייל: {p.email || "-"}</p>
            <p>טלפון: {p.phone || "-"}</p>
            <p className="text-sm text-gray-500">
              סטטוס: {p.status || "pendin"} | נרשם ב-
              {new Date(p.submittedAt).toLocaleString()}
            </p>

            {p.resume && (
              <>
                <p className="mt-1">
                  קובץ קיים:
                  <a
                    href={`http://localhost:8181/${p.resume}`}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    צפה
                  </a>
                </p>
              </>
            )}
            <div className="mt-4 flex gap-4">
            {p.status === "pending" && (
              <button
                className="mt-2 rounded bg-green-500 px-3 py-1 text-white"
                onClick={() =>
                  setParticipants((prev) =>
                    prev.map((app) =>
                      app._id === p._id ? { ...app, status: "contacted" } : app,
                    ),
                  )
                }
              >
                מסומן כבר יצר קשר
              </button>
            )}
            <button
              className="mt-2 rounded bg-red-500 px-3 py-1 text-white"
              onClick={() => handleDeleteApplicant(p._id)}
            >
              מחק מועמד
              </button>
              </div>
          </div>
        );
      })}
    </div>
  );
}
