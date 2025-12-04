

const normalizeUser = (rawUser) => {
  const name = { ...rawUser.name, middle: rawUser.name.middle || "" };

  const image = {
    ...rawUser.image,
    url:
      rawUser.image?.url ||
      "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
    alt: rawUser.image?.alt || "Business User image",
  };

  const user = { ...rawUser, name, image };
  
    if (!user.role) {
      user.role = "user";
    } 
  delete user.confirmPassword;

  return user;
};

module.exports = normalizeUser;
