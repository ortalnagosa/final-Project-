import { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button } from "flowbite-react";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../store/store";
import { TUser } from "../../types/user";
import { toast } from "react-toastify";
import EditProfileModal from "../Profile/EditProfileModal";
import { EditProfileData } from "../../types/editProfileUser";
import { userActions } from "../../store/userSlice";
import defaultProfile from "../../img/profile.jpg";


export default function AdminUsersPage() {
  const user = useSelector((state: TRootState) => state.userSlice.user);
  const [users, setUsers] = useState<TUser[]>([]);
  const [loading, setLoading] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
        const dispatch = useDispatch();


     const handleOpenModal = () => setShowEditModal(true);
    const handleCloseModal = () => setShowEditModal(false);
    
       const handleUserUpdated = (formData: EditProfileData) => {
         dispatch(
           userActions.setUser({
             ...user,
             ...formData,
             name: {
               first: formData.name.first,
               middle: formData.name.middle,
               last: formData.name.last,
             },
             age: formData.age,
             city: formData.city,
             phone: formData.phone,
             about: formData.about,
             skills: formData.skills,
             image: formData.image,
           }),
         );
         handleCloseModal();
       };
    
  const loadUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:8181/api/users/", {
        headers: { "x-auth-token": token || "" },
      });
        console.log(res.data.data.users);

      setUsers(res.data.data.users); // או res.data.users תלוי במבנה התשובה מהשרת
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בטעינת המשתמשים");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === "admin") loadUsers();
  }, [user]);

  if (!user || user.role !== "admin") {
    return (
      <p className="mt-10 text-center text-xl text-red-600">
        רק אדמין יכול להיכנס לניהול משתמשים
      </p>
    );
  }

  const deleteUser = async (id: string) => {
    if (!window.confirm("בטוח שברצונך למחוק את המשתמש הזה?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:8181/api/users/${id}`, {
        headers: { "x-auth-token": token || "" },
      });
      setUsers(users.filter((u) => u._id !== id));
      toast.success("המשתמש נמחק בהצלחה");
    } catch (err) {
      console.error(err);
      toast.error("שגיאה במחיקת המשתמש");
    }
  };

  const makeEmployer = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8181/api/users/approve-employer/${id}`,
        {},
        { headers: { "x-auth-token": token || "" } },
      );
      toast.success("התפקיד שונה למעסיק בהצלחה");
      setUsers(
        users.map((u) => (u._id === id ? { ...u, role: "employer" } : u)),
      );
    } catch (err) {
      console.error(err);
      toast.error("שגיאה בשינוי התפקיד");
    }
  };

  return (
    <div
      dir="rtl"
      className="min-h-screen p-6 dark:bg-gray-700 dark:text-white"
    >
      <h1 className="mb-6 text-center text-3xl font-bold">ניהול משתמשים</h1>

      {loading ? (
        <p className="text-center">טוען משתמשים...</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {users.map((u) => (
            <Card key={u._id} className="text-right">
              <div className="flex items-center gap-4">
                <img
                  src={user.image.url || defaultProfile}
                  alt={user.image.alt || "User Avatar"}
                  className="mb-2 h-32 w-full rounded object-contain"
                />
                <h3 className="text-lg font-bold">
                  {u.name.first} {u.name.last}
                </h3>
              </div>
              <p>אימייל: {u.email}</p>
              <p>תפקיד: {u.role}</p>
              <p>
                סטטוס בקשה למעסיק: {u.pendingEmployerRequest ? "ממתין" : "-"}
              </p>
              <div className="mt-3 flex gap-2">
                {u.role !== "employer" && (
                  <Button
                    color="purple"
                    size="sm"
                    onClick={() => makeEmployer(u._id)}
                  >
                    הפוך למעסיק
                  </Button>
                )}
                <Button
                  onClick={() => handleOpenModal()}
                  className="bg-sky-400 hover:bg-sky-300  dark:text-white"
                >
                  ערוך פרופיל
                </Button>
                <Button color="red" size="sm" onClick={() => deleteUser(u._id)}>
                  מחק משתמש
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      <EditProfileModal
        show={showEditModal}
        onClose={() => handleCloseModal()}
        initialData={user}
        profileId={user._id}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
}
