import React, { useState, useEffect } from 'react';
import sliderimg1 from '../assets/slider0.webp';
import sliderimg2 from '../assets/slider1.webp';
import sliderimg3 from '../assets/slider2.webp';
import '../styles/Slider.css';

export const Slider = () => {
  const images = [sliderimg1, sliderimg2, sliderimg3];
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 4000);

    return () => clearInterval(interval);
  }, [currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + images.length) % images.length);
  };

  return (
    <div className="slider">
      <button className="slider-button left" onClick={handlePrev}>
        &lt;
      </button>
      <img src={images[currentIndex]} alt={`Image ${currentIndex + 1}`} />
      <button className="slider-button right" onClick={handleNext}>
        &gt;
      </button>
    </div>
  );
};


