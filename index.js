//task 1
const isPrime = (num) => {
  if (num <= 1) return false;
  for (let i = 0; i <= Math.sqrt(num); i++) {
    if (num % i == 0) return false;
  }

  return true;
};

//console.log(isPrime(25))

//task2
const reverseString = (str) => {
  let reversed = str.split("").reverse().join("");
  return reversed;
};

//console.log(reverseString("hello"))

//task 3
const findMax = (arr) => {
  let biggest = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > biggest) {
      biggest = arr[i];
    }
  }
  return biggest;
};

//console.log(findMax([1, 2, 6, 4, 5]));

//task4

const isPalindrome = (str) => {
  let joint = str.toLowerCase().split(" ").join("");
  let reversed = joint.split("").reverse().join("");
  if (joint == reversed) return true;
  return false;
};

//console.log(isPalindrome("racecar"))

//task 5

const factorial = (n) => {
  if (n === 0 || n === 1) return 1;
  let result = 1;
  for (let i = 2; i <= n; i++) {
    result *= i;
  }
  return result;
};

//console.log(factorial(5));

//Task6
const sortArray = (arr) => {
  arr.sort((a, b) => a - b);
  return arr;
};

//console.log(sortArray([5,4,3,2,1]))

//Task 7

const countOccurrences = (arr, element) => {
  let count = 0;
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] === element) {
      count++;
    }
  }
  return count;
};

//console.log(countOccurrences([1, 2, 3, 4, 2, 5], 2))

//Task 8

const isAnagram = (str1, str2) => {
  str1 = str1.toLowerCase().split("").sort().join("");
  str2 = str2.toLowerCase().split("").sort().join("");
  return str1 === str2;
};
//console.log(isAnagram("listen", "silent"));

//Task 9
const findLongestWord = (sentence) => {
  let words = sentence.split(" ");
  let longest = "";
  for (let i = 0; i < words.length; i++) {
    if (words[i].length > longest.length) {
      longest = words[i];
    }
  }
  return longest;
};

//console.log(findLongestWord("The quick brown fox jumped over the lazy dog"));

//Task 10

const mergeSortedArrays = (arr1, arr2) => {
  let merged = [...arr1, ...arr2];
  merged.sort((a, b) => a - b);
  return merged;
};
//console.log(mergeSortedArrays([4,5,6], [1,2,3]));

//Task 11
const students = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 20 },
];

const createStudentMessages = (students) => {
  return students.map(
    (student) => `${student.name} is ${student.age} years old`,
  );
};

const messages = createStudentMessages(students);
//console.log(messages);
// Expected: ["Alice is 21 years old", "Bob is 19 years old", "Charlie is 20 years old"]

//Task 12
const students2 = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 18 },
  { name: "Eve", age: 22 },
];

const filterAdultStudents = (students) => {
  return students.filter((student) => student.age >= 21);
};

const adultStudents = filterAdultStudents(students2);
//console.log(adultStudents);
// Expected: [{ name: "Alice", age: 21 }, { name: "Charlie", age: 25 }, { name: "Eve", age: 22 }]

//Task 13
const students3 = [
  { name: "Alice", age: 21 },
  { name: "Bob", age: 19 },
  { name: "Charlie", age: 25 },
  { name: "David", age: 18 },
  { name: "Eve", age: 22 },
];

const filterStudentsByAgeRange = (students, minAge, maxAge) => {
  return students.filter((student) => student.age >= minAge && student.age <= maxAge);
};

const targetAgeStudents = filterStudentsByAgeRange(students3, 20, 24);
//console.log(targetAgeStudents);
// Expected: [{ name: "Alice", age: 21 }, { name: "Eve", age: 22 }]

//task 14

const words = ["Apple", "Banana", "Avocado", "Strawberry", "Mango"];

const getFilteredStringLengths = (words) => {
  return words.map((word) => word.length);
};

const filteredLengths = getFilteredStringLengths(words);
//console.log(filteredLengths);
// Expected: [6, 10, 5] (lengths of "Banana", "Strawberry", "Mango")

//Task 15

const grades = [85, 90, 78, 92, 88];

const calculateAverageGrade = (grades) => {
  return grades.reduce((sum, grade) => sum + grade, 0) / grades.length;
};

const average = calculateAverageGrade(grades);
//console.log(average);
// Expected: 86.6


//Task 16

const fruits = ["apple", "banana", "apple", "orange", "banana", "apple"];

const countOccurrencesWithReduce = (items) => {
  return items.reduce((acc, item) => {
    acc[item] = (acc[item] || 0) + 1;
    return acc;
  }, {});
};

const fruitCount = countOccurrencesWithReduce(fruits);
//console.log(fruitCount);
// Expected: { apple: 3, banana: 2, orange: 1 }

//Task 17

const matrix = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

const findMaxValueInMatrix = (matrix) => {
  let max = 0;
  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[i].length; j++) {
      if (matrix[i][j] > max) {
        max = matrix[i][j];
      }
    }
  }
  return max;
};

const max = findMaxValueInMatrix(matrix);
console.log(max);
// Expected: 9

//Task 18

const generateMultiplicationTable = (n) => {
  const table = [];
  for (let i = 1; i <= n; i++) {
    const row = [];
    for (let j = 1; j <= n; j++) {
      row.push(i * j);
    }
    table.push(row);
  }
  return table;
};

const table = generateMultiplicationTable(4);
console.log(table);
// Expected:
// [
//   [1, 2, 3, 4],
//   [2, 4, 6, 8],
//   [3, 6, 9, 12],
//   [4, 8, 12, 16],
// ]