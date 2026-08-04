import requests from "@/lib/httpServices";

const FamilyService = {
  getMemberList: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  addMember: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  // Edit Member
  editMember: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },

  // New method to get dropdown data
  getDropdownData: async () => {
    const body = {
      view: "all_dropdown", // Only pass the `view` parameter
    };

    return requests.post("/webApi/index.php", body); // Send the request with the `view` parameter
  },

  // Edit Member
  deleteMember: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },
};

export default FamilyService;
