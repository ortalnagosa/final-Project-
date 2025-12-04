export interface TcreateJob {
  _id: string;
  title: string;
  subtitle: string;
  description: string;
  phone: string;
  email: string;
  web: string;
  image?: {
    url: string;
    alt: string;
  };
  address: {
    city: string;
    street: string;
    houseNumber: number;
    zip: number;
  };
  likes: string[];
  salary?: string;
  status: "active" | "inactive";
  user_id: string;
  applicants: {
    user_id: string;
    submittedAt: string;
    status: "pending" | "contacted";
  }[];
  company: string;
  jobType?: string;
  appliedByUserIds: string[];
  createdAt: string;
  updatedAt: string;
}
