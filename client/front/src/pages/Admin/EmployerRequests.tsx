import { useState, useEffect } from "react";
import axios from "axios";
import { Button, Card } from "flowbite-react";
import { toast } from "react-toastify";
import defaultProfile from "../../img/profile.jpg";



export default function EmployerRequests() {
  const [requests, setRequests] = useState<any[]>([]);



  const loadRequests = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:8181/api/users/request-employer",
        {
          headers: { "x-auth-token": token || "" },
        },
      );

      // בדיקה: מה מגיע מהשרת
      console.log("Server response:", res.data);

      // התאמה למבנה הנתונים
      const users = res.data.data?.users || res.data;
      setRequests(users);
    } catch (err: any) {
      console.error(err);
      toast.error("לא הצלחנו לטעון בקשות");
    }
  };

  const handleApprove = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8181/api/users/approve-employer/${userId}`,
        {},
        { headers: { "x-auth-token": token || "" } },
      );
      toast.success("אושר!");
      // הסרה מה-state מיידית
      setRequests((prev) => prev.filter((u) => u._id !== userId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "משהו השתבש");
    }
  };

  const handleReject = async (userId: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://localhost:8181/api/users/reject-employer/${userId}`,
        {},
        { headers: { "x-auth-token": token || "" } },
      );
      toast.info("נדחה!");
      setRequests((prev) => prev.filter((u) => u._id !== userId));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "משהו השתבש");
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  if (!requests.length) return <p>אין בקשות ממתינות</p>;

  return (
    <div className="flex flex-col gap-4 p-4">
      <h1 className="text-right text-2xl font-bold">בקשות להפוך למעסיק</h1>

      {requests.map((u) => (
        <Card key={u._id} className="p-4 text-right">
          <div className="flex flex-col items-center gap-4 md:flex-row md:items-start md:gap-8">
            <div>
              <img
                src={u?.image.url || defaultProfile}
                alt={u?.image.alt || "User Avatar"}
                className="mb-2 h-32 w-full rounded object-contain"
              />
            </div>
            <div>
              <p>
                <strong>שם:</strong> {u.name.first} {u.name.last}
              </p>
              <p>
                <strong>אימייל:</strong> {u.email}
              </p>
              <p>
                <strong>טלפון:</strong> {u.phone}
              </p>
              <p>
                <strong>עיר:</strong> {u.city}
              </p>
              <p>
                <strong>סיבת הבקשה:</strong> {u.employerRequestReason}
              </p>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <Button color="success" onClick={() => handleApprove(u._id)}>
                ✔ אישור
              </Button>
              <Button color="failure" onClick={() => handleReject(u._id)}>
                ✖ דחייה
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
