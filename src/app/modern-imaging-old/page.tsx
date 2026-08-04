import Image from "next/image";
import FaqAccordion from "@/components/FaqAccordion";
import ModernImagingSlider from "@/components/ModernImagingSlider";

export default function ModernImagingPage() {
  return (
    <div className=" space-y-6">
      <section>
        {/* Title */}
        <div className="px-4 pt-4 text-center bg-gradient-to-b from-[#E6F8FF] to-[#FFFF]">
          <h2 className="text-3xl font-semibold tx-blue  mb-4">
            Our Radiology Imaging Centres
          </h2>
          <p className=" text-lg mb-0">
            Our Imaging Centres at Gurgaon are highly equipped with
            state-of-the-art technology to provide accurate and reliable
            diagnostic reports.
          </p>
        </div>
        {/* <ModernImagingSlider /> */}
      </section>

      <section>
        <div className=" py-6 px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-semibold tx-blue  mb-4">
              Our Specialities
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              All Diagnostic Services Under One Roof
            </p>

            <div className="space-y-6">
              {/* Routine Testing Card */}
              <div className="flex items-center bg-gradient-to-r from-green-100 to-white rounded-lg p-6 shadow-lg space-x-4">
                <div className="text-green-500">
                  <Image
                    src="/modern-imaging/r-t.png" // Replace with your image path
                    alt="Routine Testing"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">Routine Testing</h3>
                  <p className="text-sm text-left text-gray-500">
                    Routine investigations coverage from wellness to illness
                  </p>
                </div>
              </div>

              {/* Pathology Services Card */}
              <div className="flex items-center bg-gradient-to-r from-green-100 to-white rounded-lg p-6 shadow-lg space-x-4">
                <div className="text-green-500">
                  <Image
                    src="/modern-imaging/p-s.png" // Replace with your image path
                    alt="Pathology Services"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">Pathology Services</h3>
                  <p className="text-sm text-left text-gray-500">
                    Super specialized department to diagnose autoimmune
                    disorders
                  </p>
                </div>
              </div>

              {/* Genomic Testing Card */}
              <div className="flex items-center bg-gradient-to-r from-green-100 to-white rounded-lg p-6 shadow-lg space-x-4">
                <div className="text-green-500">
                  <Image
                    src="/modern-imaging/g-t.png" // Replace with your image path
                    alt="Genomic Testing"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">Genomic Testing</h3>
                  <p className="text-sm text-left text-gray-500">
                    Advanced genetic testing to know your health risks
                  </p>
                </div>
              </div>

              {/* Radiology Card */}
              <div className="flex items-center bg-gradient-to-r from-green-100 to-white rounded-lg p-6 shadow-lg space-x-4">
                <div className="text-green-500">
                  <Image
                    src="/modern-imaging/radiology.png" // Replace with your image path
                    alt="Radiology"
                    width={50}
                    height={50}
                  />
                </div>
                <div className="flex-1 text-left">
                  <h3 className="font-bold text-lg">Radiology</h3>
                  <p className="text-sm text-left text-gray-500">
                    Advanced Medical Imaging procedures for your health
                    diagnosis
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="my-8 px-4">
        <div className="rounded-3xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.15)]">
          <img
            src="/assets/images/why-modern-diagnostics/why-modern-diagnostic-img.png"
            alt="Why Modern Diagnostic"
            className="w-full h-auto object-cover"
          />
        </div>
      </section>

      <section>
        <div className="mx-4 my-8">
          <div className="rounded-3xl gradient-light-blue  shadow-md   px-4 py-6">
            <h2 className="text-2xl font-bold text-center text-gray-800">
              Our Foundation of Trust
            </h2>
            <p className="text-center text-gray-500 mt-2">
              Decades of experience & A network of certified labs.
            </p>

            <div className="grid grid-cols-2 gap-2 mt-2">
              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/certified.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">NABH & NABL</p>
                  <p className="text-sm text-gray-500">Certified Labs</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/experience.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">40+</p>
                  <p className="text-sm text-gray-500">Years Of Experience</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/labs.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">30+</p>
                  <p className="text-sm text-gray-500">Labs in India</p>
                </div>
              </div>

              <div className="flex gap-4 items-center">
                <img src="/assets/images/icon/customers.svg" className="" />
                <div>
                  <p className="font-semibold tx-light-blue ">1.5 Crore+</p>
                  <p className="text-sm text-gray-500">Satisfied Customers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section>
        <div className="gradient-green p-3">
          <h2 className="text-xl text-center text-white font-semibold mb-6">
            Get Safe Testing with MODERN Labs
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {/* First Icon Section */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/50 p-2 rounded-full shadow-md">
                <Image
                  src="/modern-imaging/call.png"
                  alt="icon"
                  width={120}
                  height={100}
                />
              </div>
              <p className="text-white">
                Call and schedule an appointment with our Health Expert
              </p>
            </div>
            {/* Second Icon Section */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/50 p-2 rounded-full shadow-md">
                <Image
                  src="/modern-imaging/schedule.png"
                  alt="icon"
                  width={150}
                  height={100}
                />
              </div>
              <p className="text-white">
                We will Schedule appointment as per your availability and pick
                sample from your home
              </p>
            </div>
            {/* Third Icon Section */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/50 p-2 rounded-full shadow-md">
                <Image
                  src="/modern-imaging/lab.png"
                  alt="icon"
                  width={100}
                  height={100}
                />
              </div>
              <p className="text-white">
                High Quality Lab testing done in our Accredit Labs
              </p>
            </div>
            {/* Fourth Icon Section */}
            <div className="flex items-center space-x-4">
              <div className="bg-white/50 p-2 rounded-full shadow-md">
                <Image
                  src="/modern-imaging/test-r.png"
                  alt="icon"
                  width={150}
                  height={100}
                />
              </div>
              <p className="text-white">
                Get your test reports over whatsapp or Download from your web
                account
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-6">
        <FaqAccordion pageType={""} />
      </section>
    </div>
  );
}
