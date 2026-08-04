import Image from "next/image";
    
import {
  ChevronDownIcon,
  ChevronRightIcon,
  MailIcon,
  PhoneIcon,
  UserIcon,
} from "lucide-react";
import ModernImagingSlider from "@/components/ModernImagingSlider";
import CustomerReviewsSlider from "@/components/CustomerReviewsSlider";
import FaqAccordion from "@/components/FaqAccordion";

export default function ModernImagingPage() {
  return (
    <div className=" space-y-6">
      <section>
        <div className="px-4 pt-4 text-center bg-gradient-to-b from-[#E6F8FF] to-[#FFFF]">
          <h2 className="text-3xl font-semibold tx-blue  mb-4">
            Digital X Ray
          </h2>
          <p className=" text-lg mb-0">
            The Radiology Department is equipped with DR (Digital radiography)
            system for the first time in a diagnostic centre in Haryana.
            FDR-DEVO is installed to reduce radiation dose and also give better
            quality instant radiographic images.
          </p>
          <div>
            <img
              src="/modern-imaging/detail.png"
              alt=""
              className="w-full mt-5"
            />
          </div>
        </div>
      </section>

      <section className="mb-0">
        <div className="px-4 py-6">
          <h2 className="text-2xl font-semibold mb-2 tx-blue ">
            Our Key Services
          </h2>
          <h5 className="font-bold">
            MDRC has also installed the most advanced CR system
          </h5>
          <p className="my-3">
            Profect One From Fujifilms The X-ray images with this CR system are
            always very sharp and clear. The images obtained can be
            post-processed to suit individual examination. MDRC was the first to
            install CR system in Haryana.
          </p>
          <p className="my-3">
            The Centre has installed two X-ray machines with image intensifier
            for excellent X-ray investigations in daylight condition at New
            Railway Road Centre.
          </p>
          <p className="my-3">
            MDRC centre at Sector 44, Gurugram has 50 kW/630 mA high frequency
            machine MARS 50 from Allengers with Image intensifier for high
            quality x-rays at lower radiation doses. Long cassete for spine and
            limbs in one film is available. MDRC also has US FDA approved system
            CR Classic from Carestream for high quality images.
          </p>

          <h5 className="font-bold">Dry Imaging</h5>
          <p className="my-2">
            Dry imager laser cameras have been installed for all the Imaging
            modalities. These cameras give instant films that do not require wet
            processing with chemicals and thus are very environment friendly.
            MDRC is the first centre in Haryana to have this completely dry
            imaging facility.
          </p>

          <h5 className="font-bold">Special X-ray Investigations</h5>
          <p className="my-2">
            Almost all special X-ray investigations are done in MDRC such as IVU
            (Intra-venous urography), Barium swallow, Barium meal upper GIT,
            Double and single contrast barium enema, HSG (
            Hystero-salpingography), Sinogram etc. The charges for special
            investigations includes the standard cost of non-ionic contrast
            unlike other centers which charge it separately or ask you to bring
            the contrast which shows are dedication to provide global quality
            services to patients at a affordable price.
          </p>

          <h5 className="font-bold">Image Intensifier</h5>
          <p className="my-2">
            Image Intensifier intensifies an image thousands of time its
            original, thereby enabling the X-ray image to be projected on a
            monitor and thus be seen in day light. This enables the
            investigation to be done in day light conditions instead of being
            done in the dark. There is also better visualization of the organs
            and hence there is better supervision during investigations and thus
            better quality of investigations are done. Image intensifier also
            substantially reduces the radiation dose to the patient and the
            operator.
          </p>
        </div>
      </section>

      <section>
        <div className=" mx-auto p-4 space-y-4">
          {/* X-Ray Scan List */}
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Book X-Ray Scans</h2>
            <ul className="space-y-1">
              <li className="flex items-center space-x-2 tx-blue ">
                <ChevronRightIcon className="h-5 w-5 tx-blue " />
                <span className="border-b">X-RAY ABDOMEN AP VIEW</span>
              </li>
              <li className="flex items-center space-x-2 tx-blue ">
                <ChevronRightIcon className="h-5 w-5 tx-blue " />
                <span className="border-b">X-RAY ABDOMEN LATERAL VIEW</span>
              </li>
              <li className="flex items-center space-x-2 tx-blue ">
                <ChevronRightIcon className="h-5 w-5 tx-blue " />
                <span className="border-b">
                  X-RAY LEFT KNEE AP STANDING VIEW
                </span>
              </li>
              <li className="flex items-center space-x-2 tx-blue ">
                <ChevronRightIcon className="h-5 w-5 tx-blue " />
                <span className="border-b">X-RAY LEFT KNEE LAT VIEW</span>
              </li>
            </ul>
          </div>

          {/* Callback Form */}
          <div className="bg-white p-4 rounded-lg shadow-lg space-y-4">
            <h3 className="text-xl font-semibold">Get a Call Back</h3>
            <form className="space-y-4">
              {/* Mobile Number Input */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter Your Mobile No.*"
                />
                <PhoneIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              </div>

              {/* Name Input */}
              <div className="relative">
                <input
                  type="text"
                  className="w-full p-3 pl-10 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Enter Your Name*"
                />
                <UserIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 h-5 w-5" />
              </div>

              {/* Location Select */}
              <div className="relative">
                <select className="w-full p-3 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option>Gurugram</option>
                  <option>Delhi</option>
                  <option>Chandigarh</option>
                </select>
              </div>

              {/* Message Input */}
              <div className="relative">
                <textarea
                  className="w-full p-3 pr-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Message"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-green-400 to-green-500 text-white rounded-md hover:from-green-500 hover:to-green-600"
              >
                Get a Call Back
              </button>
            </form>
          </div>
        </div>
      </section>

      <section>
        <div>
          <h2 className="text-2xl text-center font-medium">Other Imagings</h2>
        </div>
        <ModernImagingSlider images={[]} pageSlug={""} />
      </section>

      <section>
        <CustomerReviewsSlider />
      </section>

      <section className="pb-6">
        <FaqAccordion pageType={""} />
      </section>
    </div>
  );
}
