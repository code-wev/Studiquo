'use client'

import { usePaymentHistoryQuery } from "@/feature/admin/adminApi";
import { useState, useEffect } from "react";
import { FiSearch, FiCalendar, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { BsFilter } from "react-icons/bs";

const PaymentTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState({ startDate: "", endDate: "" });
  
  const { data, isLoading, isError, refetch } = usePaymentHistoryQuery({
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm || undefined,
    startDate: dateRange.startDate || undefined,
    endDate: dateRange.endDate || undefined,
  });

  console.log('API Response:', data);
  
  // Extract data from response based on your API structure
  const payments = data?.data?.payments || [];
  const paginationInfo = data?.data?.meta || {
    page: 1,
    totalPages: 1,
    total: 0,
    limit: 10
  };
  
  console.log('Payments:', payments);
  console.log('Pagination Info:', paginationInfo);
  
  // Format date function
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return dateString;
    }
  };
  
  // Calculate total amount from API data
  const calculateTotalAmount = () => {
    if (!payments.length) return { totalFee: 0, platformFee: 0, netAmount: 0 };
    
    const total = payments.reduce((sum, payment) => {
      // Assuming payment has amount or totalFee field
      const fee = payment.amount || payment.totalAmount || payment.totalFee || 0;
      return sum + (typeof fee === 'string' ? parseFloat(fee.replace('$', '')) : fee);
    }, 0);
    
    const platformFee = total * 0.2; // Assuming 20% platform fee
    const netAmount = total - platformFee;
    
    return {
      totalFee: total,
      platformFee: platformFee,
      netAmount: netAmount
    };
  };
  
  const totals = calculateTotalAmount();
  
  // Handle search with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() !== "") {
        setCurrentPage(1);
      }
    }, 500);
    
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  // Calculate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers = [];
    const totalPages = paginationInfo.totalPages;
    const current = currentPage;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (current <= 3) {
        pageNumbers.push(1, 2, 3, 4, '...', totalPages);
      } else if (current >= totalPages - 2) {
        pageNumbers.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pageNumbers.push(1, '...', current - 1, current, current + 1, '...', totalPages);
      }
    }
    
    return pageNumbers;
  };
  
  if (isLoading) {
    return (
      <div className="p-6 mx-auto w-full rounded-2xl">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }
  
  if (isError) {
    return (
      <div className="p-6 mx-auto w-full rounded-2xl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          Error loading payment data. Please try again.
        </div>
      </div>
    );
  }
  
  return (
<div className="mx-12">

      <div className="p-6   mx-auto border border-gray-200 w-full rounded-2xl bg-white shadow-sm">
      {/* Header with Search and Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Payment History</h2>
          <p className="text-sm text-gray-600 mt-1">
            Total {paginationInfo.total} transactions • Page {currentPage} of {paginationInfo.totalPages}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search Input */}
          {/* <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by tutor or transaction ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
            />
          </div> */}
          
          {/* Filter Toggle Button */}
          {/* <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <BsFilter />
            Filters
          </button> */}
        </div>
      </div>
      
      {/* Date Range Filters */}
      {showFilters && (
        <div className="mb-6 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dateRange.startDate}
                  onChange={(e) => setDateRange({...dateRange, startDate: e.target.value})}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Date
              </label>
              <div className="relative">
                <FiCalendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dateRange.endDate}
                  onChange={(e) => setDateRange({...dateRange, endDate: e.target.value})}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-full"
                />
              </div>
            </div>
            
            <div className="flex items-end gap-2">
              <button
                onClick={() => refetch()}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors w-full"
              >
                Apply Filters
              </button>
              <button
                onClick={() => {
                  setDateRange({ startDate: "", endDate: "" });
                  setSearchTerm("");
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Summary Cards - Only show if there are payments */}
      {payments.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Revenue</p>
                <p className="text-2xl font-bold text-blue-800 mt-2">
                  ${totals.totalFee.toFixed(2)}
                </p>
              </div>
              <div className="bg-blue-100 p-2 rounded-lg">
                <span className="text-blue-600 font-bold">💰</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-green-600 font-medium">Platform Earnings</p>
                <p className="text-2xl font-bold text-green-800 mt-2">
                  ${totals.platformFee.toFixed(2)}
                </p>
              </div>
              <div className="bg-green-100 p-2 rounded-lg">
                <span className="text-green-600 font-bold">🏢</span>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm text-purple-600 font-medium">Pay to Tutors</p>
                <p className="text-2xl font-bold text-purple-800 mt-2">
                  ${totals.netAmount.toFixed(2)}
                </p>
              </div>
              <div className="bg-purple-100 p-2 rounded-lg">
                <span className="text-purple-600 font-bold">👨‍🏫</span>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Table */}
      <div className="overflow-x-auto border border-gray-200 rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                Date
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                Transaction ID
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                Tutor
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                Subject
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                No. of Bookings
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                Platform Fee
              </th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 border-b">
                Total Amount
              </th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <div className="text-4xl mb-2">📄</div>
                    <p className="text-lg font-medium">No payments found</p>
                    <p className="text-sm text-gray-400 mt-1">
                      {searchTerm ? "Try changing your search criteria" : "No payment records available"}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              payments.map((payment, index) => {
                // Extract data from payment object
                // Adjust these based on your actual API response structure
                const tutorName = payment.tutorName || payment.tutor?.name || payment.user?.name || "N/A";
                const subject = payment.subject || payment.course || "N/A";
                const bookings = payment.bookings || payment.sessionCount || payment.numberOfSessions || 0;
                const platformFee = payment.platformFee || "20%";
                const totalAmount = payment.amount || payment.totalAmount || payment.totalFee || "$0";
                const transactionId = payment.transactionId || payment.id || `TXN-${payment._id?.slice(-6)}` || "N/A";
                const date = payment.date || payment.createdAt || payment.paymentDate || "N/A";
                
                return (
                  <tr 
                    key={payment._id || index} 
                    className={`hover:bg-gray-50 transition-colors ${index < payments.length - 1 ? 'border-b border-gray-100' : ''}`}
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {formatDate(date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                      {transactionId}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-semibold">
                          {tutorName.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-sm font-medium text-gray-800">
                          {tutorName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-medium ${
                        subject.toLowerCase().includes('science') 
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : subject.toLowerCase().includes('math')
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : subject.toLowerCase().includes('english')
                          ? 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                          : 'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {subject}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-800 font-medium">
                      {bookings}
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1.5 bg-red-50 text-red-700 rounded-full text-xs font-medium border border-red-100">
                        {platformFee}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-gray-800">
                      {typeof totalAmount === 'number' ? `$${totalAmount.toFixed(2)}` : totalAmount}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination and Items Per Page */}
      {paginationInfo.totalPages > 1 && (
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-6">
          <div className="text-sm text-gray-600">
            Showing {(currentPage - 1) * itemsPerPage + 1} to {Math.min(currentPage * itemsPerPage, paginationInfo.total)} of {paginationInfo.total} transactions
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Show:</span>
              <select 
                value={itemsPerPage}
                onChange={(e) => {
                  setItemsPerPage(Number(e.target.value));
                  setCurrentPage(1);
                }}
                className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg border ${
                  currentPage === 1
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FiChevronLeft size={20} />
              </button>
              
              {getPageNumbers().map((pageNum, index) => (
                <button
                  key={index}
                  onClick={() => typeof pageNum === 'number' ? setCurrentPage(pageNum) : null}
                  className={`min-w-[40px] h-10 flex items-center justify-center rounded-lg text-sm font-medium border transition-colors ${
                    pageNum === currentPage
                      ? "bg-blue-500 text-white border-blue-500"
                      : typeof pageNum === 'number'
                      ? "text-gray-700 border-gray-300 hover:bg-gray-50"
                      : "text-gray-500 border-transparent cursor-default"
                  }`}
                  disabled={pageNum === '...'}
                >
                  {pageNum}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, paginationInfo.totalPages))}
                disabled={currentPage === paginationInfo.totalPages}
                className={`p-2 rounded-lg border ${
                  currentPage === paginationInfo.totalPages
                    ? "text-gray-400 border-gray-300 cursor-not-allowed"
                    : "text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                <FiChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
</div>
  );
};

export default PaymentTable;