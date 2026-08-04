"use client";

import Image from "next/image";
import patho1 from "../../../public/assets/images/pathology-lab-information/patho-1.png";
import { ChevronRight } from "lucide-react";
import CustomerReviewsSlider from "@/components/CustomerReviewsSlider";
import { ContactInquiryModal } from "@/components/modals/ContactInquiryModal";
import React from "react";

const PathologyLabInfo = () => {
  const [openInquiry, setOpenInquiry] = React.useState(false);

  const fastingTests = [
    "Fasting Sugar",
    "Lipid Profile",
    "Insulin - Fasting",
    "Cortisol- Morning",
    "Vitamin D",
    "Vitamin B12",
    "HOMA-IR",
    "C-peptide fasting etc.",
  ];
  return (
    <>
      <div className="gradient-light-gray text-black">
        <div className="p-4 pt-10 pb-10 items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl mb-4 font-semibold tx-blue justify-items-center">
              Pathology Lab Tests Information
            </h1>
            <p className="text-[15px] text-black leading-[1.6] justify-items-center">
              Here are some guidelines which will help to prepare yourself
              better for various laboratory tests. Kindly contact our customer
              care team to know about any special instructions for sample
              collection.
            </p>
            <div className="justify-items-center mt-5">
              <div className="rounded-2xl shadow-[0_0_15px_rgba(0,0,0,0.15)]  bg-white overflow-hidden">
                <div
                  onClick={() => setOpenInquiry(true)}
                  className="gradient-blue gap-4  text-white px-4 py-3 flex justify-between items-center cursor-pointer"
                >
                  <p className="font-medium">Book an Appointment</p>
                  <span className="bg-white tx-blue  h-6 w-6 rounded-full flex items-center justify-center">
                    <ChevronRight size={20} className="text-gray-500" />
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex justify-center items-end relative mt-5">
            <Image
              src={patho1}
              alt="Microscope"
              width={400}
              height={100}
              priority
            />
          </div>
        </div>
      </div>
      <div className="bg-white px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* 1 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                1.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base mb-3">
                Although, its advisable to perform the tests on a fasting
                sample, except post-prandial or random samples, this helps us to
                minimize the interference of the factors affecting the result.
                There are some of the tests for which strict fasting is
                required( 8- 12 hours) in which light snack or morning tea is
                not taken.
              </p>
              <p className="text-gray-700 text-base mb-6">
                Some of the common test performed on fasting are:
              </p>

              <ul className="space-y-2 ml-2">
                {fastingTests.map((test, index) => (
                  <li
                    key={index}
                    className="flex items-center gap-3 text-gray-700 text-base mb-3"
                  >
                    <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                    <span>{test}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 2 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                2.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Smoking or eating just before sample collection is not
                advisable.
              </p>
            </div>
          </div>

          {/* 3 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                3.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Glucose test (Glucose tolerance, Fasting and Post prandial
                -Sugar) - Many sugar tests, might need sample collection at
                specified interval and time. Kindly stay in the lab during this
                duration as exertion can affect the glucose levels.
              </p>
            </div>
          </div>

          {/* 4 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                4.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Lipid Profile - Requires 10-12 hours of strict fasting (without
                drinks or food).
              </p>
            </div>
          </div>

          {/* 5 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                5.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Creatinine - Kindly refrain from eating meat as some studies
                have shown that eating meat, prior to testing can temporarily
                raise the creatinine level.
              </p>
            </div>
          </div>

          {/* 6 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                6.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Fecal Occult blood test: Its advisable to avoid, meat,
                painkillers, iron tablets, vitamin c tablets 3 days prior to
                sample collection as it can give a false result
              </p>
            </div>
          </div>

          {/* 7 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                7.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Fecal Occult blood test: Its advisable to avoid, meat,
                painkillers, iron tablets, vitamin c tablets 3 days prior to
                sample collection as it can give a false result
              </p>
            </div>
          </div>

          {/* 8 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                8.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                5-HIAA test - Avoid banana, kiwi, walnut, avocado, brinjal,
                pineapple, plum, tomato & drugs like Fluorouracil, Melphalan,
                Paracetamol & Acetaminophen, Heparin, L-dopa, Reserpine,
                Salicylates,
              </p>
            </div>
          </div>

          {/* 9 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                9.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Cortisol (Morning & Evening Sample): As the tests is affected by
                diurnal variation, overnight fasting is preferred for collecting
                morning sample. It should be drawn between 7-9 AM. 4 hr fasting
                is preferred for evening sample. It should be drawn between 3-5
                pm.
              </p>
            </div>
          </div>

          {/* 10 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                10.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Plasma Renin Activity: Overnight fasting is recommended. Patient
                should be ambulatory 2 hours prior to the test. Kindly contact
                the consulting physician regarding the medication.
              </p>
            </div>
          </div>

          {/* 11 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                11.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">Urine Culture sample:</p>
              <div className="space-y-4">
                <p className="text-gray-700 text-base">
                  For men – Clean the head of the penis with wet clean cotton.
                  Pull back the foreskin Rinse the cleaned area again with a new
                  wet cotton
                </p>
                <p className="text-gray-700 text-base">
                  For women – Hold labia apart and clean perineal area from
                  front to back with wet cotton ball
                </p>
                <ul className="space-y-2 ml-2">
                  <li className="flex items-center gap-3 text-gray-700 text-base">
                    <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                    <span>Remove the lid container</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-base">
                    <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                    <span>Begin urinating</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-base">
                    <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                    <span>
                      Put the container in the urine stream in between.
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-base">
                    <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                    <span>
                      When the container is filled two-third, close the lid
                      container.
                    </span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-base">
                    <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                    <span>Label it (Name, Date, Test type).</span>
                  </li>
                  <li className="flex items-center gap-3 text-gray-700 text-base">
                    <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                    <span>Give the sample to the collection staff.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* 12 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                12.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                24 hr Urine sample collection: Collect the collection bottle
                from the lab with added preservative
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-3 text-gray-700 text-base">
                  <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                  <span>First morning sample needs to be discarded.</span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 text-base">
                  <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                  <span>
                    Collect the samples afterwards till 24 hour( Example 7 am to
                    7 am).
                  </span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 text-base">
                  <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                  <span>
                    Drink liquid as taken regularly and do not drink alcohol.
                  </span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 text-base">
                  <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                  <span>Keep the sample refrigerated.</span>
                </li>
              </ul>
            </div>
          </div>

          {/* 13 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                13.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Semen Collection: 3- 5 days abstinence is recommended.
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-3 text-gray-700 text-base">
                  <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                  <span>
                    Sample needs to be collected in a sterile container.
                  </span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 text-base">
                  <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                  <span>
                    Onsite collection is recommended. However if you want to
                    collect the sample outside, kindly send the sample to lab
                    within 30 minutes. Sample should not be exposed to heat.
                  </span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 text-base">
                  <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                  <span>
                    Variation is the report can be present. Retest is generally
                    recommended.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 14 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                14.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                2Therapeutic Drug Monitoring (Cyclosporine C0 and C2 levels): C0
                levels: Just before the next dose, C2 levels: 2 hours after
                taking the dose.
              </p>
            </div>
          </div>

          {/* 15 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                15.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Fine needle aspiration cytology (FNAC): In this tests, cells are
                aspirated from the lump or swelling present on the body. Both
                Direct FNAC or Image guided FNAC can be done. Type of FNAC to be
                done is decided by the Pathologist after examining the patients.
              </p>
              <ul className="space-y-2 ml-2">
                <li className="flex items-center gap-3 text-gray-700 text-base">
                  <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                  <span>
                    No local Anaesthesia is needed. Most people do not feel any
                    pain during the procedure.
                  </span>
                </li>
                <li className="flex items-center gap-3 text-gray-700 text-base">
                  <span className="w-2 h-2 border-1 border-[#1160a5] rounded-full flex-shrink-0"></span>
                  <span>
                    At times there can be mild swelling , pain or haemaoatoma at
                    the site of FNAC. Cold compresses can be given afterward to
                    reduce it.
                  </span>
                </li>
              </ul>
            </div>
          </div>

          {/* 16 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                16.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Reporting time can be confirmed by the collection staff.
              </p>
            </div>
          </div>

          {/* 17 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                17.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Online reports are also available.
              </p>
            </div>
          </div>

          {/* 18 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                18.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                For some of the tests Amniotic Fluid, Cord blood Karyotyping,
                NIPT test, PGS AND PGD PNDT form is mandatory with ID-proof and
                photo
              </p>
            </div>
          </div>

          {/* 19 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                19.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                HLA-Typing and Paternity tests need ID-Proof along with
                photograph with written consent.
              </p>
            </div>
          </div>

          {/* 20 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                20.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                Kindly bring consulting doctors prescription with previous
                history and tests reports which are stored at our system and are
                helpful in correlating reports.
              </p>
            </div>
          </div>

          {/* 21 */}
          <div className="flex gap-4">
            <div className="flex-shrink-0">
              <span className="inline-flex items-center font-semibold justify-center tx-blue text-lg">
                21.
              </span>
            </div>
            <div className="flex-1 space-y-4">
              <p className="text-gray-700 text-base">
                You can discuss the reports telephonically or personally with
                Doctor if needed.
              </p>
            </div>
          </div>
        </div>
      </div>

      <CustomerReviewsSlider />
      <ContactInquiryModal
        isOpen={openInquiry}
        onClose={() => setOpenInquiry(false)}
      />
    </>
  );
};

export default PathologyLabInfo;
