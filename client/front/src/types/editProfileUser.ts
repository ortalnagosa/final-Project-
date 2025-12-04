export type EditProfileData = {
  name: { first: string; middle?: string; last: string };
  about?: string;
  city?: string;
  phone?: string;
  skills?: string[];
  image?: { url: string; alt: string };
  age?: number;
};
