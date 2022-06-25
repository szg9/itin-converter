import './App.css';
import { useState } from 'react';
import airports from './db/airports.json';

function App() {
  const [inputValue, setInputValue] = useState('');

  function isCharLength(wordLength, word) {
    if (word.length == wordLength) {
      return true;
    } else {
      return false;
    }
  }

  function isNumber(word) {
    if (!isNaN(word)) {
      return true;
    } else {
      return false;
    }
  }

  function lastGivenChars(number, word) {
    const startIndex = word.length - number;
    return word.slice(startIndex);
  }

  function isValidCity(word) {
    let isValidCity = false;
    for (const airport in airports) {
      if (word == airports[airport].iata) {
        isValidCity = true
        break;
      }
    }
    return isValidCity;
  }

  function convertCity(cityCode) {
    let fullCity = "";
    for (const airport in airports) {
      if (cityCode == airports[airport].iata) {
        fullCity = airports[airport].city + " (" + airports[airport].iata + ")";
      }
    }
    return fullCity;
  }

  function isCityPairStop(cityPair) {
    if (cityPair.length == 7 && isNumber(cityPair.slice(3, 4))) {
      return true;
    } else {
      return false;
    }
  }

  function isAllCharNumber(word) {
    const charArray = word.split("");
    let isAllCharNumber = false;
    for (let i = 0; i < charArray.length; i++) {
      if (isNumber(charArray[i])) {
        isAllCharNumber = true;
      } else {
        isAllCharNumber = false;
        break;
      }
    }
    return isAllCharNumber;
  }

  function formatTime(rawTime) {
    const timeArray = rawTime.split("");
    const formattedDepTime = timeArray.splice(2, 0, ":");
    return timeArray.join('');
  }

  function getTimes(sourceArr) {
    let times = [];
    let timeString = "";
    for (let i = 0; i < sourceArr.length; i++) {
      if (isCharLength(4, sourceArr[i]) &&
        isAllCharNumber(sourceArr[i]) &&
        sourceArr[i] != undefined) {
        times.push(sourceArr[i]);
      }
    }
    if (times.length === 2) {
      let depTime = formatTime(times[0]);
      let arrTime = formatTime(times[1]);
      timeString = depTime + " - " + arrTime;
    }
    return timeString;
  }

  function getCityPair(sourceArr) {
    let cityPair = "";
    for (let i = 0; i < sourceArr.length; i++) {
      if (isCharLength(6, sourceArr[i]) &&
        isValidCity(sourceArr[i].slice(0, 3)) &&
        isValidCity((lastGivenChars(3, sourceArr[i])))) {
        let depCity = convertCity(sourceArr[i].slice(0, 3));
        let arrCity = convertCity(lastGivenChars(3, sourceArr[i]));
        cityPair = depCity + " - " + arrCity;
      } else if (isCharLength(7, sourceArr[i]) &&
        isValidCity(sourceArr[i].slice(0, 3)) &&
        isValidCity((lastGivenChars(3, sourceArr[i]))) &&
        isCityPairStop(sourceArr[i])) {
        let depCity = convertCity(sourceArr[i].slice(0, 3));
        let arrCity = convertCity(lastGivenChars(3, sourceArr[i]));
        cityPair = depCity + " - " + arrCity;
      }
    }
    return cityPair;
  }

  function getDate(sourceArr) {
    let date = "";
    for (let i = 0; i < sourceArr.length; i++) {
      if (isCharLength(5, sourceArr[i]) &&
        isNumber(sourceArr[i].slice(0, 2))) {
        date = sourceArr[i];
      }
    }
    return date;
  }

  function getFlightNumber(sourceArr) {
    let airlineCode = "";
    let number = "";
    let flightNumber = [];
    for (let i = 0; i < sourceArr.length; i++) {
      if (isCharLength(2, sourceArr[i]) &&
        isNumber(sourceArr[i + 1]) &&
        isCharLength(3, sourceArr[i + 1])) {
        airlineCode = sourceArr[i];
        number = sourceArr[i + 1]
        flightNumber = [airlineCode, number].join(" ");
      } else if (isCharLength(6, sourceArr[i]) &&
        isNumber(lastGivenChars(4, sourceArr[i]))) {
        airlineCode = sourceArr[i].slice(0, 2);
        number = lastGivenChars(4, sourceArr[i]);
        flightNumber = [airlineCode, number].join(" ");
      }
    }
    return flightNumber;
  }

  function getFullLine(sourceArr) {
    let fullLine = getFlightNumber(sourceArr) + "  " + getDate(sourceArr) + "  " + getCityPair(sourceArr) + "  " + getTimes(sourceArr);
    if (fullLine === "      ") {
      fullLine = ""
    }
    return fullLine;
  }

  function convertLines(lineArray) {
    let convertedLines = [];
    for (let i = 0; i < lineArray.length; i++) {
      const line = lineArray[i];
      convertedLines.push(getFullLine(line.split(' ')));
    }
    convertedLines = selectRightLines(convertedLines).join('\n');
    return convertedLines;
  }

  function splitInputToLines(input) {
    return input.split('\n');
  }

  function selectRightLines(lineArray) {
    const rightLines = [];
    for (let i = 0; i < lineArray.length; i++) {
      const line = lineArray[i];
      if (line.split('  ').length === 4 && !line.split('  ').includes('')) {
        rightLines.push(line);
      }
    }
    return rightLines;
  }

  function handleInputChange(e) {
    const value = e.target.value;
    setInputValue(value);
  }

  function handleButtonClick() {
    setInputValue(convertLines(splitInputToLines(inputValue)));
  }

  return (
    <div>
      <h1>ITINConverter</h1>
      <textarea onChange={handleInputChange} name="input" id="input" cols="80" rows="20"></textarea>
      <button onClick={handleButtonClick} name="button" id="button">Magic</button>
      <div>{inputValue}</div>
    </div>

  );
}

export default App;
