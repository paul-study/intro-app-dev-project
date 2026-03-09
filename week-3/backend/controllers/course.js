const getCourses = (req, res) => {
  return res.status(200).json({
    coursesEnrolled : ["Programming 2", "Studio 2", "Platforms and Devices", "Intro App Dev"]
  });
};

export { getCourses};