"use client";

import { useState, useEffect, useCallback } from "react";

export function useTypewriter(
  texts: string[],
  typingSpeed = 80,
  deletingSpeed = 50,
  pauseDuration = 2000
) {
  const [displayText, setDisplayText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const tick = useCallback(() => {
    const currentText = texts[textIndex];

    if (!isDeleting) {
      // Typing
      if (charIndex < currentText.length) {
        setDisplayText(currentText.slice(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
      } else {
        // Pause then start deleting
        setTimeout(() => setIsDeleting(true), pauseDuration);
        return;
      }
    } else {
      // Deleting
      if (charIndex > 0) {
        setDisplayText(currentText.slice(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
      } else {
        setIsDeleting(false);
        setTextIndex((prev) => (prev + 1) % texts.length);
      }
    }
  }, [texts, textIndex, charIndex, isDeleting, pauseDuration]);

  useEffect(() => {
    const speed = isDeleting ? deletingSpeed : typingSpeed;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, typingSpeed, deletingSpeed]);

  return displayText;
}
