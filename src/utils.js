//Utility Functions

const factorOfSpeed = 10;

export function randomRGBValue() {
    return Math.floor(Math.random() * (255));
}

export function getRandomNumber() {
    var randomNum = Math.floor(Math.random() * factorOfSpeed) + 1;
    randomNum *= Math.floor(Math.random() * 2) == 1 ? 1 : -1;
    return randomNum;
}