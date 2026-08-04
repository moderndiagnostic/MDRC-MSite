"use client";
import CustomerReviewsSlider from "@/components/CustomerReviewsSlider";
import { ContactInquiryModal } from "@/components/modals/ContactInquiryModal";
import React, { useEffect, useState } from "react";

const ImagingTestInformation: React.FC = () => {
  const [currentImage, setCurrentImage] = useState(0);
  const [openInquiry, setOpenInquiry] = useState(false);

  const heroImages = [
    "assets/images/imagning-test/scanner-1.webp",
    "assets/images/imagning-test/scanner-2.webp",
    "assets/images/imagning-test/scanner-3.webp",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length);
    }, 5000); // Change image every 2 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <div className="bg-white min-h-screen">
        {/* Hero Section - Blue Background */}
        <section className="bg-gradient-to-br from-[#0f5ba1] to-[#1d7fbb] text-white px-4 py-10 pb-0">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold mb-4">
              Information For Your Tests
            </h1>

            <p className="text-sm leading-relaxed mb-6 opacity-95">
              We recommend prior appointment for all the tests to avoid waiting
              period at the Centre. Appointment is a must for ultrasound or CT
              Guided Biopsy, Echocardiography, TMT, Holter, Executive Health
              check etc. Still, due to unforeseen delays due to detailed
              investigation in patients prior to your appointment, there can be
              a little delay in the designated appointment time.
            </p>

            <div className="flex justify-center">
              <div
                onClick={() => setOpenInquiry(true)}
                className="bg-[#FF6B4A] text-white cursor-pointer font-medium px-6 py-3 rounded-full mb-8 shadow-lg flex items-center"
              >
                Book an appointment
                <svg
                  className="w-4 h-4 ml-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </div>

            {/* CT Scanner Image Placeholder */}
            <div className="flex justify-center mt-8 pb-10">
              <div className="relative w-full max-w-xs">
                {heroImages.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Medical Equipment ${index + 1}`}
                    className={`w-full transition-opacity duration-500 ${
                      index === currentImage
                        ? "opacity-100"
                        : "opacity-0 absolute top-0 left-0"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Main Content */}
        <div className="max-w-md mx-auto px-4 py-6">
          {/* Ultrasound Section */}
          <section className="mb-8">
            <div className="mb-4">
              <img
                src="assets/images/imagning-test/ultrasound.jpg"
                alt="Ultrasound"
                className="w-full rounded-tl-[50px] rounded-br-[50px]"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3">Ultrasound</h2>

            <h3 className="text-base font-semibold text-gray-900 mb-2">
              When to come empty stomach?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              All ultrasound examinations of upper abdomen or whole abdomen
              require you to come empty stomach. This is essentially to see gall
              bladder in distended condition. However, practically we are able
              to see it well in most of the patients and as a rule, we do not
              recommend empty stomach. But once in a while, if gall bladder is
              completely contracted, we may suggest you to come empty stomach
              again.
            </p>
          </section>

          {/* Full Bladder Section */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              When to come full bladder?
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Generally all lower abdomen and whole abdomen examinations require
              full urinary bladder. Also, examinations of KUB and early
              pregnancy (generally up to 3-4 months) will require full bladder.
              Full bladder means you have to take lot of water at least 1-2 hrs
              before examination and not pass urine. A well distended urinary
              bladder helps in seeing uterus, ovaries and adnexa properly in
              females and prostate in males. It also helps in seeing small
              stones in bladder and ureters in KUB examination.
            </p>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              It is important to note that an urge to pass urine does not
              indicate you are having full bladder. This may be due to infection
              or enlargement of prostate.
            </p>

            <p className="text-sm text-gray-700 leading-relaxed">
              A really full bladder will make you uncomfortable. We need you to
              have full bladder, but you should be comfortable. For these
              examinations, come with some margin to wait as your turn may not
              come immediately on reaching clinic.
            </p>
          </section>

          {/* Examination of Children */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              Examination of children
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Examination of small children is difficult if they are crying. A
              well satisfied child is less prone to crying. We do not normally
              recommend children to be empty stomach except in some situations
              where it can be necessary for investigation. Sometimes child may
              need to be sedated.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">
              When you come in for your ultrasound examination for pregnancy?
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Drink 2 to 3 glasses of fruit juice/Water 20-30 minutes prior to
              the appointment unless otherwise ordered by your physician. We
              would also like some fluids in your bladder to bring the baby's
              head out of the pelvis, but it does not need to be extremely full.
            </p>
          </section>

          {/* CT Scan Section */}
          <section className="mb-8 bg-[#FCE4EC] px-4 py-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              CT Scan Examination
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Most of the examination will require administration of contrast.
              This is generally so when we suspect infective/inflammatory
              pathology or mass lesion. Contrast is also administered for
              vascular studies and other special applications. Reports for
              kidney function such as blood urea, serum creatinine or any other
              investigation that may have been done for kidneys should be
              brought with the patient at the time of examination. Any history
              of diabetes and drugs that are being taken should also be
              available.
            </p>

            <div>
              <img
                src="assets/images/imagning-test/ct-scan.jpg"
                alt="CT Scan"
                className="w-full rounded-tl-[50px] rounded-br-[50px] mb-4"
              />
            </div>

            {/* CT Coronary Angiography */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1976D2] mb-3">
                CT Coronary Angiography
              </h2>

              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Contrast administration
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed mb-4">
                Most of the examination will require administration of contrast.
                This is generally so when we suspect infective/inflammatory
                pathology or mass lesion. Contrast is also administered for
                vascular studies and other special applications. Reports for
                kidney function such as blood urea, serum creatinine or any
                other investigation that may have been done for kidneys should
                be brought with the patient at the time of examination. Any
                history of diabetes and drugs that are being taken should also
                be available.
              </p>

              <h3 className="text-xl font-bold text-[#1976D2] mb-3">
                CT Coronary Angiography
              </h3>
              <p className="text-sm text-gray-700 leading-relaxed">
                It is preferable to be fasting three hours prior to the test.
                You can take water one or two glasses of water, one hour prior
                to investigation. Please bring all your relevant medical records
                such as any procedure done, creatinine level, sugar level and
                details of drugs being used. After the procedure, we advise you
                to again take 3-4 glasses of water in the next 2 hours.
              </p>
            </section>

            {/* Upper and Whole Abdomen */}
            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1976D2] mb-3">
                Upper abdomen and whole abdomen examinations
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                It is essential to come with overnight fasting for these
                examinations. Investigations will take 2-3 hrs or even more to
                complete as generally oral contrast is given and it takes time
                to reach Colon. We normally do not ask patient to come with full
                bladder as it will generally fill during the course of
                administration of oral contrast. However, you are required not
                to pass urine during this examination. For KUB and lower abdomen
                examinations There is no need of fasting for these examinations
                but full bladder is a requirement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1976D2] mb-3">
                Head examinations
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Normally no preparation is required for these examinations. But
                in case of children and those with neurological problems,
                patient may need to be sedated/anaesthetized as proper
                investigation can not be done, if the patient is moving his/her
                head.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-bold text-[#1976D2] mb-3">
                Allergy to drugs and contrast media
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed mb-3">
                Though we use non-ionic contrast media which has very few
                reactions, however, a severe reaction is a possibility. If you
                are allergic to any drug or contrast media, you must tell us
                before the test is conducted. This may require modification and
                different planning for examination. Your Creatinine levels
                should be known. If you are diabetic, then the history of the
                drugs you are taking should be known.
              </p>
            </section>
          </section>

          {/* PET-CT Scan*/}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              PET-CT Scan
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              PET CT is a diagnostic imaging test primarily used for detection
              of cancer and several other ailments. The PET-CT Scan is a test
              that is done on a special PET-CT Machine which performs the 2
              scans together. In the Whole Body PET CT Scan a single scanner
              performs CT Scan for anatomical Image capture and a PET Scan
              (Positron emission mission Tomography) for measuring molecular
              imaging uptake of radiopharmaceutical isotopes, most common of
              which is the 18F-FDG Isotope. The Whole Body FDG PET CT scan is
              most commonly used for studying cancer, and has since decades
              played an instrumental role in the medical industry's fight
              against cancer by enabling better cancer diagnostics.
            </p>

            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              Types of PET-CT Scan
            </h3>
            <ul className="list-disc text-sm pl-5 space-y-2 text-gray-800 mb-3">
              <li>
                Your doctor will advise you which tracer is best for your PET CT
                Scan. The following PET Scan tracers and protocols are available
                with HOD:
              </li>
              <li>
                <strong>PET Scan Whole Body:</strong> Whole Body 18F-FDG PET CT
                Scan (18F-Fluoro Deoxy Glucose). This is the most common scan
                and comprises 90% of all PET Scan.
              </li>
              <li>
                <strong>For Prostate:</strong> Ga68 labelled PSMA (Prostate
                Specific Membrane Antigen) PSMA PET CT Scan. PSMA is better at
                localizing cases of Prostate Cancer as compared to Whole Body
                FDG PET Scan.
              </li>
              <li>
                <strong>For Neuro Endocrine Tumors:</strong> Ga68 labelled DOTA
                DOTA PET-CT Scan. DOTA is better at localizing cases of NETs
                (Neuro Endocrine Tumors) as compared to Whole Body FDG PET Scan.
              </li>
              <li>
                <strong>For Abdomen:</strong> Whole Body FDG PET-CT with Triple
                Phase CT Upper Abdomen.
              </li>
            </ul>

            <h3 className="text-sm font-semibold text-gray-900 mb-3">
              For Cardiac Viability Assessment:{" "}
              <span className="font-normal">
                {" "}
                Cardiac PET-CT (FDG PET CT Scan + Cardiac Test Component on a
                Gamma Camera).
              </span>
            </h3>
          </section>

          {/* SPECT Scan */}
          <section className="mb-8 bg-[#FCE4EC] px-4 py-6 rounded-lg">
            <h2 className="text-xl font-bold text-gray-900 mb-3">SPECT Scan</h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              A SPECT Scan (Single Photon Emission Computed Tomography) is a
              sophisticated nuclear imaging test that creates detailed 3D maps
              of how your organs function. While traditional imaging focuses on
              physical structure, SPECT uses a radioactive tracer and a rotating
              gamma camera to track blood flow and biological activity in
              real-time. This functional insight is critical for diagnosing
              heart conditions, brain disorders, and deep-seated bone issues
              that standard scans might overlook.
            </p>

            <ul className="list-disc text-sm pl-5 space-y-2 text-gray-800 mb-3">
              <li>
                <strong>Functional Imaging :</strong>Analyzes organ performance
                and blood flow rather than just anatomy.
              </li>
              <li>
                <strong>Neurological Insight : </strong> Essential for
                evaluating seizures, memory loss, and brain blood flow.
              </li>
              <li>
                <strong>Cardiac & Bone Health : </strong> Pinpoints heart muscle
                viability and detects hidden fractures or infections.
              </li>
            </ul>
          </section>

          {/* MRI Examination */}
          <section className="mb-8">
            <div className="mb-4">
              <img
                src="assets/images/imagning-test/mri-scan.jpg"
                alt="MRI Scanner"
                className="w-full rounded-tl-[50px] rounded-br-[50px]"
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 mb-3">
              MRI Examination
            </h2>

            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Upper/ whole abdomen examinations/MRCP
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              You have to come empty stomach and no fluid such as water just
              before the examination.
            </p>

            <h3 className="text-base font-semibold text-gray-900 mb-2">
              KUB and lower abdomen examinations
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              Patient is required to be full bladder i.e. urinary bladder should
              be full.
            </p>
          </section>

          {/* Contrast Administration */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1976D2] mb-3">
              Contrast administration
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed">
              Though in most of the examinations, contrast is not used. But some
              examinations will require administration of contrast. This is
              generally so when we suspect infective/inflammatory pathology or
              mass lesion. Sometimes contrast is administered for vascular
              studies and other special applications. Reports for kidney
              function such as blood urea, serum creatinine or any other
              investigation that may have been done for kidneys should be
              brought with the patient at the time of examination. Any history
              of allergy to drugs, diabetes and drugs that are being taken for
              treatment should be available.
            </p>
          </section>

          {/* X-Ray Examination */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-900 mb-3">
              X-Ray Examination
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              Generally no preparation is required for routine x-ray
              examinations. But x-ray of abdomen/ KUB/ LS spine will require you
              to have preparation from the night before the appointment with
              charcoal/unienzyme and some laxatives. Special X-ray
              investigations will require additional preparations and these will
              be given to you at the time of appointment itself.
            </p>

            <div>
              <img
                src="assets/images/imagning-test/x-ray.jpg"
                alt="X-Ray Room"
                className="w-full rounded-lg"
              />
            </div>
          </section>

          {/* Bone Densitometry */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1976D2] mb-3">
              Bone Densitometry & PFT
            </h2>
            <p className="text-sm text-gray-700 leading-relaxed">
              Does not require any preparations.
            </p>
          </section>

          {/* TMT, Echo & Stress Echo */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1976D2] mb-3">
              TMT, Echo & Stress Echo
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Do not come for these investigations immediately after taking
              meals. Please bring your previous ECG, X-ray Chest and any other
              investigation that you got done earlier. It is important for your
              study.
            </p>

            <p className="text-sm text-gray-900 font-semibold">
              Small Children will be required to be sedated for
              Echocardiography.
            </p>
          </section>

          {/* Pregnant Women */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1976D2] mb-3">
              Pregnant Women
            </h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Pregnant women are advised not to get an X-ray based
              investigations like X-ray, OPG Scan, CT Scan, Mammography etc.
              However, in some circumstances, if clinician requires the
              investigation, kindly inform the radiologist at the Centre about
              your status.
            </p>

            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              As per the new Govt guidelines, patient who wish to undergo a
              pregnancy Ultrasound must furnish a photo Identity such as Aadhar
              Card, Driving License, PAN card, Ration Card, Passport etc **.
              Original prescription of qualified doctor for the examination is
              also must. You will also be required to fill a form and sign it.
            </p>
          </section>

          {/* Neurology */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-[#1976D2] mb-3">Neurology</h2>

            <p className="text-sm text-gray-700 leading-relaxed mb-4">
              For EEG investigation patient should come with clean scalp. Head
              should not be greasy and there should be no oil in hair prior to
              investigation.
            </p>

            <div className="text-sm text-red-600 font-medium">
              ** Failure to produce the above mentioned documents may result in
              denial of the test.**
            </div>
          </section>
        </div>

        <CustomerReviewsSlider />
      </div>
      <ContactInquiryModal
        isOpen={openInquiry}
        onClose={() => setOpenInquiry(false)}
      />
    </>
  );
};

export default ImagingTestInformation;
