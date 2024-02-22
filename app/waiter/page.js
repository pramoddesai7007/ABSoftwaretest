'use client'

// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from 'next/navigation';

const Waiter = () => {
  const [waiters, setWaiters] = useState([]);
  const [waiterData, setWaiterData] = useState({
    waiterName: '',
    address: '',
    contactNumber: '',
    uniqueId: '', // Add the uniqueId field
  });

  const [editingWaiter, setEditingWaiter] = useState(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false); // New state
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingWaiterId, setDeletingWaiterId] = useState(null);

  const router = useRouter()
  useEffect(() => {
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);




  useEffect(() => {
    const fetchWaiters = async () => {
      try {
        const response = await axios.get('https://testingback.vercel.app/api/waiter');
        setWaiters(response.data);
      } catch (error) {
        console.error('Error fetching waiters:', error);
      }
    };

    fetchWaiters();
  }, []);

  const capitalizeFirstLetter = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    // Capitalize the first letter if the input is not empty
    const capitalizedValue = value !== '' ? capitalizeFirstLetter(value) : value;

    setWaiterData({
      ...waiterData,
      [name]: capitalizedValue,
    });
  };

  const handleAddWaiter = async () => {
    try {
      const response = await axios.post('https://testingback.vercel.app/api/waiter', waiterData);
      console.log(response);
      setWaiters([...waiters, response.data]);
      setWaiterData({
        waiterName: '',
        address: '',
        contactNumber: '',
        uniqueId: '', // Clear the uniqueId field after adding
      });
      setIsSuccessModalOpen(true); // Open success modal

      // Set a timer to close the success modal after 2000 milliseconds (2 seconds)
      setTimeout(() => {
        setIsSuccessModalOpen(false);
      }, 2000);
    } catch (error) {
      console.error('Error adding waiter:', error);
      if (error.response && error.response.status === 400) {
        setIsErrorModalOpen(true);

        // Set a timer to close the error modal after 2000 milliseconds (2 seconds)
        setTimeout(() => {
          setIsErrorModalOpen(false);
        }, 2000);
      }
    }
  };


  // const handleEditWaiter = async (waiterId) => {
  //   try {
  //     const response = await axios.put(`https://testingback.vercel.app/api/waiter/${waiterId}`, waiterData);
  //     const updatedWaiters = waiters.map((waiter) =>
  //       waiter._id === waiterId ? response.data : waiter
  //     );
  //     setWaiters(updatedWaiters);
  //     setWaiterData({
  //       waiterName: '',
  //       address: '',
  //       contactNumber: '',
  //       uniqueId: '', // Clear the uniqueId field after editing
  //     });
  //     setEditingWaiter(null);
  //   } catch (error) {
  //     console.error('Error editing waiter:', error);
  //   }
  // };
  const handleEditWaiter = async (waiterId) => {
    try {
      // Check if the edited Unique ID already exists
      const existingWaiter = waiters.find((waiter) => waiter.uniqueId === waiterData.uniqueId && waiter._id !== waiterId);

      if (existingWaiter) {
        // If the edited Unique ID already exists, display an error message
        console.error('Error editing waiter: Waiter with the same Unique ID already exists');
        setIsErrorModalOpen(true);

        // Set a timer to close the modal after 3000 milliseconds (3 seconds)
        setTimeout(() => {
          setIsErrorModalOpen(false);
        }, 2000);





      } else {
        // Proceed with the edit if Unique ID is unique
        const response = await axios.put(`https://testingback.vercel.app/api/waiter/${waiterId}`, waiterData);
        const updatedWaiters = waiters.map((waiter) =>
          waiter._id === waiterId ? response.data : waiter
        );
        setWaiters(updatedWaiters);
        setWaiterData({
          waiterName: '',
          address: '',
          contactNumber: '',
          uniqueId: '', // Clear the uniqueId field after editing
        });
        setEditingWaiter(null);
      }
    } catch (error) {
      console.error('Error editing waiter:', error);
    }
  };


  const handleDeleteWaiter = async (waiterId) => {
    setDeletingWaiterId(waiterId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteWaiter = async () => {
    try {
      await axios.delete(`https://testingback.vercel.app/api/waiter/${deletingWaiterId}`);
      const updatedWaiters = waiters.filter((waiter) => waiter._id !== deletingWaiterId);
      setWaiters(updatedWaiters);
      closeDeleteModal();
    } catch (error) {
      console.error('Error deleting waiter:', error);
      closeDeleteModal();
    }
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingWaiterId(null);
  };

  const handleSetEditWaiter = (waiter) => {
    setWaiterData(waiter);
    setEditingWaiter(waiter._id);
  };

  return (
    <>
      <Navbar />

      {isDeleteModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div className="bg-white border rounded p-5 shadow-md z-50 absolute">
            <p className="text-gray-700 font-semibold text-center text-xl">
              Are you sure you want to delete this waiter?
            </p>
            <div className="flex justify-end mt-4">
              <button
                onClick={confirmDeleteWaiter}
                className=" bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2"
              >
                Yes
              </button>
              <button
                onClick={closeDeleteModal}
                className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto bg-white p-8 rounded shadow-md my-8 font-sans lg:mt-20 mt-12">
      <h1 className="text-xl font-bold font-sans md:mb-0 text-orange-600">Waiter Master</h1>

        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4'>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Waiter Id</label>
            <input
              type="number"
              name="uniqueId"
              value={waiterData.uniqueId}
              onChange={handleInputChange}
              className="mt-1 p-1 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Waiter Name:</label>
            <input
              type="text"
              name="waiterName"
              value={waiterData.waiterName}
              onChange={handleInputChange}
              className="mt-1 p-1 border rounded-md w-full"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">Contact Number:</label>
            <input
              type="number"
              name="contactNumber"
              value={waiterData.contactNumber}
              onChange={handleInputChange}
              className="mt-1 p-1 border rounded-md w-full"
            />
          </div>
        </div>

        {isErrorModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white border border-red-500 rounded p-7 shadow-md z-50 absolute">
              <p className="text-red-500 font-semibold text-center text-xl">
                Waiter Id Is Already Taken!
              </p>
            </div>
          </div>
        )}

        {isSuccessModalOpen && ( // New success modal
          <div
            className="fixed inset-0 flex items-center justify-center z-50 "
            style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
          >            <div className="bg-white border border-green-500 rounded p-7 shadow-md z-50 absolute">
              <p className="text-green-500 font-semibold text-center text-xl">
                Waiter Added Successfully!
              </p>
            </div>
          </div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-600">Address:</label>
          <input
            type="text"
            name="address"
            value={waiterData.address}
            onChange={handleInputChange}
            className="mt-1 p-1 border rounded-md w-full"
          />
        </div>

        <div className=" flex justify-center mt-1">
          {editingWaiter ? (
            <button
              onClick={() => handleEditWaiter(editingWaiter)}
              className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none focus:ring focus:border-orange-300 mt-4 sm:mt-0 sm:mr-2"
            >
              Update Waiter
            </button>
          ) : (
            <button
              onClick={handleAddWaiter}
              className="bg-orange-100 text-orange-600 hover:bg-orange-200 text-gray font-semibold p-2 px-4 rounded-full mt-4 w-full sm:w-72"
            >
              Add Waiter
            </button>
          )}
        </div>

        <div className="mt-4">
          <div className="custom-scrollbars overflow-auto max-h-full">
            <table className="min-w-full">

              <thead className="text-base bg-zinc-100 text-yellow-700 border">
                <tr>
                  <th className="p-3 text-left bg-gray-200">Waiter ID</th>
                  <th className="p-3 text-left bg-gray-200">Waiter Name</th>
                  <th className="p-3 text-left bg-gray-200">Address</th>
                  <th className="p-3 text-left bg-gray-200">Contact Number</th>
                  <th className="p-3 text-left bg-gray-200">Actions</th>
                </tr>
              </thead>
              <tbody>
                {waiters.map((waiter, index) => (
                  <tr key={waiter._id}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 '}
                  >
                    <td className="p-1 pl-10">{waiter.uniqueId}</td>
                    <td className='p-1'>{waiter.waiterName}</td>
                    <td className='p-1'>{waiter.address}</td>
                    <td className='p-1'>{waiter.contactNumber}</td>
                    <td className=' text-left pl-8 lg:pl-2'>
                      <button
                        onClick={() => handleSetEditWaiter(waiter)}
                        className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
                      >
                        <FontAwesomeIcon
                          icon={faPenToSquare}
                          color="orange"
                          className="cursor-pointer"
                        />{" "}
                      </button>
                      <button
                        onClick={() => handleDeleteWaiter(waiter._id)}
                        className="text-gray-600 mr-3 focus:outline-none font-sans font-medium p-1 rounded-full px-2 text-sm shadow-md" style={{ background: "#ffff", }}
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
        </div>
      </div>
    </>
  );
};


export default Waiter;