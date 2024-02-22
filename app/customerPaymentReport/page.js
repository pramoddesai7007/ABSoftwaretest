"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import * as XLSX from "xlsx";
import { decode } from 'jsonwebtoken';
import { useRouter } from "next/navigation";

const CustomerPaymentReport = () => {
  const [customers, setCustomers] = useState([]);
  const currentDate = new Date().toISOString().split("T")[0];
  const [startDate, setStartDate] = useState(currentDate);
  const [endDate, setEndDate] = useState(currentDate);
  const [filteredCustomers, setFilteredCustomers] = useState([]);

  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      router.push("/reportLogin");
    } else {
      const decodedToken = decode(token);
      if (!decodedToken || decodedToken.role !== "superAdmin") {
        router.push("/reportLogin");
      }
    }
  }, []);



  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    // Filter customers based on date range
    const filtered = customers.filter(customer => {
      if (!customer.dateWiseRecords.length) return false;
      const firstRecordDate = new Date(customer.dateWiseRecords[0].date).toISOString().split("T")[0];
      return firstRecordDate >= startDate && firstRecordDate <= endDate;
    });
    setFilteredCustomers(filtered);
  }, [startDate, endDate, customers]);

  const fetchCustomers = async () => {
    try {
      const response = await axios.get("https://testingback.vercel.app/api/customer/customers");
      // Filter customers who have credit balance but no debit amount
      const filteredCustomers = response.data.filter(customer => customer.creditBalance > 0 && customer.debit === 0);
      setCustomers(response.data);
      setFilteredCustomers(filteredCustomers);
    } catch (error) {
      console.error("Error fetching customers:", error);
    }
  };

  const exportToExcel = () => {
    // Define the sheet data
    const sheetData = filteredCustomers.map((customer, index) => [
      index + 1,
      customer.dateWiseRecords.length > 0
        ? new Date(customer.dateWiseRecords[0].date).toLocaleDateString("en-GB")
        : "",
      customer.customerName,
      customer.mobileNumber.toString(), // Convert mobile number to string
      customer.creditBalance,
      customer.debit,
      customer.balance,
      // Add additional columns as needed
    ]);

    // Create a worksheet
    const ws = XLSX.utils.aoa_to_sheet([
      [
        "Sr",
        "Date",
        "Name",
        "Mobile Number",
        "Credit Balance",
        "Debit Balance",
        "Balance",
      ],
      ...sheetData,
    ]);

    // Create a workbook
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Customer Data");

    // Save the workbook as an Excel file
    XLSX.writeFile(wb, "customer_data.xlsx");
  };

  return (
    <>
      <Navbar />
      <div className="mt-20 font-sans p-2">
        <h1 className="font-bold text-lg">Customer Payment Report</h1>
        <div className="flex space-x-4 my-4">
          <div>
            Start Date:{" "}
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div>
            End Date:{" "}
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <div>
            <button
              className="text-orange-600 font-bold py-1 rounded-full text-sm bg-orange-100 mr-2 px-2 shadow-md"
              onClick={exportToExcel}
            >
              Export to Excel
            </button>
          </div>
        </div>
        {/* Customer Table */}
        <table className="border-collapse border border-gray-300 min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="border p-2">Sr</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Time</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Mobile Number</th>
              <th className="border p-2">Credit Balance</th>
              <th className="border p-2">Debit Balance</th>
              <th className="border p-2">Balance</th>
            </tr>
          </thead>
          <tbody>
            {filteredCustomers.map((customer, index) => (
              <React.Fragment key={customer._id}>
                <tr>
                  <td className="border p-2">{index + 1}</td>
                  <td className="border p-2">
                    {customer.dateWiseRecords.length > 0
                      ? new Date(customer.dateWiseRecords[0].date).toLocaleDateString("en-GB")
                      : ""}
                  </td>
                  <td className="border p-2">
                    {customer.dateWiseRecords.length > 0 ? (
                      <React.Fragment>
                        <table className="border-collapse border border-gray-300 min-w-full divide-y divide-gray-200">
                          <tbody>
                            {customer.dateWiseRecords.map((record, recordIndex) => (
                              <tr key={`${customer._id}-debit-details-${recordIndex}`}>
                                <td className="border p-2">
                                  {new Date(record.date).toLocaleDateString("en-GB")}
                                </td>
                                <td className="border p-2">
                                  {new Date(record.date).toLocaleTimeString("en-US", {
                                    hour: "numeric",
                                    minute: "numeric",
                                    second: "numeric",
                                  })}
                                </td>
                                <td className="border p-2">{record.debit}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </React.Fragment>
                    ) : (
                      "No debit amount"
                    )}
                  </td>
                  <td className="border p-2">{customer.customerName}</td>
                  <td className="border p-2">{customer.mobileNumber}</td>
                  <td className="border p-2">{customer.creditBalance}</td>
                  <td className="border p-2">{customer.debit}</td>
                  <td className="border p-2">{customer.balance}</td>
                </tr>
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default CustomerPaymentReport;