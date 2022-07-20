import './App.scss';
import { useState } from 'react';
import airports from './db/airports.json';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [result, setResult] = useState([]);

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
      } else if (isCharLength(6, sourceArr[i]) &&
        sourceArr[i].charAt(4) === "+" &&
        sourceArr[i].charAt(5) === "1") {
        times.push(sourceArr[i]);
      }
    }
    if (times.length === 2) {
      let depTime = formatTime(times[0]);
      let arrTime = formatTime(times[1]);
      timeString = depTime + " - " + arrTime;
    } else if (times.length === 3) {
      let depTime = formatTime(times[1]);
      let arrTime = formatTime(times[2]);
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
    convertedLines = selectRightLines(convertedLines);
    console.log(convertedLines);
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
    setResult(convertLines(splitInputToLines(inputValue)));
  }

  return (
    <div className='container'>
      <h1><span>ITIN</span>Converter</h1>
      <div className='form-group'>
        <textarea onChange={handleInputChange} name="input" id="input" cols="100" rows="10" className='form-control' placeholder="Másold be az itinerary-t Amadeusból..."></textarea>
      </div>
      <button onClick={handleButtonClick} name="button" id="button" className="btn btn-primary">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-magic" viewBox="0 0 16 16">
          <path d="M9.5 2.672a.5.5 0 1 0 1 0V.843a.5.5 0 0 0-1 0v1.829Zm4.5.035A.5.5 0 0 0 13.293 2L12 3.293a.5.5 0 1 0 .707.707L14 2.707ZM7.293 4A.5.5 0 1 0 8 3.293L6.707 2A.5.5 0 0 0 6 2.707L7.293 4Zm-.621 2.5a.5.5 0 1 0 0-1H4.843a.5.5 0 1 0 0 1h1.829Zm8.485 0a.5.5 0 1 0 0-1h-1.829a.5.5 0 0 0 0 1h1.829ZM13.293 10A.5.5 0 1 0 14 9.293L12.707 8a.5.5 0 1 0-.707.707L13.293 10ZM9.5 11.157a.5.5 0 0 0 1 0V9.328a.5.5 0 0 0-1 0v1.829Zm1.854-5.097a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L8.646 5.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0l1.293-1.293Zm-3 3a.5.5 0 0 0 0-.706l-.708-.708a.5.5 0 0 0-.707 0L.646 13.94a.5.5 0 0 0 0 .707l.708.708a.5.5 0 0 0 .707 0L8.354 9.06Z" />
        </svg>
        <p>Magic</p>
      </button>
      <div className='result'>
        {result.map(result =>
          <p>{result}</p>)}
      </div>
    </div>
  );
}

export default App;
