import { useEffect, useState } from "react";
import { getDeviceType } from "@/utils/device";  // Assuming this function detects device type
import AccountService from "@/services/accountService";

type UseAccountParams = {
  userID: string;            // User ID (from authentication)
  userPhone: string;         // User phone number (from authentication)
  search?: string;           // Search query
  page?: number;             // Page for pagination
};

export function useAccount({
  userID,
  userPhone,
  search = "",
  page = 0,
}: UseAccountParams) {
  const [transactions, setTransactions] = useState<any[]>([]);  // Array of wallet transactions
  const [walletBalance, setWalletBalance] = useState("0.00");   // Wallet balance state
  const [promoWalletAmount, setPromoWalletAmount] = useState("0.00"); // Promo wallet amount
  const [loading, setLoading] = useState(false);                // Loading state
  const [error, setError] = useState("");                       // Error message state

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError("");

      const body = {
        view: "wallet_transaction_list",  // Specific view for wallet transactions
        userID,                          // User ID
        deviceType: getDeviceType(),      // Device type (Android, iOS, etc.)
        userPhone,                       // User phone number
        search,                          // Search query for filtering transactions
        page,                            // Pagination for transactions
      };

      const res = await AccountService.getWalletTransactions(body);

      if (res?.msgCode === "1") {
        setTransactions(res?.result?.transactionList || []);  // Set the transactions list
        setWalletBalance(res?.result?.walletAmount || "0.00");  // Set wallet balance
        setPromoWalletAmount(res?.result?.promoWalletAmount || "0.00"); // Set promo wallet balance
      } else {
        setError(res?.msg || "Failed to load transactions");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();  // Fetch transactions on component mount or when params change
  }, [userID, userPhone, search, page]);

  return {
    transactions,
    walletBalance,
    promoWalletAmount,
    loading,
    error,
    fetchTransactions,  // To trigger re-fetching, e.g., for pagination or search updates
  };
}
