import React, { useState, type MouseEvent } from 'react';
import { ShoppingCart, ShoppingBag } from 'lucide-react';
 
interface AddToCartProps {
  /** If true, clicking again will revert to 'Add to Cart'. Default is false. */
  allowToggle?: boolean;
  /** Optional callback function for parent components */
  onStatusChange?: (isAdded: boolean) => void;
}
 
const AddToCartButton: React.FC<AddToCartProps> = ({
  allowToggle = false,
  onStatusChange
}) => {
  const [isAdded, setIsAdded] = useState<boolean>(false);
 
  const handleClick = (e: MouseEvent<HTMLButtonElement>): void => {
    // If allowToggle is false and it's already added, do nothing (Locked)
    if (!allowToggle && isAdded) return;
   
    const newState = !isAdded;
    setIsAdded(newState);
   
    // Trigger callback if provided
    if (onStatusChange) {
      onStatusChange(newState);
    }
  };
 
  return (
<button
  onClick={handleClick}
  disabled={!allowToggle && isAdded}
  aria-label={isAdded ? "Remove from cart" : "Add to cart"}
  className={`
    group relative flex items-center justify-center
    w-full h-12 rounded-lg font-semibold text-white overflow-hidden
    transition-all duration-500 cubic-bezier(0.4, 0, 0.2, 1)
    shadow-md
    ${isAdded
      ? 'bg-green-500 shadow-green-200'
      : 'bg-gradient-to-r from-[#f83a3a] to-[#f13c77] shadow-red-200 hover:shadow-lg hover:brightness-110 active:scale-95'
    }
    ${(!allowToggle && isAdded) ? 'cursor-default' : 'cursor-pointer'}
  `}
>

      {/* Sliding Wrapper */}
      <div
        className={`
          absolute inset-0 flex flex-col items-center justify-center
          transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isAdded ? '-translate-y-1/2' : 'translate-y-0'}
        `}
        style={{ height: '200%' }}
      >
       
        {/* State 1: Add to Cart */}
        <div className="h-1/2 w-full flex items-center justify-center gap-2 px-4">
          <ShoppingCart
            size={20}
            className="transition-transform duration-300 group-hover:-translate-x-1 group-hover:-rotate-6"
          />
          <span className="whitespace-nowrap">Add to Cart</span>
        </div>
 
        {/* State 2: Added */}
        <div className="h-1/2 w-full flex items-center justify-center gap-2 px-4">
          <ShoppingBag
            size={20}
            className={isAdded ? "animate-bounce" : ""}
          />
          <span className="whitespace-nowrap">Added</span>
        </div>
       
      </div>
    </button>
  );
};
 
export default AddToCartButton;