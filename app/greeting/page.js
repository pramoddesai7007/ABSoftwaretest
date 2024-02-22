"use client"
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus, faTrash, faTimes, faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const Greetings = () => {
  const [createGreetData, setCreateGreetData] = useState({
    greet: '',
    message: '',
  });
  const [updateGreetData, setUpdateGreetData] = useState({
    id: '',
    greet: '',
    message: '',
  });
  const [deleteGreetId, setDeleteGreetId] = useState('');
  const [greetings, setGreetings] = useState([]);
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] = useState(false);
  const [itemIdToDelete, setItemIdToDelete] = useState(null); // New state for the item ID to delete
  const [isTimerPopupOpen, setIsTimerPopupOpen] = useState(false); // State to control the timer popup

  useEffect(() => {
    getGreetings();
  }, []);

  const router = useRouter();
  useEffect(() => {
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);


  const getGreetings = async () => {
    try {
      const response = await axios.get('https://testingback.vercel.app/api/greet/greet');
      setGreetings(response.data);
    } catch (error) {
      console.error('Error retrieving greetings:', error);
    }
  };

  const handleEdit = (greet) => {
    setUpdateGreetData({ id: "", greet: greet.greet, message: greet.message });
  };

  const handleDelete = (itemId) => {
    setItemIdToDelete(itemId);
    setIsDeleteConfirmationModalOpen(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await axios.delete(`https://testingback.vercel.app/api/greet/greet/${itemIdToDelete}`);
      setGreetings((prevGreetings) => prevGreetings.filter((greet) => greet._id !== itemIdToDelete));
      setIsDeleteConfirmationModalOpen(false);
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const createGreet = async () => {
    const trimmedGreet = createGreetData.greet.trim();
    const trimmedMessage = createGreetData.message.trim();

    if (!trimmedGreet && trimmedMessage) {
      setIsTimerPopupOpen(true); // Open the timer popup
      setTimeout(() => {
        setIsTimerPopupOpen(false); // Close the timer popup after 3 seconds
      }, 3000);
      return;
    }

    if (!trimmedGreet) {
      setIsTimerPopupOpen(true); // Open the timer popup
      setTimeout(() => {
        setIsTimerPopupOpen(false); // Close the timer popup after 3 seconds
      }, 3000);
      return;
    }

    try {
      const response = await axios.post('https://testingback.vercel.app/api/greet/greet', {
        greet: trimmedGreet,
        message: createGreetData.message
      });
      setCreateGreetData({ greet: '', message: '' });
      setGreetings([...greetings, response.data]);
    } catch (error) {
      console.error('Error creating greet:', error);
    }
  };

  const updateGreet = async (greetId) => {
    if (!updateGreetData.greet && !updateGreetData.message) {
      console.error('Please fill in both Greet and Message fields.');
      return;
    }

    try {
      const response = await axios.patch(`https://testingback.vercel.app/api/greet/greet/${greetId}`, updateGreetData);
      setUpdateGreetData({ id: '', greet: '', message: '' });
      getGreetings();
    } catch (error) {
      console.error('Error updating greet:', error);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl container mx-auto mt-16 p-4 shadow-md rounded-md">
        <div className="mb-8 ">
          {/* Create Greet */}
          <h2 className="text-2xl font-bold font-sans mb-2 md:mb-0 text-orange-600">Create Greet</h2>
          <div className="flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <input
              type="text"
              placeholder="Greet"
              className="mt-1 p-2 border rounded-md w-full md:w-auto focus:outline-none focus:ring focus:border-blue-300"
              value={createGreetData.greet}
              onChange={(e) => setCreateGreetData({ ...createGreetData, greet: e.target.value })}
            />
            <input
              type="text"
              placeholder="Message"
              className="mt-1 p-2 border rounded-md w-full md:w-auto focus:outline-none focus:ring focus:border-blue-300"
              value={createGreetData.message}
              onChange={(e) => setCreateGreetData({ ...createGreetData, message: e.target.value })}
            />
          </div>
          <div className="flex justify-center md:justify-start mt-1">
            <button className="bg-orange-100 hover:bg-orange-200 text-orange-600 font-bold py-2 px-4 rounded-full w-72 mt-1 mx-auto" onClick={createGreet}>
              Create
            </button>
          </div>
        </div>
        
        {/* Get Greetings */}
        <div className="mt-4">
          <table className="min-w-full">
            <thead className="text-sm bg-zinc-100 text-yellow-600 border">
              <tr>
                <th className="p-2 text-left text-gray lg:pl-16 pl-4">Greet</th>
                <th className="text-left text-gray lg:pl-16 pl-4">Message</th>
                <th className="text-left text-gray lg:pl-12 pl-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {greetings.map((greet,index) => (
                <tr key={greet._id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-100 '}>
                  <td className="lg:pl-16 pl-4">{greet.greet}</td>
                  <td className="lg:pl-16 pl-4">{greet.message}</td>
                  <td className="lg:pl-16 pl-4">
                    <button
                      onClick={() => handleDelete(greet._id)} 
                      className="text-gray-600 mr-3 font-sans focus:outline-none font-medium p-1 rounded-full px-2 text-sm shadow-md"
                    >
                      <FontAwesomeIcon
                        icon={faTrash}
                        color="red"
                        className="cursor-pointer"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Timer Popup */}
        {isTimerPopupOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
              <p className="text-gray-700 font-semibold mb-4">Greet cannot be empty.</p>
            </div>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        {isDeleteConfirmationModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="fixed inset-0 bg-black opacity-50"></div>
            <div className="relative z-50 bg-white p-6 rounded-md shadow-lg">
              <p className="text-gray-700 font-semibold mb-4">Are you sure you want to delete this item?</p>
              <div className="flex justify-center md:justify-start">
                <button onClick={handleDeleteConfirmed} className="bg-red-200 hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2">Yes</button>
                <button onClick={() => setIsDeleteConfirmationModalOpen(false)} className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-full ">No</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
};

export default Greetings;