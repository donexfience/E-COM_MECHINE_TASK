import { ChevronLeft, ChevronRight } from "lucide-react";
import Hero1 from "@/assets/Hero1.webp";
import slide1 from "@/assets/slide1.webp";
import slide2 from "@/assets/slide.webp";
import slide3 from "@/assets/slide3.webp";
import { useState } from "react";

// Define the Carousel component
interface CarouselProps {
  slides: string[];
}

const Carousel: React.FC<CarouselProps> = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const goToPrevious = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  return (
    <div className="relative w-full h-full">
      <img
        src={slides[currentIndex]}
        alt={`Slide ${currentIndex + 1}`}
        className="w-full h-full object-cover rounded-lg"
      />
      <button
        onClick={goToPrevious}
        className="absolute bottom-4 left-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
      >
        <ChevronLeft className="h-6 w-6 text-gray-700" />
      </button>
      <button
        onClick={goToNext}
        className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-md hover:bg-gray-100"
      >
        <ChevronRight className="h-6 w-6 text-gray-700" />
      </button>
      <div className="absolute bottom-4 left-6 flex space-x-1">
        {slides.map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full cursor-pointer ${
              index === currentIndex ? "bg-gray-800" : "bg-gray-400"
            }`}
            onClick={() => setCurrentIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

const HeroSection = () => {
  const carouselSlides = [slide1, slide2, slide3];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Sale Banner */}
        <div className="lg:col-span-2 relative">
          <div className="bg-gradient-to-r from-orange-100 to-orange-50 rounded-lg p-8 h-96 flex items-center relative overflow-hidden">
            <img
              src={Hero1}
              alt="Hero"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            {/* Terms */}
            <div className="absolute bottom-4 right-4 text-xs text-gray-600 z-10">
              *T&C APPLY
            </div>
          </div>
          {/* Bank Offers */}
          <div className="mt-4 flex items-center justify-center space-x-4 text-sm">
            <span className="text-gray-700 font-medium">
              No Cost EMI & Additional Bank Offers Available From
            </span>
            <div className="flex space-x-2">
              <div className="w-8 h-6 bg-red-600 rounded"></div>
              <div className="w-8 h-6 bg-blue-600 rounded"></div>
              <div className="w-8 h-6 bg-orange-600 rounded"></div>
              <div className="w-8 h-6 bg-purple-600 rounded"></div>
              <div className="w-8 h-6 bg-green-600 rounded"></div>
            </div>
          </div>
        </div>
        {/* Wall Clocks Promo - Now a Carousel */}
        <div className="relative">
          <div className="rounded-lg h-96 relative overflow-hidden">
            <Carousel slides={carouselSlides} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;