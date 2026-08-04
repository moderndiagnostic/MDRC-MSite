import requests from "@/lib/httpServices";

const inquiryService = {
  addNewInquiry: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },
};

export default inquiryService;
