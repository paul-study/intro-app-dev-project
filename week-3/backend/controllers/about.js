
const getLearnerInfo = (req, res) => {
  return res.status(200).json({
    id: "1000138616",
    firstName: "Paul",
    lastName: "Johnson",
    age: 37,
    email: "paul.m.johnson1988@gmail.com",
    enjoyAboutIt: "I enjoy learning new tricks and problem solving"
  });
};

export { getLearnerInfo};
