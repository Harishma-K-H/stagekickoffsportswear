import './style.css';

import useWindowWidth from '@hooks/useWindowWidth';
import React, { MouseEvent, useEffect, useRef, useState } from 'react';
import { SlArrowRightCircle } from 'react-icons/sl';

interface HorizontalScrollProps {
  children: React.ReactNode;
  button?: boolean;
  onMouseMove?: boolean;
  rootClass?: string;
}

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
  children,
  button = false,
  onMouseMove = true,
  rootClass,
}) => {
  const [windowWidth] = useState<number>(useWindowWidth());
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [isDown, setIsDown] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  useEffect(() => {
    if (scrollContainerRef.current && windowWidth > 1024) {
      const { scrollWidth, clientWidth } = scrollContainerRef.current;
      // Scroll to the end initially
      scrollContainerRef.current.scrollLeft = scrollWidth - clientWidth;
      // Wait for a second and then smoothly scroll to the start
      setTimeout(() => {
        smoothScrollTo(0, 1800); // 2 seconds duration
      }, 800); // 1 second delay
    }
  }, []);
  const smoothScrollTo = (target: number, duration: number) => {
    if (!scrollContainerRef.current) {
      return;
    }

    const start = scrollContainerRef.current.scrollLeft;
    const change = target - start;
    const increment = 20;
    let currentTime = 0;

    const animateScroll = () => {
      currentTime += increment;
      const val = easeInOutQuad(currentTime, start, change, duration);
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollLeft = val;
      }
      if (currentTime < duration) {
        requestAnimationFrame(animateScroll);
      }
    };

    animateScroll();
  };

  const easeInOutQuad = (t: number, b: number, c: number, d: number) => {
    t /= d / 2;
    if (t < 1) {
      return (c / 2) * t * t + b;
    }
    t--;

    return (-c / 2) * (t * (t - 2) - 1) + b;
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (scrollContainerRef.current) {
      setIsDown(true);
      setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
      setScrollLeft(scrollContainerRef.current.scrollLeft);
    }
  };

  const handleMouseLeave = () => {
    setIsDown(false);
  };

  const handleMouseUp = () => {
    setIsDown(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDown || !scrollContainerRef.current) {
      return;
    }
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll-fast
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { scrollLeft, clientWidth } = scrollContainerRef.current;
      const scrollAmount = clientWidth / 2; // Scroll by half the container's width
      const newScrollLeft =
        direction === 'left'
          ? scrollLeft - scrollAmount
          : scrollLeft + scrollAmount;
      scrollContainerRef.current.scrollTo({
        left: newScrollLeft,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div className="scroll-wrapper">
      {button && (
        <button
          className="scroll-button left"
          onClick={() => handleScroll('left')}
        >
          <SlArrowRightCircle className="w-8 h-8 text-black/70 rotate-180" />
        </button>
      )}
      <div
        ref={scrollContainerRef}
        className={`scroll-container md:px-[50px] lg:p-0 ${rootClass}`}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={(e) => (onMouseMove ? handleMouseMove(e) : () => {})}
      >
        {children}
      </div>
      {button && (
        <button
          className="scroll-button right"
          onClick={() => handleScroll('right')}
        >
          <SlArrowRightCircle className="w-8 h-8 text-black/70" />
        </button>
      )}
    </div>
  );
};

export default HorizontalScroll;
