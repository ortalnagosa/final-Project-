const normalizeJob = async (rawJob, userId) => {
  const { url, alt } = rawJob.image || {};

  const image = {
    url:
      url ||
      "https://cdn.pixabay.com/photo/2016/04/20/08/21/entrepreneur-1340649_960_720.jpg",
    alt: alt || "Job image",
  };

  return {
    ...rawJob,
    image,
    status: rawJob.status || "active",
    user_id: rawJob.user_id || userId,
  };
};

module.exports = normalizeJob;
