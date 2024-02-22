
"use client";
import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faClock,
  faMoneyBill,
  faList,
  faCubes,
  faShoppingCart,
  faChair,
  faMoneyCheckAlt,
  faTasks,
  faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import jwt from "jsonwebtoken"; // Import jwt library for decoding JWT tokens


const Report = () => {
  const [userRole, setUserRole] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Retrieve user role from local storage
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      const decodedToken = jwt.decode(authToken);
      if (decodedToken && decodedToken.role) {
        const userRole = decodedToken.role.toLowerCase(); // Normalize to lowercase
        setUserRole(userRole);
      }
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (!loading && userRole !== "superadmin") {
      router.push("/reportLogin");
    }
  }, [loading, userRole]);

  if (loading) {
    return <div>Loading...</div>; // Render a loading indicator until user role is determined
  }

  return (
    <>
      <Navbar />
      <div>
        <section className="text-gray-600 body-font m-5 p-5 justify-center font-sans mt-12">
          <div className="container px-5 py-1 mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 md:p-6">
                <Link href="/reports">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faClock}
                        size="3x"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Daily Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4 md:p-6">
                <Link href="/kotReports">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faReceipt}
                        size="3x"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">KOT Reports</h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4 md:p-6">
                <Link href="/menuReports">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon icon={faList} size="3x" color="orange" />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Menu-wise Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4 md:p-6">
                <Link href="/stockList">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faCubes}
                        size="3x"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Stock Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4 md:p-6">
                <Link href="/purchaseReport">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faShoppingCart}
                        size="3x"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Purchase Report
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>

              <div className="p-4 md:p-6">
                <Link href="/orderHistory">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faChair}
                        size="3x"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Edit Bill Reports
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="p-4 md:p-6">
                <Link href="/customerPaymentReport">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faTasks}
                        size="3x"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Customer Payment Reports
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="p-4 md:p-6">
                <Link href="/expenseReport">
                  <div className="relative h-48 rounded overflow-hidden shadow-sm bg-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="rounded-full bg-orange-100 p-4 shadow-md">
                      <FontAwesomeIcon
                        icon={faMoneyCheckAlt}
                        size="3x"
                        color="orange"
                      />
                    </div>
                    <div className="mt-4">
                      <h3 className="text-black font-bold mb-1">
                        Expenses Reports
                      </h3>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Report;


