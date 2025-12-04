export interface TJob {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  company: string;
  email: string;
  phone: string;
  web: string;
  salary?: string;
  jobType?: string;
  image?: {
    url: string;
    alt: string;
  };
  appliedByUserIds: string[];
  address: {
    country: string;
    city: string;
    street: string;
    houseNumber: number;
    zip: number;
  };
  likes: string[];
  status: "active" | "inactive";
  createdAt: string;
  updatedAt: string;
  user_id: string;
  applicants: {
    user_id: string;
    name: { first: String, last: String }; // אופציונלי
    email: String; // אופציונלי
    phone: String; // אופציונלי
    submittedAt: string;
    status: "pending" | "contacted";
    resume?: string;
  }[];
}
