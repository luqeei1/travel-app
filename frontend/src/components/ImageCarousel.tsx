import { optimizedAppearDataAttribute } from 'framer-motion';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageCarouselProps {
  images: string[];
  altText?: string;
}

const ImageCarousel: React.FC<ImageCarouselProps> = ({ images, altText = 'carousel image' }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const prevImage = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextImage = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const variants = {
    enter : (direction : number) => ({ 
        x : direction > 0 ? 300 : -300,
        opacity : 0,
    }), 

    center : {
        x : 0,
        opacity : 1,
        transition : {
            duration : 0.5,
            ease : 'easeInOut',
        },
    }, 

    exit : (direction : number) => ({ 
        x : direction < 0 ? 300 : -300,
        opacity : 0,
        transition : {
            duration : 0.5,
            ease : 'easeInOut',
        },
    }),

  }

  return (
    <div className="relative w-full max-w-3xl mx-auto mt-24">
  <AnimatePresence custom={direction}>
    <motion.img
      key={currentIndex}
      src={images[currentIndex]}
      alt={`${altText} ${currentIndex + 1}`}
      className="w-full h-80 object-cover rounded-xl absolute"
      custom={direction}
      variants={variants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.5 }}
    />
  </AnimatePresence>

  
  <div className="grid grid-cols-3 gap-2 mt-4 left-4">
    <div className='grid-cols-8'> 
  <button
    onClick={prevImage}
    className="absolute left-4 top-[70%] bg-white/70 px-3 py-2 rounded-full shadow grid place-items-center"
  >
    ◀
  </button>
  <button
    onClick={nextImage}
    className="absolute right-4 top-[70%] bg-white/70 px-3 py-2 rounded-full shadow grid place-items-center"
  >
    ▶
  </button>
</div>
</div>
</div> 

  );
};

export default ImageCarousel;
