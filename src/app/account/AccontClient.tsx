"use client";

import { useUser } from "@/context/userContext";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";

interface DashboardItem {
  title: string;
  icon: ReactNode;
  redirectTo: string;
}

interface DashboardProfile {
  name: string;
  email: string;
  phone: string;
  userImage: any;
}

interface DashboardCardProps {
  title: string;
  icon: ReactNode;
  onClick?: () => void;
  active?: boolean;
  redirectTo: string;
}

const dashboardItems: DashboardItem[] = [
  {
    title: "My Booking",
    icon: (
      <img
        src="/assets/images/account/my-booking.svg"
        alt="My Booking"
        className="w-12 h-12"
      />
    ),
    redirectTo: "/account/bookings",
  },

  {
    title: "MDRC Wallet",
    icon: (
      <img
        src="/assets/images/account/wallet.svg"
        alt="Wallet"
        className="w-12 h-12"
      />
    ),
    redirectTo: "/account/wallet",
  },
  {
    title: "My Family & Friends",
    icon: (
      <img
        src="/assets/images/account/family.svg"
        alt="Family"
        className="w-12 h-12"
      />
    ),
    redirectTo: "/account/family",
  },

  {
    title: "Help & Feedback",
    icon: (
      <img
        src="/assets/images/account/help.svg"
        alt="Help"
        className="w-12 h-12"
      />
    ),
    redirectTo: "/account/help",
  },
];

/* ----------------------------------
   Components
---------------------------------- */

const DashboardHeader = () => {
  const [profile, setProfile] = useState<DashboardProfile | null>(null);
  const { user } = useUser();

  useEffect(() => {
    if (typeof window !== "undefined") {
        setProfile({
          name:
            `${user?.userFirstName || ""} ${user?.userLastName || ""}`.trim() ||
            "User",
          email: user?.userEmail || "",
          phone: user?.userPhone || "",
          userImage: user?.userImage,
        });
    }
  }, [user]);

  if (!profile) {
    return (
      <div className="rounded-xl px-5 py-6 bg-gray-200 animate-pulse h-[110px]" />
    );
  }

  const { name, email, phone, userImage } = profile;

  return (
    <div
      className="rounded-xl px-5 py-6 text-white
                 bg-gradient-to-b from-[#005C96] to-[#15AEE5]
                 shadow-md flex items-center gap-4"
    >
      {/* Avatar */}
      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-gray-700">
        {userImage ? (
          <img
            src={userImage}
            alt="User Avatar"
            className="w-full h-full object-cover rounded-full"
          />
        ) : (
          name.charAt(0).toUpperCase()
        )}
      </div>
      {/* Info */}
      <div className="flex-1">
        <p className="text-lg font-semibold">{name}</p>
        {email && <p className="text-sm opacity-90">{email}</p>}
        {phone && <p className="text-sm opacity-90">Phone: {phone}</p>}

        <Link href="/account/profile">
          <button
            className="mt-3 border border-white
                       px-4 py-1.5 rounded-md
                       text-sm font-medium"
          >
            EDIT INFO
          </button>
        </Link>
      </div>
    </div>
  );
};

const DashboardCard = ({
  title,
  icon,
  onClick,
  active,
  redirectTo,
}: DashboardCardProps & { redirectTo: string }) => {
  return (
    <Link href={redirectTo} passHref>
      <button
        onClick={onClick}
        className={`bg-white rounded-xl p-5 flex flex-col items-center w-full gap-3
          shadow-md transition-all transform duration-300
          ${
            active
              ? "border border-[#15AEE5] scale-105"
              : "border border-transparent"
          }`}
      >
        <div className="w-14 h-14 flex items-center justify-center">{icon}</div>
        <p className="text-sm font-medium text-gray-700 text-center">{title}</p>
      </button>
    </Link>
  );
};

/* ----------------------------------
   Main Page
---------------------------------- */

const MyDashboard = () => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  return (
    <div>
      <div className=" bg-gray-100 px-4 pb-6">
        <h1 className="text-lg font-semibold text-center text-[#1160A5] py-4">
          My Dashboard
        </h1>

        <DashboardHeader />

        <div className="grid grid-cols-2 gap-4 mt-6">
          {dashboardItems.map((item, index) => (
            <DashboardCard
              key={item.title}
              title={item.title}
              icon={item.icon}
              active={activeIndex === index}
              onClick={() => setActiveIndex(index)}
              redirectTo={item.redirectTo}
            />
          ))}
        </div>
      </div>
      <div></div>
    </div>
  );
};

export default MyDashboard;
