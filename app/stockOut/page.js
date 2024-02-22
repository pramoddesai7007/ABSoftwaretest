
'use client'

// components/StockOutwardForm.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Unit from "../unit/page";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faTrash,
    faTimes,
    faXmark,
} from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";

import Modal from "react-modal";
import ItemPage from "../itemForm/page";
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';

const StockOutwardForm = () => {
    const [waiterName, setWaiterName] = useState('');
    const [productName, setProductName] = useState('');
    const [stockQty, setStockQty] = useState('');
    const [mobileNumber, setMobileNumber] = useState('');
    const [waitersList, setWaitersList] = useState([]);
    const [stockOutwardList, setStockOutwardList] = useState([]);
    const [productNames, setProductNames] = useState([]);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [unit, setUnit] = useState(''); // Add unit state
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);
    const [insufficientStockPopup, setInsufficientStockPopup] = useState(false);

    const router = useRouter()
    useEffect(() => {
        const authToken = localStorage.getItem("EmployeeAuthToken");
        if (!authToken) {
          router.push("/login");
        }
      }, []);
    

    const openInsufficientStockPopup = () => {
        setInsufficientStockPopup(true);

        // Set a timer to close the popup after 2 seconds
        setTimeout(() => {
            setInsufficientStockPopup(false);
        }, 2000);
    };

    const closeInsufficientStockPopup = () => {
        setInsufficientStockPopup(false);
    };




    const openProductModal = () => {
        setIsProductModalOpen(true);
    };

    // Function to close the GST form modal
    const closeProductModal = () => {
        setIsProductModalOpen(false);
    };

    const handleAddItems = async () => {
        try {
            if (parseInt(stockQty, 10) > availableQuantity) {
                // Display an error message or handle the insufficient stock case
                // console.error('Insufficient stock quantity');
                openInsufficientStockPopup(); // Open the pop-up
                return;
            }

            // Make an API call to add items to stock outward entries
            await axios.post('https://testingback.vercel.app/api/stockOut/stockOut/addItems', {
                waiterName,
                productName,
                stockQty,
                availableQuantity
            });

            // Make an API call to update available quantity
            await axios.post('https://testingback.vercel.app/api/item/items/updateQuantity', {
                productName,
                stockQty,
            });

            // After adding items and updating available quantity, fetch the updated lists
            await fetchStockOutwardList();
            await fetchProductNames();

            // Clear the input fields
            setWaiterName('');
            setProductName('');
            setStockQty('');
            setMobileNumber('');
            setUnit('');
        } catch (error) {
            console.error('Error adding items:', error.response ? error.response.data : error.message);
        }
    };

    const handleInputChange = async (e) => {
        const { name, value } = e.target;
        try {
            if (name === 'waiterName') {
                setWaiterName(value);
                const response = await axios.get(`https://testingback.vercel.app/api/waiter/waiter/mobile?name=${value}`);
                setMobileNumber(response.data.mobileNumber);
            } else if (name === 'productName') {
                setProductName(value);
                const response = await axios.get(`https://testingback.vercel.app/api/item/items/quantity?productName=${value}`);
                setAvailableQuantity(response.data.availableQuantity);
                setUnit(response.data.unit); // Set unit
            } else if (name === 'stockQty') {
                setStockQty(value);
            }
        } catch (error) {
            console.error('Error:', error.response ? error.response.data : error.message);
        }
    };

    const fetchProductNames = async () => {
        try {
            const response = await axios.get('https://testingback.vercel.app/api/item/items');
            setProductNames(response.data);
        } catch (error) {
            console.error('Error fetching product names:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchStockOutwardList();
        fetchWaitersList();
        fetchProductNames();
    }, []);


    const fetchStockOutwardList = async () => {
        try {
            const response = await axios.get('https://testingback.vercel.app/api/stockOut/stockOut');
            setStockOutwardList(response.data);
        } catch (error) {
            console.error('Error fetching stock outward list:', error.response ? error.response.data : error.message);
        }
    };

    const fetchWaitersList = async () => {
        try {
            const response = await axios.get('https://testingback.vercel.app/api/waiter');
            setWaitersList(response.data);
        } catch (error) {
            console.error('Error fetching waiters list:', error.response ? error.response.data : error.message);
        }
    };

    useEffect(() => {
        fetchStockOutwardList();
        fetchWaitersList();
    }, []);

    return (
        <>
            <Navbar />
            <div className="max-w-5xl mx-auto bg-white p-2 rounded shadow-md font-sans mt-12">

                <h2 className="text-xl font-semibold mb-3">Stock Outward Form</h2>

                {insufficientStockPopup && (
                    <div className="fixed inset-0 flex items-center justify-center">
                        <div className="bg-white border border-red-500 rounded p-7 shadow-md z-50 absolute">
                            <p className="text-red-500 font-semibold text-center text-xl">
                                Insufficient stock quantity!
                            </p>
                        </div>
                    </div>
                )}

                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600">Waiter Name</label>
                        <select
                            name="waiterName"
                            value={waiterName}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border rounded-md text-sm"
                            required
                        >
                            <option value="" disabled>Select Waiter</option>
                            {waitersList.map((waiter) => (
                                <option key={waiter._id} value={waiter.waiterName}>
                                    {waiter.waiterName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600">Mobile Number</label>
                        <input
                            type="text"
                            name="mobileNumber"
                            value={mobileNumber}
                            className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                            readOnly
                        />
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-2'>
                    <div className="mb-2">

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
                                    height: "450px", // Set the height of the content
                                    margin: "auto", // Center the modal
                                },
                            }}
                        >
                            <div className="p-1">
                                <button
                                    onClick={closeProductModal}
                                    className="float-right text-black"
                                >
                                    <FontAwesomeIcon icon={faTimes} className="mr-1" />
                                </button>
                                <ItemPage />
                            </div>
                        </Modal>
                        <label className="block text-sm font-medium text-gray-600">Product Name
                            <div className='relative'>
                                <button
                                    onClick={openProductModal}
                                    className="absolute right-3 -top-4 text-red-600 rounded-full text-center mb-1"
                                >
                                    <FontAwesomeIcon icon={faPlus} size="lg" />
                                </button>
                            </div>
                        </label>
                        <select
                            name="productName"
                            value={productName}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border rounded-md text-sm"
                            required
                        >
                            <option value="" disabled>Select Product</option>
                            {productNames.map((productName) => (
                                <option key={productName._id} value={productName.itemName}>
                                    {productName.itemName}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600">Required Quantity</label>
                        <input
                            type="text"
                            name="stockQty"
                            value={stockQty}
                            onChange={handleInputChange}
                            className="mt-1 p-1 w-full border rounded-md text-sm"
                            required
                        />
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium text-gray-600">Available Quantity</label>
                        <input
                            type="text"
                            name="availableQuantity"
                            value={`${availableQuantity} ${unit}`}
                            className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100"
                            readOnly
                        />
                        {/* <span className="mt-1 p-1 w-full border rounded-md text-sm bg-gray-100">{unit}</span> */}
                    </div>
                </div>
                <div className="flex justify-center">
                    <button
                        type="button"
                        className="bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-72 mx-auto"
                        onClick={handleAddItems}
                    >
                        Add Item
                    </button>
                </div>

                <div className='max-h-80 custom-scrollbars overflow-y-auto mt-4'>
                    <table className="w-full border-collapse ">
                        <thead className="text-sm bg-zinc-100 text-yellow-600 border">
                            <tr className="bg-gray-200 ">
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">SR No.</th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Waiter Name</th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Product Name</th>
                                <th className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 pl-4">Stock Taken</th>
                                <th className="p-1 whitespace-nowrap text-center text-gray lg:pl-6 pl-4">Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stockOutwardList.map((entry, index) => (
                                <tr key={index} className={ index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 text-sm">{index + 1}</td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 text-sm">{entry.waiterName}</td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 text-sm">{entry.productName}</td>
                                    <td className="p-1 whitespace-nowrap text-left text-gray lg:pl-6 text-sm">{entry.stockQty}</td>
                                    <td className="p-1 whitespace-nowrap text-center text-gray lg:pl-6 text-sm">
                                        {new Date(entry.date).toLocaleString('en-GB', {
                                            year: 'numeric',
                                            month: 'numeric',
                                            day: 'numeric',
                                            hour: 'numeric',
                                            minute: 'numeric',
                                            second: 'numeric',
                                            hour12: true,
                                        })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                </div>
            </div>
        </>
    );
};

export default StockOutwardForm;