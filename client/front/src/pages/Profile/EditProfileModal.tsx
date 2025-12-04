import { Modal, Button,  Label, Textarea, TextInput } from "flowbite-react";
import { useForm } from "react-hook-form";
import { joiResolver } from "@hookform/resolvers/joi";
import axios from "axios";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { EditProfileData } from "../../types/editProfileUser";
import { updateUserSchema } from "../../validations/updateUserSchema";
import { userActions } from "../../store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { TRootState } from "../../store/store";

interface Props {
  show: boolean;
  onClose: () => void;
  initialData?: EditProfileData;
  profileId: string;
  onUserUpdated: (formData: EditProfileData) => void;
}

const EditProfileModal = ({
  show,
  onClose,
  initialData,
  profileId,
  onUserUpdated,
}: Props) => {


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<EditProfileData>({
    resolver: joiResolver(updateUserSchema),
    mode: "onChange",
  });

  const [resume, setResume] = useState<File | null>(null);
  const user = useSelector((state: TRootState) => state.userSlice.user);
    const dispatch = useDispatch();



  // נועד למלא את הטופס כשפותחים את המודל
  useEffect(() => {
    if (initialData) {
      reset({
        name: {
          first: initialData.name.first || "",
          middle: initialData.name.middle || "",
          last: initialData.name.last || "",
        },
        city: initialData.city || "",
        phone: initialData.phone || "",
        age: initialData.age || 0,
        about: initialData.about || "",
        skills: initialData.skills || [],
        image: {
          url: initialData.image?.url || "",
          alt: initialData.image?.alt || "",
        },
      });
    }
  }, [initialData, reset]);

  const handleResumeUpload = async () => {
    if (!resume) return;
    try {
      const token = localStorage.getItem("token");
      const uploadData = new FormData();
      uploadData.append("resume", resume);

      const res = await axios.post(
        `http://localhost:8181/api/users/${user?._id}/upload-resume`,
        uploadData,
        {
          headers: {
            "x-auth-token": token || "",
            "Content-Type": "multipart/form-data",
          },
        },
      );

      toast.success("קורות החיים הועלו בהצלחה!");
      // עדכון Redux
      dispatch(
        userActions.setUser({ ...user, resume: res.data.data.resumePath }),
      );
    } catch (err: any) {
      toast.error(err.response?.data?.message || "שגיאה בהעלאת קובץ");
    }
  };

  const onSubmit = async (formData: EditProfileData) => {
    try {
      const token = localStorage.getItem("token");

       await axios.put(
        `http://localhost:8181/api/users/${profileId}`,
        formData,
        {headers:{ "x-auth-token": token || ""}},
      );

      
      onUserUpdated(formData);
      onClose();
    } catch (err: any) {
      console.log(err);
      
      toast.error(err.response?.data?.message || "שגיאה בעדכון הפרופיל");
    }
  };

  return (
    <Modal show={show} size="4xl" onClose={onClose}>
      <Modal.Header>עריכת פרופיל</Modal.Header>

      <Modal.Body>
        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* שם פרטי */}
          <div>
            <Label>שם פרטי</Label>
            <TextInput {...register("name.first")} />
            {errors.name?.first && (
              <p className="text-sm text-red-500">
                {errors.name.first.message}
              </p>
            )}
          </div>

          {/* שם אמצעי */}
          <div>
            <Label>שם אמצעי</Label>
            <TextInput {...register("name.middle")} />
          </div>

          {/* שם משפחה */}
          <div>
            <Label>שם משפחה</Label>
            <TextInput {...register("name.last")} />
            {errors.name?.last && (
              <p className="text-sm text-red-500">{errors.name.last.message}</p>
            )}
          </div>

          {/* טלפון */}
          <div>
            <Label>טלפון</Label>
            <TextInput {...register("phone")} />
            {errors.phone && (
              <p className="text-sm text-red-500">{errors.phone.message}</p>
            )}
          </div>

          <div>
            <Label>גיל</Label>
            <TextInput {...register("age")} />
            {errors.age && (
              <p className="text-sm text-red-500">{errors.age.message}</p>
            )}
          </div>

          {/* עיר */}
          <div>
            <Label>עיר</Label>
            <TextInput {...register("city")} />
            {errors.city && (
              <p className="text-sm text-red-500">{errors.city.message}</p>
            )}
          </div>

          <div>
            <Label>תמונת פרופיל</Label>
            <TextInput {...register("image.url")} />
            {errors.image?.url && (
              <p className="text-sm text-red-500">{errors.image.url.message}</p>
            )}
          </div>

          <div>
            <Label>תיאור התמונה </Label>
            <TextInput {...register("image.alt")} />
            {errors.image?.alt && (
              <p className="text-sm text-red-500">{errors.image.alt.message}</p>
            )}
          </div>

          {/* עליי */}
          <div>
            <Label>קצת עליי</Label>
            <Textarea rows={4} {...register("about")} />
            {errors.about && (
              <p className="text-sm text-red-500">{errors.about.message}</p>
            )}
          </div>

            {user?.role === "user" && (
            <div className="mt-4 flex w-full max-w-md flex-col gap-2">
            <Label htmlFor="resume">קורות חיים (PDF/DOC)</Label>
            <input
              type="file"
              id="resume"
              accept=".pdf,.doc,.docx"
              className="rounded-md border p-2"
              onChange={(e) => setResume(e.target.files?.[0] || null)}
            />
            {user?.resume && (
              <>
                <p className="mt-1">
                  קובץ קיים:
                  <a
                    href={`http://localhost:8181/${user.resume}`}
                    target="_blank"
                    className="text-blue-500 underline"
                  >
                    צפה
                  </a>
                </p>
                <Button
                  onClick={() =>
                    window.open(
                      `http://localhost:8181/api/users/${user._id}/resume/download`,
                    )
                  }
                >
                  הורד קובץ
                </Button>
              </>
            )}
            <Button
              onClick={handleResumeUpload}
              disabled={!resume}
              className="mt-2"
            >
              העלה קורות חיים
            </Button>
          </div>
)}
          {/* כפתורים */}
          <div className="flex gap-4 pt-4">
            <Button type="submit" disabled={!isDirty || !isValid}>
              שמור שינויים
            </Button>

            <Button color="gray" onClick={onClose}>
              ביטול
            </Button>
          </div>
        </form>
      </Modal.Body>
    </Modal>
  );
};

export default EditProfileModal;


