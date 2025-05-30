import { useEffect, useState } from "react";

const promoMessages = [
  "Additional In-Store Discount Upto Rs.10,000*",
  "Flat 25% OFF on Electronics Today Only!",
  "Buy 1 Get 1 Free on Selected Items!",
  "Free Shipping on Orders Above ₹999",
];

const PromoBanner = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        prevIndex === promoMessages.length - 1 ? 0 : prevIndex + 1
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-emerald-700 text-white text-center py-2 px-4 w-full overflow-hidden">
      <p className="text-sm font-medium transition-all duration-500 ease-in-out">
        {promoMessages[currentIndex]}
      </p>
    </div>
  );
};

export default PromoBanner;
