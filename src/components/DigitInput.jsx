import React, { useState, useEffect, useRef } from 'react';

const DigitInput = ({ onDigitsChange, digitCount }) => {
  const [digits, setDigits] = useState(Array(digitCount).fill(''));
  const inputsRef = useRef([]);

  useEffect(() => {
    inputsRef.current = inputsRef.current.slice(0, digitCount);
  }, [digitCount]);

  const handleChange = (event, index) => {
    const newDigits = [...digits];
    const value = event.target.value;

    if (/\D/.test(value) && value !== '') return;

    newDigits[index] = value;
    setDigits(newDigits);
    onDigitsChange(newDigits.join(''));

    if (value && index < digitCount - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handleKeyUp = (event, index) => {
    if (event.key === "Backspace") {
      if (index > 0 && !digits[index]) {
        setDigits(digits.map((digit, idx) => (idx === index ? '' : digit)));
        inputsRef.current[index - 1].focus();
      }
    } else if (event.key === "ArrowLeft" && index > 0) {
      inputsRef.current[index - 1].focus();
    } else if (event.key === "ArrowRight" && index < digitCount - 1) {
      inputsRef.current[index + 1].focus();
    }
  };

  const handlePaste = (event) => {
    event.preventDefault();
    const pasteData = event.clipboardData.getData('text').slice(0, digitCount);
    const pasteDigits = pasteData.split('');

    setDigits(prevDigits => {
      const newDigits = [...prevDigits];
      pasteDigits.forEach((digit, index) => {
        if (!/\D/.test(digit)) {
          newDigits[index] = digit;
        }
      });
      onDigitsChange(newDigits.join(''));
      return newDigits;
    });

    const nextIndex = pasteDigits.length < digitCount ? pasteDigits.length : digitCount - 1;
    setTimeout(() => inputsRef.current[nextIndex].focus(), 0);
  };

  return (
    <div className="digitInputContainer" onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={el => inputsRef.current[index] = el}
          type="text"
          maxLength="1"
          value={digit}
          onChange={(e) => handleChange(e, index)}
          onKeyUp={(e) => handleKeyUp(e, index)}
          className="digitInput"
          placeholder="0"
        />
      ))}
    </div>
  );
};

export default DigitInput;