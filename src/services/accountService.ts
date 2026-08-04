import requests from "@/lib/httpServices";  // Assuming this is your API utility

const AccountService = {
  getWalletTransactions: async (body: any) => {
    return requests.post("/webApi/index.php", body);
  },
};

export default AccountService;
