"use client";

// components/PurchaseForm.js
import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlus,
  faTrash,
  faTimes,
  faXmark,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";
import ItemPage from "../itemForm/page";
import Modal from "react-modal";
import SupplierForm from "../supplier/page";
import GSTForm from "../gstForm/page";
import Navbar from "../components/Navbar";
import UnitList from "../unit/page";
import { useRouter } from "next/navigation";

const PurchaseForm = () => {
  const [itemTotals, setItemTotals] = useState({});
  const [lastItemIndex, setLastItemIndex] = useState(-1);
  const [stockQty, setStockQty] = useState("");
  const [discount, setDiscount] = useState(""); // Step 1
  const [grandTotal, setGrandTotal] = useState(""); // New state for grand total
  const [gst, setGst] = useState(0);
  const [isGSTModalOpen, setIsGSTModalOpen] = useState(false);
  const [isUnitModalOpen, setIsUnitModalOpen] = useState(false);
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [showDuplicatePopup, setShowDuplicatePopup] = useState(false);
  const [currentItemGst, setCurrentItemGst] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [itemIndexToDelete, setItemIndexToDelete] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const [itemToDeleteIndex, setItemToDeleteIndex] = useState(null);

  const calculateItemTotal = (item) => {
    const subtotal = parseFloat(item.quantity) * parseFloat(item.pricePerQty);

    if (parseFloat(item.gst) === 0) {
      return subtotal;
    } else {
      const itemGst = parseFloat(item.gst);
      const gstAmount = (subtotal * itemGst) / 100;
      return subtotal + gstAmount;
    }
  };
  const router = useRouter()
  useEffect(() => {
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);

  const handleEditItem = (index) => {
    // Get the item to be edited
    const editedItem = items[index];

    // Populate the form fields with the values of the selected item
    setFormData({
      date: editedItem.date,
      billNo: editedItem.billNo,
      vendor: editedItem.vendor,
      itemName: editedItem.itemName,
      quantity: editedItem.quantity,
      unit: editedItem.unit,
      pricePerQty: editedItem.pricePerQty,
      gst: editedItem.gst,
      gstAmount: editedItem.gstAmount,
      paidAmount: editedItem.paidAmount,
    });

    // Set the discount value
    setDiscount(parseFloat(editedItem.discount || 0));

    // Remove the edited item from the items list
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleConfirmDelete = () => {
    // Get the index of the item to be deleted
    const index = itemToDeleteIndex;

    // Logic to handle item deletion
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);

    // Recalculate totals and set discount to 0
    const newTotals = updatedItems.reduce((totals, item) => {
      totals[item.itemName] = calculateItemTotal(item);
      return totals;
    }, {});

    // Set the discount to 0
    setDiscount(0);

    // Set the updated totals to the state
    setItemTotals(newTotals);

    // Clear the form data
    setFormData({
      date: "",
      billNo: "",
      vendor: "",
      itemName: "",
      quantity: "",
      unit: "",
      pricePerQty: "",
      gst: "",
      gstAmount: "",
      paidAmount: "",
    });

    // Hide the delete confirmation popup
    setDeleteConfirmation(false);
    setItemToDeleteIndex(null);

  };

  const handleDeleteClick = (index) => {
    // Set the index of the item to be deleted and show the delete confirmation popup
    setItemToDeleteIndex(index);
    setDeleteConfirmation(true);
  };

  const handleCancelDelete = () => {
    // Clear the itemToDeleteIndex and hide the delete confirmation popup
    setItemToDeleteIndex(null);
    setDeleteConfirmation(false);
  };

  // Function to open the GST form modal
  const openGSTModal = () => {
    setIsGSTModalOpen(true);
  };

  // Function to close the GST form modal
  const closeGSTModal = () => {
    setIsGSTModalOpen(false);
  };

  const openUnitModal = () => {
    setIsUnitModalOpen(true);
  };

  // Function to close the GST form modal
  const closeUnitModal = () => {
    setIsUnitModalOpen(false);
  };

  const openProductModal = () => {
    setIsProductModalOpen(true);
  };

  // Function to close the GST form modal
  const closeProductModal = () => {
    setIsProductModalOpen(false);
  };

  const openVendorModal = () => {
    setIsVendorModalOpen(true);
  };

  // Function to close the GST form modal
  const closeVendorModal = () => {
    setIsVendorModalOpen(false);
  };

  const [formData, setFormData] = useState({
    billNo: "",
    date: getCurrentDate(),
    vendor: "",
    itemName: "",
    quantity: "",
    unit: "",
    pricePerQty: "",
    gst: 0,
    gstAmount: "",
    paidAmount: "",
  });

  const [vendors, setVendors] = useState([]);
  const [products, setProducts] = useState([]);
  const [units, setUnits] = useState([]);
  const [gsts, setGsts] = useState([]);
  const [items, setItems] = useState([]);

  function getCurrentDate() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  useEffect(() => {
    const fetchStockQty = async () => {
      try {
        const response = await axios.get(
          `https://testingback.vercel.app/api/purchase/purchase/stockQty?itemName=${formData.itemName}`
        );
        console.log("stock Quantity", response.data.stockQty);
        setStockQty(response.data.stockQty);
      } catch (error) {
        console.error("Error fetching stock quantity:", error);
      }
    };

    if (formData.itemName) {
      fetchStockQty();
    }
  }, [formData.itemName]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(
          "https://testingback.vercel.app/api/supplier/suppliers"
        );
        setVendors(response.data);
      } catch (error) {
        console.error("Error fetching vendors:", error);
      }
    };
    fetchVendors();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://testingback.vercel.app/api/item/items"
        );
        setProducts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchGSTList = async () => {
      try {
        const response = await axios.get("https://testingback.vercel.app/api/gst/list");
        setGsts(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };
    fetchGSTList();
  }, []);

  useEffect(() => {
    const fetchUnitList = async () => {
      try {
        const response = await axios.get(
          "https://testingback.vercel.app/api/unit/units"
        );
        setUnits(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching Products:", error);
      }
    };

    fetchUnitList();
  }, []);

  useEffect(() => {
    const subtotal = Object.values(itemTotals).reduce(
      (total, itemTotal) => total + (itemTotal || 0),
      0
    );
    const discountAmount = parseFloat(discount) || 0;
    const calculatedGrandTotal = subtotal - discountAmount;

    setGrandTotal(calculatedGrandTotal.toFixed(2));
  }, [itemTotals, discount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name === "discount") {
      setDiscount(value);
    } else if (name === "paidAmount") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value !== undefined ? value : "",
      }));
    } else if (name === "gst") {
      // Update GST amount for the current item
      const selectedProduct = products.find(
        (product) => product.itemName === formData.itemName
      );
      const gstPercentage = parseFloat(value); // Convert GST percentage to a float

      if (selectedProduct && !isNaN(gstPercentage)) {
        const gstAmount =
          (parseFloat(formData.quantity) *
            parseFloat(formData.pricePerQty) *
            gstPercentage) /
          100;
        setCurrentItemGst(gstAmount);
      } else {
        setCurrentItemGst(0); // Set GST amount to 0 if there is an issue with GST percentage
      }

      setFormData((prevFormData) => ({
        ...prevFormData,
        gst: value !== undefined ? value : 0, // Set default GST to 0 if not selected
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }
    console.log("Updated itemName:", formData.itemName);
  };

  useEffect(() => {
    const newItemTotal = calculateItemTotal(formData);
    setItemTotals((prevItemTotals) => ({
      ...prevItemTotals,
      [formData.itemName]: newItemTotal,
    }));
  }, [formData, discount]);

  const handleAddItem = () => {
    // Check if the GST percentage is 0
    if (parseFloat(formData.gst) === 0) {
      // GST is 0, proceed to add the item without checking other required fields
      const newItem = createNewItem({
        ...formData,
        gst: 0, // Set GST to 0
        gstAmount: 0, // Set GST amount to 0
      });

      if (items.some((item) => item.itemName === newItem.itemName)) {
        setErrorMessage(
          "Item already added in the list. Please choose a different item."
        );
        setShowErrorModal(true);
        return;
      }

      // Update state
      setItems((prevItems) => [...prevItems, newItem]);
      setFormData({
        date: formData.date,
        billNo: formData.billNo,
        vendor: formData.vendor,
        itemName: "",
        quantity: "",
        unit: "",
        pricePerQty: "",
        gst: formData.gst, // Reset GST in the form
        gstAmount: "", // Reset GST amount in the form
        paidAmount: "",
      });
      setLastItemIndex((prevLastItemIndex) => prevLastItemIndex + 1);
    } else {
      if (
        !formData.billNo ||
        !formData.date ||
        !formData.vendor ||
        !formData.itemName ||
        !formData.quantity ||
        !formData.unit ||
        !formData.pricePerQty ||
        !formData.gst
      ) {
        console.error("Please fill in all required fields.");
        return;
      }

      // Calculate GST amount for the current item
      const gstPercentage = parseFloat(formData.gst);
      const gstAmount =
        (parseFloat(formData.quantity) *
          parseFloat(formData.pricePerQty) *
          gstPercentage) /
        100;

      // Create a new item object
      const newItem = createNewItem({
        ...formData,
        gst: gstPercentage, // Use GST as GST percentage
        gstAmount: gstAmount.toFixed(2), // Store GST amount in the item
      });

      if (items.some((item) => item.itemName === newItem.itemName)) {
        console.error(
          "Item already added in the list. Please choose a different item."
        );
        return;
      }

      // Update state
      setItems((prevItems) => [...prevItems, newItem]);
      setFormData({
        date: formData.date,
        billNo: formData.billNo,
        vendor: formData.vendor,
        itemName: "",
        quantity: "",
        unit: "",
        pricePerQty: "",
        gst: "", // Reset GST in the form
        gstAmount: "", // Reset GST amount in the form
        paidAmount: "",
      });
      setLastItemIndex((prevLastItemIndex) => prevLastItemIndex + 1);
    }
  };

  const handleCloseErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  // Helper function to create a new item object
  const createNewItem = (formData) => ({
    billNo: formData.billNo,
    date: formData.date,
    vendor: formData.vendor,
    itemName: formData.itemName,
    quantity: formData.quantity,
    unit: formData.unit,
    pricePerQty: formData.pricePerQty,
    gst: formData.gst,
    gstAmount: formData.gstAmount,
  });

  const handleSave = async () => {
    try {
      // Calculate the GST amount based on the individual items
      const calculatedGst = parseFloat(gst).toFixed(2); // Use calculated GST
      const calculatedSubtotal = parseFloat(
        Object.values(itemTotals)
          .reduce((total, itemTotal) => total + (itemTotal || 0), 0)
          .toFixed(2)
      );
      const calculatedBalance = (
        parseFloat(grandTotal) - parseFloat(formData.paidAmount || 0)
      ).toFixed(2);

      const formattedItems = items.map((item) => ({
        productName: item.itemName,
        quantity: parseFloat(item.quantity),
        unit: item.unit,
        pricePerQty: parseFloat(item.pricePerQty),
      }));

      const data = {
        date: formData.date || "",
        billNo: formData.billNo || "",
        vendor: formData.vendor || "",
        subtotal: isNaN(calculatedSubtotal) ? 0 : calculatedSubtotal,
        gst: isNaN(calculatedGst) ? 0 : calculatedGst,
        gstAmount: parseFloat(currentItemGst).toFixed(2), // Use currentItemGst
        paidAmount: parseFloat(formData.paidAmount || 0).toFixed(2),
        discount: parseFloat(discount || 0).toFixed(2),
        items: formattedItems,
        balance: calculatedBalance, // Include balance in the data
      };

      // Log the data to be saved
      console.log("Data to be saved:", data);

      // Make a POST request to save the bill
      const response = await axios.post(
        "https://testingback.vercel.app/api/purchase/purchase/savebill",
        data
      );

      // Log the response after saving
      console.log("Bill saved successfully:", response.data);

      const vendorName = response.data.vendorName; // Assuming the response contains the supplier ID

      if (parseFloat(data.total) > 0) {
        // If there is a paid amount, update the supplier's debit balance
        await axios.post("https://testingback.vercel.app/api/supplier/supplier/debit", {
          vendorName,
          amount: parseFloat(data.paidAmount),
        });
      } else {
        // If there is no paid amount, update the supplier's credit balance
        await axios.post("https://testingback.vercel.app/api/supplier/supplier/credit", {
          vendorName,
          amount: parseFloat(data.balance),
        });
      }
      // Reset the form and item list after saving
      setFormData({
        billNo: "",
        date: "",
        vendor: "",
        itemName: "",
        quantity: "",
        unit: "",
        pricePerQty: "",
        gst: "",
        gstAmount: "",
        paidAmount: "",
      });
      setItems([]);
      setItemTotals({});
      setGst(0); // Reset the GST amount
      setCurrentItemGst(0); // Reset currentItemGst

      // Show success popup
      setShowSuccessPopup(true);
      // Hide duplicate popup if it was shown before
      setShowDuplicatePopup(false);

      // Automatically close success popup after 3 seconds (adjust duration as needed)
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (error) {
      console.error(
        "Error saving the bill:",
        error.response ? error.response.data : error.message
      );

      // Show duplicate popup if duplicate bill number error occurs
      if (error.response && error.response.status === 400) {
        setShowDuplicatePopup(true);

        // Automatically close duplicate popup after 3 seconds (adjust duration as needed)
        setTimeout(() => {
          setShowDuplicatePopup(false);
        }, 3000);
      }
      // Hide success popup if it was shown before
      setShowSuccessPopup(false);
    }
  };

  useEffect(() => {
    if (lastItemIndex !== -1) {
      // Initialize itemTotals with empty objects for each item in items array
      const initialItemTotals = items.reduce((totals, item) => {
        totals[item.itemName] = calculateItemTotal(item);
        return totals;
      }, {});
      setItemTotals(initialItemTotals);
      setLastItemIndex(-1); // Reset lastItemIndex
    }
  }, [items, lastItemIndex])

  return (
    <>
      <Navbar />


      <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow-md font-sans mt-10">
        <h2 className="text-2xl font-semibold mb-6">Purchase Bill Form</h2>

        {/* Add Item Form */}
        <div className="mb-5 ">
          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={getCurrentDate()}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Bill Number
              </label>
              <input
                type="text"
                name="billNo"
                value={formData.billNo}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <Modal
                isOpen={isVendorModalOpen}
                onRequestClose={closeVendorModal}
                contentLabel="Product Modal"
                style={{
                  overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the overlay background color and transparency
                  },
                  content: {
                    width: "700px", // Set the width of the content
                    height: "450px", // Set the height of the content
                    margin: "auto", // Center the modal
                  },
                }}
              >
                <button
                  onClick={closeVendorModal}

                  className="float-right text-black"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1 top-3 right-3 absolute" />

                  <SupplierForm />
                </button>
              </Modal>
              <label className="block text-sm font-medium text-gray-600">
                Vendor Name
                <button
                  onClick={openVendorModal}
                  className="text-white align-middle px-1 float-right font-bold bg-red-500 text-l rounded-full"
                >
                  <FontAwesomeIcon icon={faPlus} className="" />
                </button>
              </label>
              <select
                name="vendor"
                value={formData.vendor}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              >
                <option value="" disabled>
                  Select Vendor
                </option>
                {vendors.map((vendor) => (
                  <option key={vendor._id} value={vendor.vendorName}>
                    {vendor.vendorName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              {showSuccessPopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-green-100 border border-green-400 rounded shadow-md z-10">
                  <p className="text-green-700">Bill saved successfully!</p>
                </div>
              )}

              {showDuplicatePopup && (
                <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 p-4 bg-red-100 border border-red-400 rounded shadow-md z-10">
                  <p className="text-red-700">
                    Duplicate bill number! Please choose a different bill
                    number.
                  </p>
                </div>
              )}
              <Modal
                isOpen={isProductModalOpen}
                onRequestClose={closeProductModal}
                contentLabel="Product Modal"
                style={{
                  overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the overlay background color and transparency
                  },
                  content: {
                    width: "500px", // Set the width of the content
                    height: "500px", // Set the height of the content
                    margin: "auto", // Center the modal
                  },
                }}
              >
                <div className="p-1">
                  <button
                    onClick={closeProductModal}
                    className="absolute top-4 right-4 bg-red-100 text-red-600 hover:bg-red-200 p-2 py-1 rounded-full text-center"
                  >
                    <FontAwesomeIcon icon={faTimes} size="lg" />
                  </button>

                  <ItemPage />
                </div>
              </Modal>

              <label className="block text-sm font-medium text-gray-600">
                Product Name
                <button
                  onClick={openProductModal}
                  className="text-white align-middle px-1 float-right font-bold bg-red-500 text-l rounded-full"
                >
                  <FontAwesomeIcon icon={faPlus} className="" />
                </button>
              </label>
              <select
                name="itemName"
                value={formData.itemName}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              >
                <option value="" disabled>
                  Select Product
                </option>
                {products.map((product) => (
                  <option key={product._id} value={product.itemName}>
                    {product.itemName}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Stock Quantity
              </label>
              <input
                type="text"
                value={stockQty}
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Quantity
              </label>
              <input
                type="text"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              />
            </div>

            <Modal
              isOpen={isUnitModalOpen}
              onRequestClose={closeUnitModal}
              contentLabel="Unit Modal"
              style={{
                overlay: {
                  backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the overlay background color and transparency
                },
                content: {
                  width: "600px", // Set the width of the content
                  height: "500px", // Set the height of the content
                  margin: "auto", // Center the modal
                },
              }}
            >
              <div className="p-1">
                <button
                  onClick={closeUnitModal}
                  className="float-right text-black"
                >
                  <FontAwesomeIcon icon={faTimes} className="mr-1" />
                </button>
                <UnitList />
              </div>
            </Modal>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                Unit
                <button
                  onClick={openUnitModal}
                  className="text-white align-middle px-1 float-right font-bold bg-red-500 text-l rounded-full"
                >
                  <FontAwesomeIcon icon={faPlus} className="" />
                </button>
              </label>
              <select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              >
                <option value="" disabled>
                  Select Unit
                </option>
                {units.map((unit) => (
                  <option key={unit._id} value={unit.unit}>
                    {unit.unit}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Price Per Unit
              </label>
              <input
                type="text"
                name="pricePerQty"
                value={formData.pricePerQty}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              />
            </div>
            <div>
              <Modal
                isOpen={isGSTModalOpen}
                onRequestClose={closeGSTModal}
                contentLabel="Product Modal"
                style={{
                  overlay: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)", // Adjust the overlay background color and transparency
                  },
                  content: {
                    width: "400px", // Set the width of the content
                    height: "400px", // Set the height of the content
                    margin: "auto", // Center the modal
                  },
                }}
              >
                <div className="p-1">
                  <button
                    onClick={closeGSTModal}
                    className="float-right text-black"
                  >
                    <FontAwesomeIcon icon={faTimes} className="mr-1" />
                  </button>
                  <GSTForm />
                </div>
              </Modal>
              GST
              <button
                onClick={openGSTModal}
                className="text-white align-middle px-1 float-right font-bold bg-red-500 text-l rounded-full"
              >
                <FontAwesomeIcon icon={faPlus} className="" />
              </button>
              <select
                name="gst"
                value={formData.gst}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
                required
              >
                <option value="" disabled>
                  Select GST
                </option>
                {gsts.map((gst) => (
                  <option key={gst._id} value={gst.gstPercentage}>
                    {gst.gstPercentage}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600">
                GST Amount
              </label>
              <input
                type="text"
                value={currentItemGst.toFixed(2)}
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600">
                Total for {formData.itemName}
              </label>
              <input
                type="text"
                value={
                  itemTotals[formData.itemName]
                    ? itemTotals[formData.itemName].toFixed(2)
                    : "0.00"
                }
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>
          </div>

          <div className="flex justify-between mt-2">
            <button
              type="button"
              onClick={handleAddItem}
              className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
            >
              Add Item
            </button>
          </div>
        </div>

        {/* Display Added Items */}
        <div className="flex">
          <div className="flex-1 mr-4">
            <table className="w-full">
              <thead className="text-sm bg-zinc-100 text-yellow-600 border">
                <tr>
                  <th className="p-3 text-left text-gray lg:pl-4 pl-4  whitespace-nowrap">Sr No.</th>
                  <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">Item Name</th>
                  <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">Quantity</th>
                  <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">Unit</th>
                  <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">Price Per Qty</th>
                  <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">GST</th>
                  <th className="p-3 text-left text-gray lg:pl-4 pl-4 whitespace-nowrap">Total</th>
                  <th className="p-3 text-center whitespace-nowrap">Actions</th>
                  {/* New column for total */}
                  {/* Add more columns for other item details */}
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td className="p-1 text-left text-gray lg:pl-4 pl-4">{index + 1}</td>
                    <td className="p-1 text-left text-gray lg:pl-4 pl-4">{item.itemName}</td>
                    <td className="p-1 text-left text-gray lg:pl-4 pl-4">{item.quantity}</td>
                    <td className="p-1 text-left text-gray lg:pl-4 pl-4">{item.unit}</td>
                    <td className="p-1 text-left text-gray lg:pl-4 pl-4">{item.pricePerQty}</td>
                    <td className="p-1 text-left text-gray lg:pl-4 pl-4">{item.gst}</td>
                    <td className="p-1 text-left text-gray lg:pl-4 pl-4">{calculateItemTotal(item).toFixed(2)}
                    </td>
                    <td className="p-1 text-center">
                      <button
                        onClick={() => handleEditItem(index)}
                        className="text-gray-600 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          color="orange"
                          className="cursor-pointer"
                        />{" "}


                      </button>

                      <button
                        onClick={() => handleDeleteClick(index)}
                        className="text-gray-600 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
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
                {itemToDeleteIndex !== null && (
                  <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50">
                    <div className="bg-white p-6 rounded shadow-lg">
                      <p>Are you sure you want to delete?</p>
                      <div className="flex justify-end mt-4">
                        <button onClick={handleConfirmDelete} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mr-2">Yes</button>
                        <button onClick={handleCancelDelete} className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400">No</button>
                      </div>
                    </div>
                  </div>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex-1 lg:ml-24  ">
            <div className="container">
              <label className="block text-sm font-medium text-gray-600">
                SubTotal
              </label>
              <input
                type="text"
                value={Object.values(itemTotals)
                  .reduce((total, itemTotal) => total + (itemTotal || 0), 0)
                  .toFixed(2)}
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-600">
                Discount
              </label>
              <input
                type="text"
                name="discount"
                value={discount}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full border rounded-md text-sm"
              />
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-600">
                Grand Total
              </label>
              <input
                type="text"
                value={grandTotal}
                className="mt-1 p-1 w-full  border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>

            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-600">
                Paid Amount
              </label>
              <input
                type="text"
                name="paidAmount"
                value={formData.paidAmount}
                onChange={handleInputChange}
                className="mt-1 p-1 w-full  border rounded-md text-sm"
              />
            </div>

            {/* Balance */}
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-600">
                Balance
              </label>
              <input
                type="text"
                // value={(parseFloat(Object.values(itemTotals).reduce((total, itemTotal) => total + (itemTotal || 0), 0).toFixed(2)) - parseFloat(formData.discount || 0) - parseFloat(formData.paidAmount || 0)).toFixed(2)}
                value={(
                  parseFloat(grandTotal) - parseFloat(formData.paidAmount || 0)
                ).toFixed(2)}
                className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                readOnly
              />
            </div>
            {/* Save and Print Button */}
            <div className="flex justify-between">
              <button
                type="button"
                onClick={handleSave}
                className=" bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4  mx-auto"
              >
                Save Bill
              </button>
            </div>
          </div>
        </div>
      </div>

      {showErrorModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto top-36">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            {/* Modal content */}
            <div className="inline-block align-middle bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    {/* Icon or any visual indication */}
                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      Not Allowed
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleCloseErrorModal}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PurchaseForm;