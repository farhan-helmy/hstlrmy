/* eslint-disable @next/next/no-img-element */
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

const banner = [
  '/Hustlermy_header-01.jpg',
  '/Hustlermy_header-01.jpg',
]

let count = 0;
let interval: string | number | NodeJS.Timeout | undefined;
export const BannerSlider = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const ref = useRef<HTMLDivElement>(null);
  const removeAnimation = () => {
    ref.current?.classList.remove('fade-animation');
  }
  // autoplay slider
  useEffect(() => {
    ref.current?.addEventListener("animationend", removeAnimation);
    ref.current?.addEventListener("mouseenter", pauseSlider);
    ref.current?.addEventListener("mouseleave", startSlider);

    startSlider();
    return () => {
      pauseSlider();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const startSlider = () => {
    interval = setInterval(() => {
      changeNextSlide()
    }, 5000);
  }
  const changeNextSlide = () => {
    count = (count + 1) % banner.length;
    setCurrentSlide(count);

    ref.current?.classList.add('fade-animation')
  }

  const changePrevSlide = () => {
    const itemsLength = banner.length;
    count = (currentSlide + itemsLength - 1) % itemsLength;
    setCurrentSlide(count);
    ref.current?.classList.add('fade-animation')
  }

  const pauseSlider = () => {
    clearInterval(interval);
  }

  return (
    <div ref={ref} className="w-full select-none relative group">
      <div className="aspect-w-12 aspect-h-5">
        <img src={banner[currentSlide]} alt="smartwatch-1" />
      </div>
      <div className="absolute w-full top-1/2 transform -translate-y-1/2 px-3 flex justify-between items-center">    
        <ChevronLeftIcon className="h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 group-hover:transition-all text-gray-500" onClick={() => changePrevSlide()} />      
        <ChevronRightIcon className="h-10 w-10 rounded-full opacity-0 group-hover:opacity-100 group-hover:transition-all text-gray-500" onClick={() => changeNextSlide()} />
      </div>
    </div>
  )
}