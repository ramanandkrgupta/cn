import { useState, useEffect } from 'react';

export const useTypewriter = (words = [], typingSpeed = 150, deletingSpeed = 100, pauseTime = 2000) => {
  const [displayText, setDisplayText] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (words.length === 0) return;

    let timer;
    const currentWord = words[wordIndex];

    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentWord.substring(0, displayText.length - 1));
        if (displayText.length === 1) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }, deletingSpeed);
    } else {
      if (displayText === currentWord) {
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, pauseTime);
      } else {
        timer = setTimeout(() => {
          setDisplayText(currentWord.substring(0, displayText.length + 1));
        }, typingSpeed);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, wordIndex, words]);

  return displayText;
};