"use client";
import React, { useState } from "react";
import { X, Search } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
}

interface FilterData {
  diseases: FilterOption[];
  categories: FilterOption[];
}

interface FilterComponentProps {
  isOpen: boolean;
  onClose: () => void;

  // 🔥 NEW (optional)
  radiologyFilters?: {
    filterID: string;
    name: string;
  }[];
}

const FilterComponent: React.FC<FilterComponentProps> = ({
  isOpen,
  onClose,
  radiologyFilters,
}) => {
  const [selectedDiseases, setSelectedDiseases] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [packageToggle, setPackageToggle] = useState(true);
  const [testToggle, setTestToggle] = useState(true);
  const [diseaseSearch, setDiseaseSearch] = useState("");
  const [categorySearch, setCategorySearch] = useState("");

  const filterData: FilterData = {
    diseases: [
      { id: "allergy", label: "Allergy" },
      { id: "arthritis", label: "Arthritis" },
      { id: "cancer", label: "Cancer" },
      { id: "diabetes", label: "Diabetes" },
      { id: "digestion", label: "Digestion" },
      { id: "fatigue", label: "Fatigue" },
      { id: "fever", label: "Fever" },
      { id: "heart", label: "Heart" },
    ],
    categories: [
      { id: "vitamin-screening", label: "Vitamin Screening" },
      { id: "full-body-check", label: "Full Body Check Up" },
      { id: "food-intolerance", label: "Food Intolerance" },
      { id: "popular-packages", label: "Popular Packages" },
      { id: "diabetes-screening", label: "Diabetes Screening" },
      { id: "vitamin", label: "Vitamin" },
      { id: "womens-health", label: "Womens Health" },
      { id: "iron-studies", label: "Iron Studies" },
    ],
  };

  const toggleDisease = (id: string) => {
    setSelectedDiseases((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const toggleCategory = (id: string) => {
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const removeFilter = (type: "disease" | "category", id: string) => {
    if (type === "disease") {
      setSelectedDiseases((prev) => prev.filter((d) => d !== id));
    } else {
      setSelectedCategories((prev) => prev.filter((c) => c !== id));
    }
  };

  const getFilterLabel = (id: string, type: "disease" | "category") => {
    const data =
      type === "disease" ? filterData.diseases : filterData.categories;
    return data.find((item) => item.id === id)?.label || id;
  };

  const filteredDiseases = filterData.diseases.filter((disease) =>
    disease.label.toLowerCase().includes(diseaseSearch.toLowerCase()),
  );

  const filteredCategories = filterData.categories.filter((category) =>
    category.label.toLowerCase().includes(categorySearch.toLowerCase()),
  );

  const handleRadiologyClick = () => {
    const result = {
      filters: {
        package: packageToggle,
        test: testToggle,
        selectedDiseases: selectedDiseases.map((id) => ({
          id,
          label: getFilterLabel(id, "disease"),
        })),
        selectedCategories: selectedCategories.map((id) => ({
          id,
          label: getFilterLabel(id, "category"),
        })),
      },
    };
    console.log(JSON.stringify(result, null, 2));
    onClose(); // Optional: close panel after applying
  };

  const allSelectedFilters = [
    ...selectedDiseases.map((id) => ({ type: "disease" as const, id })),
    ...selectedCategories.map((id) => ({ type: "category" as const, id })),
  ];

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-50 backdrop-blur-[1px] z-40"
          onClick={onClose}
        />
      )}

      {/* Slide-in Panel */}
      <div
        className={`fixed top-0 left-0 h-full w-[75%] bg-white z-50 transform transition-transform duration-300 ease-in-out overflow-y-auto ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={24} />
        </button>

        <div className="p-6">
          {/* Selected Filters */}
          {allSelectedFilters.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-bold mb-3 text-gray-700">FILTERS</h3>
              <div className="flex flex-wrap gap-2">
                {allSelectedFilters.map((filter) => (
                  <button
                    key={`${filter.type}-${filter.id}`}
                    onClick={() => removeFilter(filter.type, filter.id)}
                    className="bg-white border border-gray-400 px-3 py-1.5 rounded text-xs font-medium text-gray-700 flex items-center gap-2 hover:bg-gray-50"
                  >
                    {getFilterLabel(filter.id, filter.type).toUpperCase()}
                    <X size={14} />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Filter By */}
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-4 text-gray-700">FILTER BY</h3>
          </div>

          {/* Diseases/Risk Areas */}
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-bold mb-3 text-gray-700">
              DISEASES/RISK AREAS
            </h3>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search"
                value={diseaseSearch}
                onChange={(e) => setDiseaseSearch(e.target.value)}
                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-500 outline-none text-sm"
              />
              <Search
                className="absolute right-2 top-2 text-red-500"
                size={20}
              />
            </div>
            <div className="max-h-64 overflow-y-auto pr-2">
              {filteredDiseases.map((disease) => (
                <label
                  key={disease.id}
                  className="flex items-center mb-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedDiseases.includes(disease.id)}
                    onChange={() => toggleDisease(disease.id)}
                    className="w-5 h-5 mr-3 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-base font-medium group-hover:text-blue-600">
                    {disease.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="mb-6 bg-white rounded-lg shadow-sm p-4">
            <h3 className="text-sm font-bold mb-3 text-gray-700">CATEGORIES</h3>
            <div className="relative mb-4">
              <input
                type="text"
                placeholder="Search"
                value={categorySearch}
                onChange={(e) => setCategorySearch(e.target.value)}
                className="w-full px-3 py-2 border-b-2 border-gray-300 focus:border-red-500 outline-none text-sm"
              />
              <Search
                className="absolute right-2 top-2 text-red-500"
                size={20}
              />
            </div>
            <div className="max-h-64 overflow-y-auto pr-2">
              {filteredCategories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center mb-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                    className="w-5 h-5 mr-3 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-base font-medium group-hover:text-blue-600">
                    {category.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {radiologyFilters && radiologyFilters.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Radiology
              </h3>

              {radiologyFilters.map((item) => (
                <label
                  key={item.filterID}
                  className="flex items-center mb-3 cursor-pointer group"
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 mr-3 accent-blue-600 cursor-pointer"
                  />
                  <span className="text-base font-medium group-hover:text-blue-600">
                    {item.name}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Apply Button */}
          <button
            onClick={handleRadiologyClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center gap-2 transition-colors"
          >
            Radiology Packages
            <span className="text-lg">›</span>
          </button>
        </div>
      </div>
    </>
  );
};

export default FilterComponent;
