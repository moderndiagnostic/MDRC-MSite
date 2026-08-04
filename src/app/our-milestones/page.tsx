"use client";

import { useEffect, useState } from "react";
import { applyClientMeta } from "@/utils/applyClientMeta";
import {
  ChevronDown,
  ChevronRight,
} from "lucide-react";

interface Milestone {
  year: number;
  title: string;
  description?: string;
  image?: string;
}

const milestones: Milestone[] = [
  {
    year: 2023,
    title:
      "First and only one in India to do comprehensive testing of Psychiatric Drugs by LCMS/MS - TDM (Therapeutic Drug Monitoring)",
    description:
      "At Modern Diagnostic, we understand the critical importance of precise therapeutic drug monitoring in psychiatric care. Our advanced LCMS/MS-based testing enables clinicians to optimize treatment, ensure drug safety, and improve patient outcomes through accurate dosage monitoring.",
    image: "/images/milestone-doctor.jpg",
  },
  {
    year: 2018,
    title: "First Siemens Atellica installation in whole of UAE / ASIA",
    description:
      "MDRC achieved a major technological milestone by becoming the first diagnostic centre in UAE and Asia to install Siemens Atellica systems, significantly enhancing automation, throughput, and accuracy in laboratory diagnostics.",
    image: "/images/milestone-lab.jpg",
  },
  {
    year: 2014,
    title: "First NABL Accredited private lab in Haryana",
    description:
      "MDRC became the first private diagnostic laboratory in Haryana to receive NABL accreditation, reinforcing our commitment to quality, accuracy, and compliance with international laboratory standards.",
  },
  {
    year: 2010,
    title:
      "First Siemens Dual Source Energy Cardiac CT in private Diagnostic Centre in NCR",
    description:
      "By introducing Siemens Dual Source Energy Cardiac CT, MDRC enabled faster and more precise cardiac imaging, setting new benchmarks in non-invasive cardiac diagnostics across the NCR region.",
  },
  {
    year: 2008,
    title: "First NABL Accredited private lab in Gurgaon",
    description:
      "MDRC continued its quality-driven expansion by becoming the first NABL accredited private diagnostic laboratory in Gurgaon, ensuring globally accepted diagnostic practices for patients.",
  },
  {
    year: 2004,
    title: "First MRI installation in a private diagnostic centre in Haryana",
    description:
      "MDRC pioneered advanced imaging in Haryana by installing the first MRI system in a private diagnostic centre, bringing world-class imaging services closer to patients.",
  },
  {
    year: 1998,
    title: "First mammography machine installation in Gurugram",
    description:
      "With the installation of the first mammography machine in Gurugram, MDRC strengthened early breast cancer detection and women’s healthcare services in the region.",
  },
  {
    year: 1995,
    title: "First CT Scan facility in Gurugram",
    description:
      "MDRC established the first CT scan facility in Gurugram, marking a significant leap forward in diagnostic imaging and emergency care diagnostics.",
  },
  {
    year: 1986,
    title: "First Ultrasound facility in Gurugram",
    description:
      "MDRC began its diagnostic journey by introducing the first ultrasound facility in Gurugram, laying the foundation for decades of innovation and excellence in diagnostics.",
  },
];


const MilestoneCard = ({
  milestone,
  open,
  onToggle,
}: {
  milestone: Milestone;
  open: boolean;
  onToggle: () => void;
}) => {
  return (
    <div className="mb-4">
      <div
        onClick={onToggle}
        className={`flex rounded-md shadow-md overflow-hidden cursor-pointer
          border transition ${open ? "border-blue-300" : "border-gray-200"
          } bg-white`}
      >
        <div className="w-[70px] bg-gradient-to-b from-[#005C96] to-[#15AEE5] flex flex-col items-center justify-center text-white">
          <span className="text-lg">🚩</span>
          <span className="text-sm font-semibold mt-1">{milestone.year}</span>
        </div>

        <div className="flex-1 px-4 py-3 flex justify-between gap-3">
          <p className="text-sm font-medium text-gray-800 leading-snug">
            {milestone.title}
          </p>

          <div className="w-6 h-6 rounded-md border border-green-400 flex items-center justify-center shrink-0">
            {open ? (
              <ChevronDown size={14} color="green" />
            ) : (
              <ChevronRight size={14} color="green" />
            )}
          </div>
        </div>
      </div>

      {open && milestone.description && (
        <div className="bg-gradient-to-b from-[#E6F8FF] to-[#FFFFFF] rounded-b-xl px-4 py-4 space-y-4">
          <p className="text-sm text-gray-600 leading-relaxed">
            {milestone.description}
          </p>
          {milestone.image && (
            <img
              src="/assets/images/doctor/test.svg"
              alt="Milestone"
              className="w-full rounded-2xl object-cover"
            />
          )}
        </div>
      )}
    </div>
  );
};

const OurMilestones = () => {
  const [active, setActive] = useState<number | null>(0);

  useEffect(() => {
    applyClientMeta({
      title: "Our Milestones and Achievements | Modern Diagnostic",
      description:
        "Modern Diagnostic & Research Centre’s amazing healthcare journey, where we blend innovation with excellence. Dive into advanced diagnostics, groundbreaking research, and our strong commitment to redefining healthcare standards.",
      keywords:
        "Modern Diagnostic, Healthcare Milestones, Diagnostic Excellence, Medical Research, Transformative Healthcare, best diagnostic lab in India",
    });
  }, []);


  return (
    <div className="bg-white">
      <div className="bg-gradient-to-r from-[#1160A5] to-[#189ED3] text-white p-4">
        <h2 className="text-lg font-semibold">Our Milestone</h2>
        <p className="text-sm opacity-90">
          Our Legacy of Accuracy - 40+ years of defining standards in diagnostic
          excellence (1985–2025)
        </p>
      </div>

      <div className="px-4 pt-6 pb-2">
        <img
          src="/assets/images/doctor/milestone.svg"
          alt="img"
          className="mb-8 w-full"
        />
        {milestones.map((m, i) => (
          <MilestoneCard
            key={m.year}
            milestone={m}
            open={active === i}
            onToggle={() => setActive(active === i ? null : i)}
          />
        ))}
      </div>

      <section>
        <div className="px-4 py-6 space-y-6 bg-gray-100">
          {/* STATS */}
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                value: "40+",
                label: "Years Of Experience",
                icon: "/assets/images/icon/yoe.svg",
              },
              {
                value: "20 Crore+",
                label: "Tests Done So Far",
                icon: "/assets/images/icon/tdsf.svg",
              },
              {
                value: "21",
                label: "Labs in India",
                icon: "/assets/images/icon/li.svg",
              },
              {
                value: "1.5 Crore+",
                label: "Satisfied Customers",
                icon: "/assets/images/icon/sc.svg",
              },
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                {/* ICON */}
                <div className="flex h-10 w-10 items-center justify-center rounded-lg">
                  <img
                    src={item.icon}
                    alt={item.label}
                    className="h-8 w-8 object-contain"
                  />
                </div>

                {/* TEXT */}
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {item.value}
                  </p>
                  <p className="text-sm text-gray-600 leading-tight">
                    {item.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="px-4 py-6 space-y-6 bg-white">
          {/* TOP STATS */}
          <div className="grid grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="rounded-xl bg-sky-100 shadow-md flex flex-col">
              {/* Top icon */}
              <div className="flex justify-center pt-4 pb-3">
                <div className="h-12 w-12 flex items-center justify-center">
                  <img
                    src="/assets/images/icon/ir.svg"
                    alt="International Reach"
                    className="h-10 w-10"
                  />
                </div>
              </div>

              {/* Bottom content */}
              <div className="mt-auto rounded-b-xl gradient-blue px-3 py-2 text-center">
                <p className="text-sm font-semibold text-white">
                  International Reach
                </p>
                <p className="text-xs text-white/90">
                  MDRC has international reach
                </p>
              </div>
            </div>

            {/* Card 2 */}
            <div className="rounded-xl bg-emerald-200 shadow-md flex flex-col">
              {/* Top icon */}
              <div className="flex justify-center pt-4 pb-3">
                <div className="h-12 w-12 flex items-center justify-center">
                  <img
                    src="/assets/images/icon/tp.svg"
                    alt="Touch points"
                    className="h-10 w-10"
                  />
                </div>
              </div>

              {/* Bottom content */}
              <div className="mt-auto rounded-b-xl gradient-green px-3 py-2 text-center">
                <p className="text-sm font-semibold text-white">
                  1800+ Touch points
                </p>
                <p className="text-xs text-white/90">across India</p>
              </div>
            </div>
          </div>


        </div>
      </section>
    </div>
  );
};

export default OurMilestones;
