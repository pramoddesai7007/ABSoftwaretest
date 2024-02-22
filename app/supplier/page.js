"use client";

// components/SupplierForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
// import Link from 'next/link';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash, faTimes } from "@fortawesome/free-solid-svg-icons";
import Navbar from "../components/Navbar";
import { useRouter } from "next/navigation";

const SupplierForm = () => {
  const [suppliers, setSuppliers] = useState([]);
  const [editedSupplier, setEditedSupplier] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [isSuccessPopupOpen, setIsSuccessPopupOpen] = useState(false); // New state for success popup
  const [error, setError] = useState("");

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const [formData, setFormData] = useState({
    vendorName: "",
    address: "",
    contactNumber: "",
    emailId: "",
    gstNumber: "",
    openingBalance: "",
  });

  const router = useRouter()
  useEffect(() => {
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);


  // Function to handle input changes and capitalize the first letter
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Capitalize the first letter if the input is not empty
    const capitalizedValue = value !== '' && (name === 'vendorName' || name === 'address')
      ? capitalizeFirstLetter(value)
      : value;

    setFormData((prevData) => ({
      ...prevData,
      [name]: capitalizedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Make an API request using Axios to post the form data
      await axios.post(
        "https://testingback.vercel.app/api/supplier/suppliers",
        formData
      );

      // Fetch the updated list of suppliers
      const response = await axios.get(
        "https://testingback.vercel.app/api/supplier/suppliers"
      );
      setSuppliers(response.data);

      // Reset the form after submission
      setFormData({
        vendorName: "",
        address: "",
        contactNumber: "",
        emailId: "",
        gstNumber: "",
        openingBalance: "",
      });

      // Open the success popup
      setIsSuccessPopupOpen(true);

      // Close the success popup after a few seconds (e.g., 3 seconds)
      setTimeout(() => {
        setIsSuccessPopupOpen(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error.message);
      // Check if the error is due to an existing email
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        setError(error.response.data.message);
      } else {
        setError("An email already exists.");
      }

      // Clear the error after 2 seconds
      setTimeout(() => {
        setError("");
      }, 2000);
    }
  };
  useEffect(() => {
    const fetchSuppliers = async () => {
      try {
        const response = await axios.get(
          "https://testingback.vercel.app/api/supplier/suppliers"
        );
        setSuppliers(response.data);
      } catch (error) {
        console.error("Error fetching suppliers:", error);
      }
    };

    fetchSuppliers();
  }, []);

  const handleEdit = (supplier) => {
    setEditedSupplier(supplier);
    setIsEditModalOpen(true);
  };

  const handleDelete = (supplier) => {
    setEditedSupplier(supplier);
    setIsDeleteConfirmationModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.patch(
        `https://testingback.vercel.app/api/supplier/suppliers/${editedSupplier._id}`,
        editedSupplier
      );

      // Assuming the API returns the updated supplier
      const updatedSupplier = response.data;

      // Update the state with the updated supplier
      setSuppliers((prevSuppliers) =>
        prevSuppliers.map((supplier) =>
          supplier._id === updatedSupplier._id ? updatedSupplier : supplier
        )
      );

      // Close the edit modal
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error updating supplier:", error);
    }
  };

  const handleDeleteConfirmed = async () => {
    try {
      // Assuming the API returns the deleted supplier
      await axios.delete(
        `https://testingback.vercel.app/api/supplier/suppliers/${editedSupplier._id}`
      );

      // Update the state by removing the deleted supplier
      setSuppliers((prevSuppliers) =>
        prevSuppliers.filter((supplier) => supplier._id !== editedSupplier._id)
      );

      // Close the delete modal
      setIsDeleteConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error deleting supplier:", error);
    }
  };
  return (
    <>
      <Navbar />
      <div className=" max-w-5xl mx-auto bg-white p-4 rounded-lg shadow-md mt-14 font-sans">
        <div className=" font-bold ml-1 text-xl mb-3 text-orange-500"><h2>Add Vendor</h2></div>
        <form onSubmit={handleSubmit} className=" mx-auto mt-4">
          {error && (
            <div className="text-red-500 mb-4 text-center">{error}</div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="mb-4">
              <label
                htmlFor="vendorName"
                className="block text-sm font-medium text-gray-600"
              >
                Vendor Name:
              </label>
              <input
                type="text"
                id="vendorName"
                name="vendorName"
                value={formData.vendorName}
                onChange={handleChange}
                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="address"
                className="block text-sm font-medium text-gray-600"
              >
                Address:
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="emailId"
                className="block text-sm font-medium text-gray-600"
              >
                Email ID:
              </label>
              <input
                type="text"
                id="emailId"
                name="emailId"
                value={formData.emailId}
                onChange={handleChange}
                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="mb-4">
              <label
                htmlFor="contactNumber"
                className="block text-sm font-medium text-gray-600"
              >
                Contact Number:
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleChange}
                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="gstNumber"
                className="block text-sm font-medium text-gray-600"
              >
                GST Number:
              </label>
              <input
                type="text"
                id="gstNumber"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="openingBalance"
                className="block text-sm font-medium text-gray-600"
              >
                Opening Balance:
              </label>
              <input
                type="text"
                id="openingBalance"
                name="openingBalance"
                value={formData.openingBalance}
                onChange={handleChange}
                className="mt-1 p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
              />
            </div>
          </div>



          <div className="col-span-2 flex justify-center mt-1">
            <button
              type="submit"
              className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
            >
              Submit
            </button>
          </div>
        </form>

        <div className="container mx-full p-4">
          <div className="custom-scrollbars overflow-auto max-h-full">
            {" "}
            {/* Adjust max-h-60 as needed */}
            <table className="min-w-full">
              <thead className="text-sm bg-zinc-100 text-yellow-600 border">
                <tr>
                  <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Name</th>
                  <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Address</th>
                  <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Contact No.</th>
                  <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Email</th>
                  <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">GST</th>
                  <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                    Opening Bal.
                  </th>
                  <th className="p-1 ">Actions</th>
                </tr>
              </thead>
              <tbody className="text-sm font-sans font-semibold">
                {suppliers.map((supplier, index) => (
                  <tr key={supplier._id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 '}
                  >
                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                      {supplier.vendorName}
                    </td>
                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                      {supplier.address}
                    </td>
                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                      {supplier.contactNumber}
                    </td>
                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                      {supplier.emailId}
                    </td>
                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                      {supplier.gstNumber}
                    </td>
                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">
                      {supplier.openingBalance}
                    </td>
                    <td className="p-1 text-left text-gray flex items-center space-x-3">
                      <button
                        className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                        onClick={() => handleEdit(supplier)}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          color="orange"
                          className="cursor-pointer"
                        />{" "}

                      </button>
                      <button
                        className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                        onClick={() => handleDelete(supplier)}
                      >
                        <FontAwesomeIcon
                          icon={faTrash}
                          color="red"
                          className="cursor-pointer"
                        />{" "}

                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Edit Modal */}
          {isEditModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Modal Overlay */}
              <div className="fixed inset-0 bg-black opacity-50">
              </div>

              {/* Modal Content */}
              <div className="relative z-50 bg-white p-6 rounded-md shadow-lg ">
                <div className=' absolute right-12'>
                  <button
                    onClick={() => setIsEditModalOpen(false)}
                    className="absolute bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>
                </div>
                <h2 className="text-2xl font-bold mb-4">Edit Supplier</h2>

                {/* Edit Form */}
                <form
                  onSubmit={handleEditSubmit}
                  className=" lg:w-96"
                >
                  {/* Vendor Name */}
                  <div className="mb-2">
                    <label
                      htmlFor="editVendorName"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Vendor Name:
                    </label>
                    <input
                      type="text"
                      id="editVendorName"
                      name="editVendorName"
                      value={editedSupplier.vendorName}
                      onChange={(e) =>
                        setEditedSupplier({
                          ...editedSupplier,
                          vendorName: e.target.value,
                        })
                      }
                      className=" p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>
                  <div className="flex justify-between">
                    {/* Contact Number */}
                    <div className="mb-2">
                      <label
                        htmlFor="editContactNumber"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Contact No:
                      </label>
                      <input
                        type="text"
                        id="editContactNumber"
                        name="editContactNumber"
                        value={editedSupplier.contactNumber}
                        onChange={(e) =>
                          setEditedSupplier({
                            ...editedSupplier,
                            contactNumber: e.target.value,
                          })
                        }
                        className="p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
                    {/* Opening Balance */}
                    <div className="mb-2 ml-6">
                      <label
                        htmlFor="editOpeningBalance"
                        className="block text-sm font-medium text-gray-600"
                      >
                        Opening Balance:
                      </label>
                      <input
                        type="text"
                        id="editOpeningBalance"
                        name="editOpeningBalance"
                        value={editedSupplier.openingBalance}
                        onChange={(e) =>
                          setEditedSupplier({
                            ...editedSupplier,
                            openingBalance: e.target.value,
                          })
                        }
                        className="p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                      />
                    </div>
                  </div>

                  {/* Address */}
                  <div className="mb-2">
                    <label
                      htmlFor="editAddress"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Address:
                    </label>
                    <input
                      type="text"
                      id="editAddress"
                      name="editAddress"
                      value={editedSupplier.address}
                      onChange={(e) =>
                        setEditedSupplier({
                          ...editedSupplier,
                          address: e.target.value,
                        })
                      }
                      className="p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>



                  {/* Email ID */}
                  <div className="mb-2">
                    <label
                      htmlFor="editEmailId"
                      className="block text-sm font-medium text-gray-600"
                    >
                      Email ID:
                    </label>
                    <input
                      type="text"
                      id="editEmailId"
                      name="editEmailId"
                      value={editedSupplier.emailId}
                      onChange={(e) =>
                        setEditedSupplier({
                          ...editedSupplier,
                          emailId: e.target.value,
                        })
                      }
                      className="p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>

                  {/* GST Number */}
                  <div className="mb-2">
                    <label
                      htmlFor="editGstNumber"
                      className="block text-sm font-medium text-gray-600"
                    >
                      GST No:
                    </label>
                    <input
                      type="text"
                      id="editGstNumber"
                      name="editGstNumber"
                      value={editedSupplier.gstNumber}
                      onChange={(e) =>
                        setEditedSupplier({
                          ...editedSupplier,
                          gstNumber: e.target.value,
                        })
                      }
                      className="p-1 border rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
                    />
                  </div>



                  {/* Save Button */}
                  <div className="col-span-2 flex justify-center mt-1">
                    <button
                      type="submit"
                      className=" bg-green-100 hover:bg-green-200 text-green-700 font-bold py-2 px-12 rounded-full ml-4"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Delete Confirmation Modal */}
          {isDeleteConfirmationModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center">
              {/* Modal Overlay */}
              <div className="fixed inset-0 bg-black opacity-50"></div>

              {/* Modal Content */}
              <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
                <p className="text-red-600 font-semibold mb-4">
                  Are you sure you want to delete this supplier?
                </p>
                {/* Delete Button */}
                <button
                  onClick={handleDeleteConfirmed}
                  className=" bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2"
                >
                  Yes
                </button>
                <button
                  onClick={() => setIsDeleteConfirmationModalOpen(false)}
                  className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
                >
                  No
                </button>
              </div>
            </div>
          )}
        </div>
        {/* Success Popup */}
        {isSuccessPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Modal Overlay */}
            <div className="fixed inset-0 bg-black opacity-50"></div>

            {/* Modal Content */}
            <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
              <h2 className="text-2xl font-bold mb-4">
                Vendor Added Successfully!
              </h2>
              {/* <p className="text-gray-700">You have successfully added a new vendor.</p> */}
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SupplierForm;