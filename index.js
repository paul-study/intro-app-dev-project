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
  if (joint == reversed) return true
  return false
};

//console.log(isPalindrome("racecar"))


//task 5

const factorial = (n) => {
    if (n<0) return undefined;
    

};

console.log(factorial(1));