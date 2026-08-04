"use client";
import { useState, useEffect, useRef } from "react";
import { Wallet } from "lucide-react";
import { ChevronDown } from "lucide-react";
import AccountService from "@/services/accountService";
import { getDeviceType } from "@/utils/device";
import Link from "next/link";
import AccountMenu from "@/components/AccountMenu";
import { useUser } from "@/context/userContext";

export interface WalletTransaction {
  id: string;
  title: string;
  date: string;
  amount: number;
  type: "credit" | "debit";
}

const WalletTransactionCard = ({
  transaction,
}: {
  transaction: WalletTransaction;
}) => {
  const isCredit = transaction.type === "credit";

  return (
    <div className="border-b border-gray-200">
      <div className="px-4 py-3 flex justify-between items-start">
        <div className="pr-2">
          <p className="text-sm text-gray-800 leading-snug">
            {transaction.title}
          </p>
        </div>

        <div className="text-right min-w-[90px]">
          <p className="text-xs text-gray-500 mb-1">{transaction.date}</p>
          <p
            className={`text-sm font-medium ${
              isCredit ? "text-green-600" : "text-red-600"
            }`}
          >
            {isCredit ? "+" : "-"}₹{transaction.amount}
          </p>
        </div>
      </div>
    </div>
  );
};

const MyWallet = () => {
  const [search, setSearch] = useState("");
  const [walletBalance, setWalletBalance] = useState("0.00");
  const [promoWalletAmount, setPromoWalletAmount] = useState("0.00");
  const [transactions, setTransactions] = useState<WalletTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { user } = useUser();

  const filteredTransactions = transactions.filter((tx) =>
    tx.title.toLowerCase().includes(search.toLowerCase()),
  );

  const [authUser, setUser] = useState<{
    name: string;
    email: string;
    phone: string;
    userImage: string;
  }>({
    name: "User",
    email: "",
    phone: "",
    userImage: "",
  });

  useEffect(() => {
    setUser({
      name:
        `${user?.userFirstName || ""} ${user?.userLastName || ""}`.trim() ||
        "User",
      email: user?.userEmail || "",
      phone: user?.userPhone || "",
      userImage: user?.userImage,
    });
  }, [user]);

  // Fetch wallet data
  const fetchWalletData = async () => {
    try {
      setLoading(true);
      const response = await AccountService.getWalletTransactions({
        view: "wallet_transaction_list",
        userPhone: user?.userPhone,
        deviceType: getDeviceType(),
        userID: user?.userID,
        search,
        page: 0, // Default to first page
      });
      if (response?.msgCode === "1") {
        setWalletBalance(response?.result?.walletAmount || "0.00");
        setPromoWalletAmount(response?.result?.promoWalletAmount || "0.00");
        setTransactions(
          response?.result?.transactionList?.map((tx: any) => ({
            id: tx.id,
            title: tx.remark,
            date: tx.Date,
            amount: parseFloat(tx.amount),
            type: tx.amountType === "+" ? "credit" : "debit",
          })) || [],
        );
      } else {
        setTransactions([]);
       setError(response?.message || "No transactions found");
      }
    } catch (err) {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setError(""); // 🔥 important

    const timer = setTimeout(() => {
      fetchWalletData();
    }, 400);

    return () => clearTimeout(timer);
  }, [search]);
  return (
    <div className="bg-gray-100">
      <div className="p-4">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-b from-[#005C96] to-[#15AEE5] text-white p-6 min-h-[160px] flex flex-col justify-center">
            <div className="flex items-center gap-5">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center flex-shrink-0 shadow-md">
                {authUser?.userImage ? (
                  <img
                    src={authUser?.userImage}
                    alt="User Avatar"
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : (
                  <span className="text-5xl font-bold text-gray-700">
                    {authUser?.name.charAt(0)}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <div>
                  <h1 className="text-xl font-semibold leading-none">
                    {authUser?.name}
                  </h1>
                  {authUser?.email && <p className="mt-1">{authUser?.email}</p>}
                  {authUser?.phone && (
                    <p className="font-semibold">
                      <span className="font-normal">Phone:</span> +91{" "}
                      {authUser?.phone}
                    </p>
                  )}
                </div>

                <div className="mt-1">
                  <Link href="/account/profile">
                    <button className="border-2 border-white px-5 py-1.5 rounded-md font-semibold text-xs tracking-widest uppercase">
                      EDIT INFO
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          <AccountMenu />
        </div>

        <div className="mb-6">
          <div className="bg-[#1160A5] text-white py-4 px-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold text-center">MDRC Wallet</h2>
          </div>
        </div>

        {/* FIXED UI SECTION START */}
        <div className="mx-auto w-full max-w-sm bg-white rounded-3xl p-5 shadow-sm">
          <div className="flex flex-row justify-between gap-3">
            {/* Loyalty Cash Card */}
            {/* <div className="flex-1 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-2 flex items-center justify-center bg-[#E6F8FF] rounded-full relative">
                <img
                  src="/assets/images/account/wallet.svg"
                  alt="Loyalty"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-gray-600 text-[13px] font-medium leading-tight">
                Loyalty Cash
              </span>
              <span className="text-gray-900 font-bold mt-1 text-sm">
                ₹{walletBalance}
              </span>
            </div> */}

            {/* Promo Cash Card */}
            <div className="flex-1 rounded-2xl p-4 flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 mb-2 flex items-center justify-center bg-[#E6F8FF] rounded-full">
                <img
                  src="/assets/svg/discount.svg"
                  alt="Promo"
                  className="w-10 h-10 object-contain"
                />
              </div>
              <span className="text-gray-600 text-[13px] font-medium leading-tight">
                Promo Cash
              </span>
              <span className="text-gray-900 font-bold mt-1 text-sm">
                ₹{promoWalletAmount}
              </span>
            </div>
          </div>

          <div className="pt-4 flex justify-center border-t-1 border-gray-200">
            <p className="text-[#424040] text-[15px]">T&C apply</p>
          </div>
        </div>
        {/* FIXED UI SECTION END */}
      </div>
      <div className="bg-white px-4 py-3 flex items-center gap-3">
        <Wallet size={30} className="text-gray-700" />
        <div>
          <p className="text-sm font-medium text-gray-800">Wallet Balance</p>
          <p className="text-green-600 text-sm font-semibold">
            ₹{walletBalance}
          </p>
        </div>
      </div>
      <div className="bg-gray-100 px-4 py-3">
        <input
          type="text"
          placeholder="Search Transactions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-sm px-3 py-2 text-sm border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
        />
      </div>

      <div className="bg-white">
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-500 py-10 text-center">{error}</p>
        ) : filteredTransactions.length > 0 ? (
          filteredTransactions.map((tx) => (
            <WalletTransactionCard key={tx.id} transaction={tx} />
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <p className="text-gray-500 text-sm font-medium">
              No transactions found
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Try adjusting your search
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyWallet;
