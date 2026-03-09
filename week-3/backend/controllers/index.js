// Create a GET route
const getPersonInfo = (req, res) => {
  return res.status(200).json({
    message: "Hello, World!",
    firstName: "John",
    lastName: "Doe",
    age: 20,
    hobbies: ["Reading", "Gaming", "Cooking"],
  });
};

const getProgLangs = (req, res) => {
  return res.status(200).json({
    progLangs: [
      { name: "C++", author: "Bjarne Stroustrup" },
      { name: "Java", author: "James Gosling" },
      { name: "JavaScript", author: "Brendan Eich" },
      { name: "Python", author: "Guido van Rossum" },
      { name: "Ruby", author: "Yukihiro Matsumoto" },
    ],
  });
};

// Export the controller functions. May be used by other modules. For example, the index routes module
export { getPersonInfo, getProgLangs };
