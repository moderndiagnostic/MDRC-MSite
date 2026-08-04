"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

const dashboardItems = [
  { title: "My Booking", redirectTo: "/account/bookings" },
  { title: "MDRC Wallet", redirectTo: "/account/wallet" },
  { title: "My Family & Friends", redirectTo: "/account/family" },
  { title: "Help & Feedback", redirectTo: "/account/help" },
];

export default function AccountMenu() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100">
      {/* Dropdown Toggle Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="w-full px-5 py-4 flex items-center justify-between text-[#424040] bg-white hover:bg-gray-50 transition-colors"
      >
        <span className="text-lg font-medium">Menu List</span>
        <ChevronDown
          className={`w-6 h-6 transition-transform duration-300 ${
            menuOpen ? "rotate-180" : ""
          }`}
        />
      </button>

      {/* Collapsible Menu Items */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-[300px] border-t border-gray-100" : "max-h-0"
        }`}
      >
        <div className="bg-white">
          {dashboardItems.map((item, index) => (
            <Link
              key={index}
              href={item.redirectTo}
              className="block px-8 py-4 text-[#555] hover:text-[#1160A5] hover:bg-blue-50 border-b border-gray-50 last:border-0 transition-all font-medium"
            >
              {item.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
