
const TopHeader = () => {
  return (
    <div className="w-full bg-gradient-to-r from-[#1160A5] to-[#189ED3] text-white text-xs">
      <div className="flex items-center justify-between px-3 py-2">

        {/* Left: Download App */}
        <div className="flex items-center gap-1 font-medium text-[10px]">
          <img
            src="/assets/svg/mobile-phone.svg"
            alt="Download App"
            className="h-3 w-3"
          />
          <span>Download Mobile App</span>
        </div>

        {/* Right: Phone Numbers */}
        <div className="flex items-center gap-2 text-[10px]">

          <span>0124-6712000</span>
          <span className="opacity-70">/</span>
          <span>0124-6713000</span>
        </div>

      </div>
    </div>
  );
};

export default TopHeader;
 