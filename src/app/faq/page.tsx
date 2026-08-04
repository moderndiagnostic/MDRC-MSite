'use client'
import React, { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
 
// JSON data for FAQ
const faqData = [
   {
    "question": "What is Radiology?",
    "answer": "Radiology is a branch of medical imaging that uses various techniques such as X-rays, MRI (Magnetic Resonance Imaging), CT (Computed Tomography) scans, and ultrasound to visualize the internal structures of the body. These images help doctors diagnose and monitor medical conditions."
  },
  {
    "question": "What is the difference between an X-ray and an MRI?",
    "answer": "X-rays use ionizing radiation to create images of bones and tissues, making them suitable for detecting fractures and some diseases. MRI, on the other hand, uses strong magnetic fields and radio waves to create detailed images of soft tissues, making it useful for identifying issues like tumors and nerve problems."
  },
  {
    "question": "How should I prepare for a radiological procedure?",
    "answer": "Preparation varies depending on the procedure. Generally, you might need to avoid eating or drinking before certain scans, remove metal objects, and inform the technologist about any medical implants or conditions you have. Some tests are walk-in based, they can be carried out without any prior preparation.Your healthcare provider will provide specific instructions based on the test." },
  {
    "question": "Is radiation from X-rays and CT scans harmful?",
    "answer": "While radiation exposure from medical imaging is typically low and considered safe. In many cases, the radiation received is equivalent to radiation exposure received while travelling in an airplane."
  },
  {
    "question": "How soon will I get the results of my radiology test?",
    "answer": "The timing of results can vary. In some cases, you might receive initial findings immediately after the test, while detailed reports may take a day or two to process. Your healthcare provider will discuss the timeline with you and explain the results in the context of your medical condition."
  },
  {
    "question": "Can I customize this package by adding or removing specific tests?",
    "answer": "The Allergy Food Panel can not be customized. However, Modern Diagnostic offers multiple packages designed keeping different needs of patients in mind."
  },
  {
    "question": "What is the Well Women Day Package?",
    "answer": "The Well Women Day Package is a comprehensive health screening designed for women's wellness. It includes vital tests like thyroid profiles, bone density scans, and various blood screenings to monitor overall health."
  },
  {
    "question": "Can I customize this package by adding or removing specific tests?",
    "answer": "The Well Women Day Package can not be customized. However, Modern Diagnostic offers multiple packages designed keeping different needs of patients in mind."
  },
  {
    "question": "What is the Fever Panel?",
    "answer": "The Fever Panel is an especially designed package offered by Modern Diagnostic. It comprises 51 tests across multiple categories designed to diagnose the cause of fever and related symptoms."
  },
  {
    "question": "Can I customize this package by adding or removing specific tests?",
    "answer": "The Fever Panel is not customizable. However, Modern Diagnostic offers multiple packages designed keeping different needs of patients in mind."
  },
  {
    "question": "What is the Active Men Package For Men < 40 Years?",
    "answer": "The Active Men Package For Men < 40 Years is a specially designed health check-up package offered by Modern Diagnostic to cater to the health needs of men under the age of 40. It consists of 12 essential tests."
  },
  {
    "question": "Can I customize this package by adding or removing specific tests?",
    "answer": "The Active Men Package For Men < 40 Years can not be customized. However, Modern Diagnostic offers multiple packages designed keeping the different needs of patients in mind."
  },
  {
    "question": "What is the Whole Body Blood Screening Package?",
    "answer": "The Whole Body Blood Screening Package is a complete health check-up package offered by Modern Diagnostic. It consists of 90 essential tests across 13 categories to provide a thorough assessment of a patient’s health."
  },
  {
    "question": "Can I customize this package by adding or removing specific tests?",
    "answer": "The Whole Body Blood Screening Package can not be customized. However, Modern Diagnostic offers multiple packages designed keeping different needs of patients in mind."
  }
]
const FaqPage: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
 
  const toggleAnswer = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };
 
  return (
    <div className="max-w-4xl mx-auto p-6 bg-[#f2f2f2]">
      <h2 className="text-xl text-[#0a6baf] mb-6">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqData.map((faq, index) => (
          <div
            key={index}
            className="bg-white shadow-md p-4 border border-gray-300"
          >
            <div
              className="flex justify-between items-start cursor-pointer text-lg font-semibold text-gray-800"
              onClick={() => toggleAnswer(index)}
            >
              {/* Added a span for the text to ensure it takes up remaining space */}
              <span className="pr-4">{faq.question}</span>
             
              {/* FIX: Added 'flex-shrink-0' to prevent the icon from resizing
                  based on the text length. Added fixed 'w-6 h-6' for total consistency.
              */}
              <div className="flex-shrink-0 mt-1">
                {openIndex === index ? (
                  <ChevronUpIcon className="h-6 w-6 text-gray-600" />
                ) : (
                  <ChevronDownIcon className="h-6 w-6 text-gray-600" />
                )}
              </div>
            </div>
            {openIndex === index && (
              <div className="mt-2 text-gray-600 border-t border-gray-100 pt-2">
                {faq.answer}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
 
export default FaqPage;
 