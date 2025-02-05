// components/AdsCard.js
import Image from 'next/image';

const AdsCard = ({
  imageUrl,
  title,
  description,
  price,
  buttonText = 'Buy Now'
}) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
      <div className="md:flex">
        {/* Image Section */}
        <div className="md:flex-shrink-0 relative h-48 w-full md:w-48">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            priority
          />
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>
            <p className="text-gray-600 text-sm mb-4 line-clamp-3">{description}</p>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-indigo-600">${price}</span>
            <button className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors duration-200">
              {buttonText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdsCard;