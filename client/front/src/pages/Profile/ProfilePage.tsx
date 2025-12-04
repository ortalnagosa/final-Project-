import {  useDispatch, useSelector } from "react-redux";
import { Card, Avatar, Button } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { TRootState } from "../../store/store";
import defaultProfile from "../../img/profile.jpg";
import GlobalSpinner from "../../components/GlobalSpinner";
import bgAbout from "../../img/singup-bg.jpg"
import EditProfileModal from "./EditProfileModal";
import { useState } from "react";
import { userActions } from "../../store/userSlice";
import { EditProfileData } from "../../types/editProfileUser";
import axios from "axios";
import { toast } from "react-toastify";


const Profile = () => {
  const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
    const dispatch = useDispatch();

  const handleOpenModal = () => setShowEditModal(true);
  const handleCloseModal = () => setShowEditModal(false);
  const user = useSelector((state: TRootState) => state.userSlice.user);

if (!user) return <GlobalSpinner />;

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
  
  const handleRequestEmployer = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:8181/api/users/request-employer",
        {},
        { headers: { "x-auth-token": token || "" } },
      );
      toast.success(res.data.data.message);

      // עדכון state של המשתמש ב־Redux כדי שהכפתור ייעלם
      dispatch(userActions.setUser({ ...user, pendingEmployerRequest: true }));
    } catch (err: any) {
      toast.error(err.response?.data?.message || "משהו השתבש");
    }
  };
 
  return (
    <div
      className="flex flex-col items-center justify-center bg-cover bg-center p-20"
      style={{ backgroundImage: `url(${bgAbout})` }}
    >
      <Card className="w-full max-w-3xl bg-white/60 p-6 shadow-lg backdrop-blur-sm  dark:bg-gray-500/60">
        <div className="flex flex-col items-center md:flex-row md:items-start md:gap-8 ">
          <Avatar
            img={user.image?.url || defaultProfile}
            rounded
            size="2xl"
            className="size-96 h-72 w-72 object-cover"
            alt={user.image?.alt || "User avatar"}
          />
          <div className="mt-4 flex-1 md:mt-0">
            <h1 className="mb-2 text-3xl font-bold text-sky-500">
              {user.name.first} {user.name?.middle} {user.name?.last}
            </h1>
            <p className="mb-1 grid grid-cols-[max-content_1fr] gap-2 text-gray-700 dark:text-white">
              <strong>אימייל:</strong> {user.email}
            </p>
            <p className="mb-1 grid grid-cols-[max-content_1fr] gap-2 text-gray-700 dark:text-white">
              <strong>טלפון:</strong> {user.phone}
            </p>
            <p className="mb-1 grid grid-cols-[max-content_1fr] gap-2 text-gray-700 dark:text-white">
              <strong>עיר:</strong> {user.city}
            </p>
            <p className="mb-1 grid grid-cols-[max-content_1fr] gap-2 text-gray-700 dark:text-white">
              <strong>תאריך לידה:</strong> {user.birthDate}
            </p>
            <p className="mb-1 grid grid-cols-[max-content_1fr] gap-2 text-gray-700 dark:text-white">
              <strong>יחידה צבאית:</strong>
              {user.armyUnit || "-"}
            </p>
            <p className="mb-1 grid grid-cols-[max-content_1fr] gap-2 text-gray-700 dark:text-white">
              <strong>תאריך שחרור:</strong> {user.releaseDate || "-"}
            </p>
            <p className="mb-1 grid grid-cols-[max-content_1fr] gap-2 text-gray-700 dark:text-white">
              <strong>קצת עליי:</strong> {user.about || "-"}
            </p>
            <p className="mb-1 grid grid-cols-[max-content_1fr] gap-2 text-gray-700 dark:text-white">
              <strong>גיל:</strong> {user.age || 0}
            </p>
            {user.skills && user.skills.length > 0 && (
              <p className="mb-1 grid grid-cols-[max-content_1fr] gap-2 text-gray-700 dark:text-white">
                <strong>כישורים:</strong> {user.skills.join(", ")}
              </p>
            )}
            <div className="mt-6 flex gap-2  dark:text-white">
              <Button
                onClick={() => handleOpenModal()}
                className="bg-sky-400 hover:bg-sky-300  dark:text-white"
              >
                ערוך פרופיל
              </Button>
              {user.role !== "employer" && user.role !== "admin" && !user.pendingEmployerRequest && (
                <Button
                  onClick={handleRequestEmployer}
                  className="bg-green-500 hover:bg-green-400 dark:text-white"
                >
                  בקש להיות מעסיק
                </Button>
              )}

              {user.pendingEmployerRequest && (
                <p className="mt-2 text-yellow-600 dark:text-yellow-400">
                  בקשתך להפוך למעסיק ממתינה לאישור
                </p>
              )}
              <Button
                onClick={() => navigate("/")}
                color="gray"
                className=" dark:text-white"
              >
                חזרה לדף הבית
              </Button>
            </div>
          </div>
        </div>
      </Card>
      <EditProfileModal
        show={showEditModal}
        onClose={() => handleCloseModal()}
        initialData={user}
        profileId={user._id}
        onUserUpdated={handleUserUpdated}
      />
    </div>
  );
};
export default Profile;
