// components/ReachUs.tsx
"use client";

import React from "react";
import { Phone, Mail, MapPin, Send, Loader2 } from "lucide-react";
import { Location, ReachUsApiResponse } from "@/hooks/useReachUs";

interface ReachUsProps {
  serverData?: ReachUsApiResponse | null;
}

const LocationCard: React.FC<{ location: Location }> = ({ location }) => {
  return (
    <div className="bg-white border border-gray-300 p-4 mb-4 relative rounded-md shadow-sm hover:shadow-md transition-shadow">
      <h3 className="text-base font-semibold text-gray-800 mb-3">
        {location.name}
      </h3>

      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
          <p className="text-gray-600 text-xs leading-relaxed">
            {location.address}
          </p>
        </div>

        {location.phone1 && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-600 shrink-0" />
            <a
              href={`tel:${location.phone1}`}
              className="text-gray-700 text-xs hover:text-blue-600 transition-colors"
            >
              {location.phone1}
            </a>
          </div>
        )}

        {location.phone2 && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-green-600 shrink-0" />
            <a
              href={`tel:${location.phone2}`}
              className="text-gray-700 text-xs hover:text-blue-600 transition-colors"
            >
              {location.phone2}
            </a>
          </div>
        )}

        {location.email1 && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-600  shrink-0" />
            <a
              href={`mailto:${location.email1}`}
              className="text-gray-700 text-xs hover:text-blue-600 transition-colors break-all"
            >
              {location.email1}
            </a>
          </div>
        )}

         {location.email2 && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-green-600  shrink-0" />
            <a
              href={`mailto:${location.email2}`}
              className="text-gray-700 text-xs hover:text-blue-600 transition-colors break-all"
            >
              {location.email2}
            </a>
          </div>
        )}


        {location.mapUrl && (
          <div className="pt-1">
            <a
              href={location.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0a6baf] font-medium text-xs hover:text-blue-700 transition-colors"
            >
              View on Map
              <Send className="w-3 h-3" />
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

const ReachUsComponent: React.FC<ReachUsProps> = ({ serverData }) => {
  if (!serverData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0a6baf]" />
      </div>
    );
  }

  const { addressList, callBlock, meta_schema } = serverData.result;
  const whatsappNumber = callBlock.whatsapp?.replace(/[^0-9]/g, "") ?? "";

  if (!addressList?.length) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <p className="text-gray-600 text-sm">No data available</p>
      </div>
    );
  }

  const schema = meta_schema
    ? meta_schema.replace(/<script.*?>|<\/script>/g, "")
    : null;

  return (
    <>
      {schema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: schema }}
        />
      )}
      <div className="min-h-screen bg-gray-50 py-4 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Top Contact Cards */}
          <div className="space-y-3 mb-6">
            <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-3">
              <div className="bg-blue-100 rounded-full p-2">
                <img
                  src="/assets/svg/call.svg"
                  alt="Call"
                  className="h-6 w-6"
                />
              </div>
              <a
                href={`tel:${callBlock.call}`}
                className="text-gray-800 font-medium"
              >
                {callBlock.call}
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <img
                  src="/assets/svg/whatsapp.svg"
                  alt="WhatsApp"
                  className="h-6 w-6"
                />
              </div>
              <a
                href={`https://wa.me/${whatsappNumber}`}
                className="text-gray-800 font-medium"
              >
                {callBlock.whatsapp}
              </a>
            </div>

            <div className="bg-white rounded-2xl shadow-md p-4 flex items-center gap-3">
              <div className="bg-yellow-100 rounded-full p-2">
                <Mail className="w-6 h-6 text-yellow-600" />
              </div>
              <a
                href={`mailto:${callBlock.email}`}
                className="text-gray-800 font-medium"
              >
                {callBlock.email}
              </a>
            </div>
          </div>

          {callBlock.heading && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 mb-6 text-center">
              <p className="text-gray-800 font-medium text-sm">
                {callBlock.heading}
              </p>
            </div>
          )}

          {/* Locations */}
          {addressList.map((location: Location) => (
            <LocationCard
              key={`${location.name}-${location.city_id}`}
              location={location}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default ReachUsComponent;
