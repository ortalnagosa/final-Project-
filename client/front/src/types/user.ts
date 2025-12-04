export type TUser = {
  _id: string;
  name: {
    first: string;
    middle?: string;
    last: string;
  };
  email: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  image: {
    url: string;
    alt: string;
  };
  firstName?: string; // לשימוש בקיצורי דרך

  experience: {
    title: string;
    company: string;
    from: string;
    to?: string;
    description?: string;
  }
  age: number;
  resume?: string;
  role: "user" | "employer" | "admin";
  pendingEmployerRequest: boolean;
  city?: string;
  birthDate: string;
  armyUnit?: string;
  releaseDate?: string;
  skills: string[];
  failedLoginAttempts: number;
  lockUntil: string | null;
  createdAt?: string;
  updatedAt?: string;
  about?: string;
};
