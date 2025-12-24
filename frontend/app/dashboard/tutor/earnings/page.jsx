"use client";

import TitleSection from "@/components/dashboard/shared/TitleSection";
import {
  useGetPaymentHistoryQuery,
  useGetWalletDetailsQuery,
} from "@/feature/shared/TutorApi";

import { useEffect, useState } from "react";

export default function Earnings() {
  const [page, setPage] = useState(1);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [withdrawError, setWithdrawError] = useState("");
  const limit = 10;

  // Fetch wallet details
  const {
    data: walletData,
    isLoading: walletLoading,
    error: walletError,
    refetch: refetchWallet,
  } = useGetWalletDetailsQuery();

  // Fetch payment history with pagination
  const {
    data: paymentData,
    isLoading: paymentLoading,
    error: paymentError,
    refetch: refetchPayments,
  } = useGetPaymentHistoryQuery({ page, limit });

  // Refetch when page changes
  useEffect(() => {
    refetchPayments();
  }, [page, refetchPayments]);

  // Extract data from responses
  const wallet = walletData?.data?.wallet;
  const payments = paymentData?.data?.payments || [];
  const meta = paymentData?.data?.meta || { page: 1, limit: 10, totalPages: 1 };

  // Calculate totals - use raw values as they are
  const calculateTotals = () => {
    let totalEarnings = 0;
    let totalCommission = 0;
    let totalAmount = 0;
    let totalTransactions = payments.length;

    payments.forEach((payment) => {
      if (payment.status === "COMPLETED") {
        totalEarnings += payment.tutorEarning || 0;
        totalCommission += payment.commission || 0;
        totalAmount += payment.amount || 0;
      }
    });

    return {
      totalEarnings,
      totalCommission,
      totalAmount,
      totalTransactions,
      averageEarning:
        totalTransactions > 0 ? totalEarnings / totalTransactions : 0,
    };
  };

  const totals = calculateTotals();

  // Format currency - DO NOT divide by 100 (data is already in correct format)
  const formatCurrency = (amount, currency = "gbp") => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Handle withdraw request
  const handleWithdrawRequest = async () => {
    setWithdrawError("");

    // Validate amount
    if (!withdrawAmount || isNaN(parseFloat(withdrawAmount))) {
      setWithdrawError("Please enter a valid amount");
      return;
    }

    const amount = parseFloat(withdrawAmount);

    // Check if amount is positive
    if (amount <= 0) {
      setWithdrawError("Amount must be greater than 0");
      return;
    }

    // Check if wallet has sufficient balance
    if (wallet && amount > wallet.balance) {
      setWithdrawError(
        `Insufficient balance. Maximum withdrawal: ${formatCurrency(
          wallet.balance,
          wallet.currency
        )}`
      );
      return;
    }

    setIsProcessing(true);

    try {
      // Simulate API call - Replace with actual API endpoint
      console.log("Withdraw request submitted:", {
        amount,
        currency: wallet?.currency || "gbp",
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Success - show success message and close modal
      alert(
        `Withdrawal request of ${formatCurrency(
          amount,
          wallet?.currency || "gbp"
        )} submitted successfully!`
      );

      // Reset form
      setWithdrawAmount("");
      setShowWithdrawModal(false);

      // Refresh wallet data
      refetchWallet();
    } catch (error) {
      setWithdrawError(
        "Failed to process withdrawal request. Please try again."
      );
      console.error("Withdrawal error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= Math.ceil(payments.length / limit)) {
      setPage(newPage);
    }
  };

  // Loading state
  if (walletLoading || paymentLoading) {
    return (
      <div className='bg-[#F7F7F7] m-4'>
        <TitleSection bg={"#FFF8F7"} title={"Earnings"} />
        <div className='flex justify-center items-center h-64'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600'></div>
          <p className='ml-4 text-gray-600'>Loading earnings data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (walletError || paymentError) {
    return (
      <div className='bg-[#F7F7F7] m-4'>
        <TitleSection bg={"#FFF8F7"} title={"Earnings"} />
        <div className='flex justify-center items-center h-64'>
          <div className='text-red-600 text-center'>
            <p>Error loading earnings data. Please try again.</p>
            <button
              onClick={() => {
                if (walletError) refetchWallet();
                if (paymentError) refetchPayments();
              }}
              className='mt-4 px-4 py-2 bg-red-100 text-red-700 rounded hover:bg-red-200 transition-colors'>
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className='bg-[#F7F7F7] m-4 p-4'>
      <TitleSection bg={"#FFF8F7"} title={"Earnings"} />

      {/* Wallet Overview with Withdraw Button */}
      {wallet && (
        <div className='mb-8'>
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-2'>
                    Current Balance
                  </h3>
                  <p className='text-3xl font-bold text-green-600'>
                    {formatCurrency(wallet.balance, wallet.currency)}
                  </p>
                </div>
                <div className='w-12 h-12 rounded-full bg-green-100 flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-green-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M4 4a2 2 0 00-2 2v4a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4z'
                      clipRule='evenodd'
                    />
                    <path d='M3 8v1a1 1 0 001 1h12a1 1 0 001-1V8l-4-2-4 2-4-2-4 2z' />
                  </svg>
                </div>
              </div>
              <p className='text-xs text-gray-500 mt-4'>
                Last updated: {new Date(wallet.updatedAt).toLocaleDateString()}
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-2'>
                    Total Earnings
                  </h3>
                  <p className='text-3xl font-bold text-purple-600'>
                    {formatCurrency(totals.totalEarnings, wallet.currency)}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    {totals.totalTransactions} transactions
                  </p>
                </div>
                <div className='w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-purple-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
              <p className='text-xs text-gray-500 mt-4'>
                Average:{" "}
                {formatCurrency(totals.averageEarning, wallet.currency)} per
                transaction
              </p>
            </div>

            <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-medium text-gray-500 mb-2'>
                    Total Platform Fees
                  </h3>
                  <p className='text-3xl font-bold text-blue-600'>
                    {formatCurrency(totals.totalCommission, wallet.currency)}
                  </p>
                  <p className='text-xs text-gray-500 mt-1'>
                    20% commission on all payments
                  </p>
                </div>
                <div className='w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-blue-600'
                    fill='currentColor'
                    viewBox='0 0 20 20'>
                    <path
                      fillRule='evenodd'
                      d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z'
                      clipRule='evenodd'
                    />
                  </svg>
                </div>
              </div>
              <p className='text-xs text-gray-500 mt-4'>
                Deducted from total payment amount
              </p>
            </div>

            {/* Withdraw Button Card */}
            <div className='bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg shadow-sm border border-green-200'>
              <div className='flex items-center justify-between'>
                <div>
                  <h3 className='text-sm font-medium text-gray-700 mb-2'>
                    Ready to Withdraw?
                  </h3>
                  <p className='text-lg font-bold text-emerald-700'>
                    Available for withdrawal
                  </p>
                  <p className='text-xs text-gray-600 mt-1'>
                    Minimum withdrawal: {formatCurrency(10, wallet.currency)}
                  </p>
                </div>
                <div className='w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center'>
                  <svg
                    className='w-6 h-6 text-emerald-600'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'>
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth='2'
                      d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
                    />
                  </svg>
                </div>
              </div>
              <button
                onClick={() => setShowWithdrawModal(true)}
                disabled={!wallet || wallet.balance < 10}
                className={`w-full mt-4 px-4 py-3 rounded-lg font-medium transition-colors ${
                  wallet && wallet.balance >= 10
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-gray-200 text-gray-500 cursor-not-allowed"
                }`}>
                {wallet && wallet.balance >= 10
                  ? "Request Withdrawal"
                  : "Minimum £10 Required"}
              </button>
              <p className='text-xs text-gray-500 text-center mt-2'>
                Processing time: 3-5 business days
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Payment History Table */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden'>
        {/* Table Header */}
        <div className='grid grid-cols-6 gap-4 px-6 py-4 bg-gray-50 border-b border-gray-200'>
          <div className='text-sm font-medium text-gray-600'>Date & Time</div>
          <div className='text-sm font-medium text-gray-600'>
            Transaction ID
          </div>
          <div className='text-sm font-medium text-gray-600'>Total Amount</div>
          <div className='text-sm font-medium text-gray-600'>Platform Fee</div>
          <div className='text-sm font-medium text-gray-600'>Net Earnings</div>
          <div className='text-sm font-medium text-gray-600'>Status</div>
        </div>

        {/* Table Body */}
        {payments.length > 0 ? (
          <>
            {payments.map((payment, index) => (
              <div
                key={payment._id || index}
                className='grid grid-cols-6 gap-4 px-6 py-4 items-center border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors'>
                {/* Date & Time */}
                <div className='text-sm'>
                  <div className='font-semibold'>
                    {formatDate(payment.createdAt)}
                  </div>
                  <div className='text-gray-500 text-xs'>
                    {formatTime(payment.createdAt)}
                  </div>
                </div>

                {/* Transaction ID */}
                <div className='text-sm text-gray-700'>
                  <div
                    className='truncate max-w-[150px]'
                    title={payment.transactionId}>
                    {payment.transactionId}
                  </div>
                  <div className='text-xs text-gray-500'>
                    Booking:{" "}
                    {typeof payment.booking === "object"
                      ? payment.booking._id?.slice(-6)
                      : payment.booking?.slice(-6) || "N/A"}
                  </div>
                </div>

                {/* Total Amount */}
                <div className='text-sm font-semibold text-gray-900'>
                  {formatCurrency(payment.amount, payment.currency)}
                </div>

                {/* Platform Fee */}
                <div className='text-sm text-red-600 font-medium'>
                  -{formatCurrency(payment.commission, payment.currency)}
                </div>

                {/* Net Earnings */}
                <div className='text-sm text-green-600 font-bold'>
                  {formatCurrency(payment.tutorEarning, payment.currency)}
                </div>

                {/* Status */}
                <div>
                  <span
                    className={`px-3 py-1 text-xs font-medium rounded-full ${
                      payment.status === "COMPLETED"
                        ? "bg-green-100 text-green-800"
                        : payment.status === "PENDING"
                        ? "bg-yellow-100 text-yellow-800"
                        : payment.status === "FAILED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}

            {/* Pagination */}
            {meta.totalPages > 1 && (
              <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center'>
                <div className='text-sm text-gray-700'>
                  Showing {(page - 1) * limit + 1} to{" "}
                  {Math.min(page * limit, payments.length)} of {payments.length}{" "}
                  payments
                </div>
                <div className='flex gap-2'>
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className={`px-3 py-1 text-sm rounded ${
                      page === 1
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}>
                    Previous
                  </button>
                  <div className='flex items-center'>
                    <span className='text-sm text-gray-700 mx-2'>
                      Page {page} of {meta.totalPages}
                    </span>
                  </div>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page >= meta.totalPages}
                    className={`px-3 py-1 text-sm rounded ${
                      page >= meta.totalPages
                        ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                        : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                    }`}>
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className='px-6 py-8 text-center text-gray-500'>
            No payment history found. Payments will appear here once you have
            completed tutoring sessions.
          </div>
        )}
      </div>

      {/* Withdraw Modal */}
      {showWithdrawModal && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
          <div className='bg-white rounded-lg shadow-xl max-w-md w-full'>
            <div className='px-6 py-4 border-b border-gray-200'>
              <h3 className='text-lg font-semibold text-gray-900'>
                Request Withdrawal
              </h3>
              <p className='text-sm text-gray-500 mt-1'>
                Enter the amount you want to withdraw
              </p>
            </div>

            <div className='px-6 py-4'>
              {/* Wallet Balance Info */}
              <div className='mb-6 p-4 bg-blue-50 rounded-lg border border-blue-100'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm font-medium text-gray-700'>
                    Available Balance:
                  </span>
                  <span className='text-lg font-bold text-blue-700'>
                    {wallet
                      ? formatCurrency(wallet.balance, wallet.currency)
                      : "£0.00"}
                  </span>
                </div>
                <p className='text-xs text-gray-500 mt-2'>
                  Minimum withdrawal:{" "}
                  {wallet ? formatCurrency(10, wallet.currency) : "£10.00"}
                </p>
              </div>

              {/* Amount Input */}
              <div className='mb-4'>
                <label className='block text-sm font-medium text-gray-700 mb-2'>
                  Withdrawal Amount ({wallet?.currency?.toUpperCase() || "GBP"})
                </label>
                <div className='relative'>
                  <div className='absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none'>
                    <span className='text-gray-500 sm:text-sm'>£</span>
                  </div>
                  <input
                    type='number'
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder='0.00'
                    className='pl-8 block w-full rounded-lg border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400 focus:border-green-500 focus:ring-green-500 sm:text-sm'
                    min='10'
                    max={wallet?.balance || 0}
                    step='0.01'
                  />
                </div>
                {withdrawError && (
                  <p className='mt-2 text-sm text-red-600'>{withdrawError}</p>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className='mb-6'>
                <p className='text-sm text-gray-600 mb-2'>Quick Amounts:</p>
                <div className='grid grid-cols-4 gap-2'>
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      type='button'
                      onClick={() => setWithdrawAmount(amount.toString())}
                      className='px-3 py-2 text-sm border border-gray-300 rounded hover:bg-gray-50 transition-colors'>
                      {formatCurrency(amount, wallet?.currency || "gbp")}
                    </button>
                  ))}
                </div>
                {wallet && wallet.balance > 0 && (
                  <button
                    type='button'
                    onClick={() => setWithdrawAmount(wallet.balance.toString())}
                    className='mt-2 w-full px-3 py-2 text-sm bg-emerald-50 text-emerald-700 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors'>
                    Withdraw All (
                    {formatCurrency(wallet.balance, wallet.currency)})
                  </button>
                )}
              </div>

              {/* Estimated Payout */}
              {withdrawAmount && !isNaN(parseFloat(withdrawAmount)) && (
                <div className='mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200'>
                  <h4 className='text-sm font-medium text-gray-700 mb-2'>
                    Withdrawal Summary
                  </h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Withdrawal Amount:
                      </span>
                      <span className='text-sm font-semibold'>
                        {formatCurrency(
                          parseFloat(withdrawAmount),
                          wallet?.currency || "gbp"
                        )}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-sm text-gray-600'>
                        Processing Fee:
                      </span>
                      <span className='text-sm text-gray-600'>No fee</span>
                    </div>
                    <div className='flex justify-between pt-2 border-t border-gray-300'>
                      <span className='text-sm font-medium text-gray-700'>
                        You'll receive:
                      </span>
                      <span className='text-sm font-bold text-green-600'>
                        {formatCurrency(
                          parseFloat(withdrawAmount),
                          wallet?.currency || "gbp"
                        )}
                      </span>
                    </div>
                    <p className='text-xs text-gray-500 mt-2'>
                      Funds will be sent to your registered bank account within
                      3-5 business days.
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className='px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3'>
              <button
                type='button'
                onClick={() => {
                  setShowWithdrawModal(false);
                  setWithdrawAmount("");
                  setWithdrawError("");
                }}
                disabled={isProcessing}
                className='px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50'>
                Cancel
              </button>
              <button
                type='button'
                onClick={handleWithdrawRequest}
                disabled={
                  isProcessing ||
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) < 10
                }
                className={`px-4 py-2 text-sm font-medium text-white rounded-md transition-colors ${
                  isProcessing ||
                  !withdrawAmount ||
                  parseFloat(withdrawAmount) < 10
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-emerald-600 hover:bg-emerald-700"
                }`}>
                {isProcessing ? (
                  <>
                    <span className='inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2'></span>
                    Processing...
                  </>
                ) : (
                  "Confirm Withdrawal"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Summary Section */}
      {payments.length > 0 && (
        <div className='mt-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Earnings Summary
            </h3>
            <div className='space-y-3'>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>
                  Total Payments Received
                </span>
                <span className='text-sm font-semibold text-gray-900'>
                  {totals.totalTransactions}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>
                  Total Platform Fees
                </span>
                <span className='text-sm font-semibold text-red-600'>
                  -
                  {formatCurrency(
                    totals.totalCommission,
                    wallet?.currency || "gbp"
                  )}
                </span>
              </div>
              <div className='flex justify-between items-center'>
                <span className='text-sm text-gray-600'>Net Earnings</span>
                <span className='text-sm font-bold text-green-600'>
                  {formatCurrency(
                    totals.totalEarnings,
                    wallet?.currency || "gbp"
                  )}
                </span>
              </div>
              <div className='pt-3 border-t border-gray-200'>
                <div className='flex justify-between items-center'>
                  <span className='text-sm text-gray-600'>
                    Current Wallet Balance
                  </span>
                  <span className='text-lg font-bold text-purple-600'>
                    {wallet
                      ? formatCurrency(wallet.balance, wallet.currency)
                      : "£0.00"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className='bg-white p-6 rounded-lg shadow-sm border border-gray-200'>
            <h3 className='text-lg font-semibold text-gray-900 mb-4'>
              Payment Information
            </h3>
            <div className='space-y-3'>
              <div className='text-sm'>
                <p className='text-gray-600 mb-1'>
                  Currency:{" "}
                  <span className='font-semibold text-gray-900'>
                    {wallet?.currency?.toUpperCase() || "GBP"}
                  </span>
                </p>
                <p className='text-gray-600 mb-1'>
                  Payment Method:{" "}
                  <span className='font-semibold text-gray-900'>Stripe</span>
                </p>
                <p className='text-gray-600 mb-1'>
                  Commission Rate:{" "}
                  <span className='font-semibold text-gray-900'>20%</span>
                </p>
                <p className='text-gray-600 mb-1'>
                  Minimum Withdrawal:{" "}
                  <span className='font-semibold text-gray-900'>£10.00</span>
                </p>
              </div>
              <div className='pt-3 border-t border-gray-200'>
                <p className='text-xs text-gray-500'>
                  Platform fees are automatically deducted from each payment.
                  Your net earnings are credited to your wallet immediately
                  after payment completion.
                </p>
                <button
                  onClick={() => setShowWithdrawModal(true)}
                  className='mt-3 w-full px-4 py-2 text-sm font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 rounded hover:bg-emerald-100 transition-colors'>
                  Request Withdrawal
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
