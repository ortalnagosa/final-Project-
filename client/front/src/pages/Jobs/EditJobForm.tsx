import { useState } from "react";
import axios from "axios";
import { TJob } from "../../types/job";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

interface EditJobModalProps {
  job: TJob;
  onClose: () => void;
  onSave: (updated: TJob) => void;
}

export default function EditJobModal({
  job,
  onClose,
  onSave,
}: EditJobModalProps) {
  const [form, setForm] = useState({
    title: job.title || "",
    subtitle: job.subtitle || "",
    description: job.description || "",
    company: job.company || "",
    web: job.web || "",
    phone: job.phone || "",
    email: job.email || "",
    address: {
      city: job.address.city || "",
      street: job.address.street || "",
      houseNumber: job.address.houseNumber || "",
    },
    image: {
      url: job.image?.url || "",
      alt: job.image?.alt || "",
    },
  });

  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

  /** שינוי שדות רגילים */
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };

  /** שינוי שדות בתוך אובייקט (address / image) */
  const handleNestedChange = (e: any, parent: "address" | "image") => {
    const { name, value } = e.target;

    setForm((prev: any) => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [name]: value,
      },
    }));
  };

  /** שליחה לשרת */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const payload = {
        title: form.title,
        subtitle: form.subtitle,
        description: form.description,
        company: form.company,
        web: form.web,
        phone: form.phone,
        email: form.email,
        address: {
          city: form.address.city,
          street: form.address.street,
          houseNumber: form.address.houseNumber,
        },
        image: {
          url: form.image.url,
          alt: form.image.alt,
        },
      };
      
      const token = localStorage.getItem("token");
      const { data } = await axios.put(
        `http://localhost:8181/api/jobs/${job._id}`,
        payload,
        {
          headers: { "x-auth-token": token || "" },
        },
      );

      toast.success("המשרה עודכנה בהצלחה!");
      onSave(data.job);      
      navigate("/jobs");
    } catch (error) {
      console.error(error);
      toast.error("שגיאה בעדכון המשרה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <form
        onSubmit={handleSubmit}
        className="max-h-[100vh] w-full max-w-3xl overflow-y-auto rounded-xl bg-white/80 dark:bg-black/30 p-6 text-right shadow-xl dark:text-black"
      >
        <h2 className="mb-4 text-2xl font-bold">עריכת משרה</h2>

        {/* שדות רגילים */}
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="mb-3 w-full rounded border p-2"
          placeholder="שם המשרה"
        />

        <input
          name="subtitle"
          value={form.subtitle}
          onChange={handleChange}
          className="mb-3 w-full rounded border p-2"
          placeholder="תת כותרת"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="mb-3 w-full rounded border p-2"
          rows={4}
          placeholder="תיאור"
        />

        <input
          name="company"
          value={form.company}
          onChange={handleChange}
          className="mb-3 w-full rounded border p-2"
          placeholder="שם חברה"
        />

        <input
          name="web"
          value={form.web}
          onChange={handleChange}
          className="mb-3 w-full rounded border p-2"
          placeholder="אתר החברה"
        />

        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          className="mb-3 w-full rounded border p-2"
          placeholder="טלפון"
        />

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          className="mb-3 w-full rounded border p-2"
          placeholder="אימייל"
        />

        {/* כתובת */}
        <h3 className="mt-4 font-semibold">כתובת</h3>

        <input
          name="city"
          value={form.address.city}
          onChange={(e) => handleNestedChange(e, "address")}
          className="mb-3 w-full rounded border p-2"
          placeholder="עיר"
        />

        <input
          name="street"
          value={form.address.street}
          onChange={(e) => handleNestedChange(e, "address")}
          className="mb-3 w-full rounded border p-2"
          placeholder="רחוב"
        />

        <input
          name="houseNumber"
          value={form.address.houseNumber}
          onChange={(e) => handleNestedChange(e, "address")}
          className="mb-3 w-full rounded border p-2"
          placeholder="מספר בית"
        />

        {/* תמונה */}
        <h3 className="mt-4 font-semibold">תמונה</h3>

        <input
          name="url"
          value={form.image.url}
          onChange={(e) => handleNestedChange(e, "image")}
          className="mb-3 w-full rounded border p-2"
          placeholder="קישור תמונה"
        />

        <input
          name="alt"
          value={form.image.alt}
          onChange={(e) => handleNestedChange(e, "image")}
          className="mb-3 w-full rounded border p-2"
          placeholder="תיאור תמונה (alt)"
        />

        {/* כפתורים */}
        <div className="mt-4 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded border px-4 py-2 hover:bg-gray-100"
          >
            ביטול
          </button>

          <button
            type="submit"
            disabled={loading}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            שמירה
          </button>
        </div>
      </form>
    </div>
  );
}
