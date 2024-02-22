"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PaymentModal from "../payment/page";

const Billing = ({ tableId, acPercentage }) => {
  const [categories, setCategories] = useState([]);
  const [menus, setMenus] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [tableInfo, setTableInfo] = useState(null); // New state for table information
  const [hotelInfo, setHotelInfo] = useState(null); // New state for hotel information
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const searchInputRef = useRef(null); // Create a ref for the search input element
  const menuItemRefs = useRef([]);
  const router = useRouter();
  const [isACEnabled, setIsACEnabled] = useState(true);
  const [isGSTEnabled, setIsGSTEnabled] = useState(true); // State for enabling/disabling GST
  const [selectedOrder, setSelectedOrder] = useState(null); // Add selectedOrder state
  const [tableNames, setTableNames] = useState({});
  const [orderNumber, setOrderNumber] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [tastes, setTastes] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedTastes, setSelectedTastes] = useState({});
  const [newTastes, setNewTastes] = useState({});
  const [lastAllOrders, setLastAllOrders] = useState([]);
  const [isCloseTablesModalOpen, setIsCloseTablesModalOpen] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("EmployeeAuthToken");
    if (!authToken) {
      router.push("/login");
    }
  }, []);

  // ========taste fuctionality=======//
  useEffect(() => {
    const fetchTastes = async () => {
      try {
        const response = await axios.get(
          "https://testingback.vercel.app/api/taste/tastes"
        );
        setTastes(response.data);
        // Set the selected option to the first taste in the list (change as needed)
        if (response.data.length > 0) {
          setSelectedOption(response.data[0]._id);
        }
      } catch (error) {
        console.error("Error fetching tastes:", error);
      }
    };

    fetchTastes();
  }, []);

  // taste and other slection valid code
  const handleSelectChange = (orderId, tasteId) => {
    setSelectedTastes((prevSelectedTastes) => ({
      ...prevSelectedTastes,
      [orderId]: tasteId,
    }));
  };

  const handleNewTasteChange = (orderId, newTaste) => {
    setNewTastes((prevNewTastes) => ({
      ...prevNewTastes,
      [orderId]: newTaste,
    }));
  };

  // const modifiedCurrentOrder = currentOrder.map((orderItem) => {
  //   const selectedTasteId = selectedTastes[orderItem._id];
  //   const selectedTaste =
  //     selectedTasteId === "other"
  //       ? { _id: "other", taste: newTastes[orderItem._id] || "" }
  //       : tastes.find((taste) => taste._id === selectedTasteId) || null;

  //   return {
  //     ...orderItem,
  //     selectedTaste,
  //   };
  // });
  // const modifiedCurrentOrder = currentOrder.map((orderItem) => {
  //   const selectedTasteId = selectedTastes[orderItem._id];
  //   const selectedTaste =
  //     selectedTasteId === "other"
  //       ? { _id: "other", taste: newTastes[orderItem._id] || "" }
  //       : tastes.find((taste) => taste._id === selectedTasteId) || null;

  //   return {
  //     ...orderItem,
  //     selectedTaste: selectedTaste || { _id: null, taste: "" }, // Ensure selectedTaste is not null
  //   };
  // });

  // console.log(modifiedCurrentOrder)
  const modifiedCurrentOrder = currentOrder.map((orderItem) => {
    const selectedTasteId = selectedTastes[orderItem._id];
    const selectedTaste =
      selectedTasteId === "other"
        ? { _id: "other", taste: newTastes[orderItem._id] || "" }
        : tastes.find((taste) => taste.taste === selectedTasteId) || {
          _id: null,
          taste: selectedTasteId,
        }; // Include selectedTasteId as taste if not "other" or not found in tastes

    console.log("Selected Taste:", selectedTaste);

    return {
      ...orderItem,
      selectedTaste,
    };
  });
  console.log("Modified Current Order:", modifiedCurrentOrder);

  const openCloseTablesModal = () => {
    setIsCloseTablesModalOpen(true);
  };

  const handleCloseTablesModal = () => {
    setIsCloseTablesModalOpen(false);
  };
  const [waiterName, setWaiterName] = useState("");
  const [waitersList, setWaitersList] = useState([]);
  // waiter fuctionality
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setWaiterName(value);
    // ... your existing code for handling other input changes
  };
  const fetchWaitersList = async () => {
    try {
      const response = await axios.get("https://testingback.vercel.app/api/waiter");
      setWaitersList(response.data);
    } catch (error) {
      console.error(
        "Error fetching waiters list:",
        error.response ? error.response.data : error.message
      );
    }
  };

  useEffect(() => {
    fetchWaitersList();
  }, []);

  const handleConfirmCloseTables = () => {
    // Add logic to perform the closing of tables
    // For example, call an API endpoint or dispatch an action
    setIsCloseTablesModalOpen(false);
    router.push("/bill"); // Redirect to the bill page after confirming
  };

  const handleSearchInputChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredOrders = lastAllOrders.filter((order) =>
    order.orderNumber.includes(searchQuery)
  );

  const [greetings, setGreetings] = useState([]);
  useEffect(() => {
    const fetchGreetings = async () => {
      try {
        const response = await axios.get(
          "https://testingback.vercel.app/api/greet/greet"
        );
        setGreetings(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching greetings:", error);
      }
    };

    fetchGreetings();
  }, []);

  useEffect(() => {
    // Function to fetch the next order number from your backend
    const fetchNextOrderNumber = async () => {
      try {
        const response = await axios.get(
          "https://testingback.vercel.app/api/order/get-next-order-number"
        );
        console.log(response.data.nextOrderNumber);
        const nextOrderNumber = response.data.nextOrderNumber;
        setOrderNumber(nextOrderNumber);
      } catch (error) {
        console.error("Error fetching next order number:", error);
      }
    };

    // Call the function when the component mounts
    fetchNextOrderNumber();
  }, []); // Empty dependency array to run the effect only once

  useEffect(() => {
    fetchLastAllOrders();
  }, []);
  const fetchLastAllOrders = async () => {
    try {
      const ordersResponse = await axios.get(
        "https://testingback.vercel.app/api/order/latest-orders"
      );
      const orders = ordersResponse.data;

      // Fetch table names for each order
      const tableNamesPromises = orders.map(async (order) => {
        const tableResponse = await axios.get(
          `https://testingback.vercel.app/api/table/tables/${order.tableId}`
        );
        const tableName = tableResponse.data?.tableName || "";
        return { ...order, tableName };
      });

      const ordersWithTableNames = await Promise.all(tableNamesPromises);

      // Sort the orders by order date in descending order
      const sortedOrders = ordersWithTableNames.sort(
        (a, b) => new Date(b.orderDate) - new Date(a.orderDate)
      );

      setLastAllOrders(sortedOrders);
    } catch (error) {
      console.error("Error fetching latest orders:", error);
    }
  };

  const handleOrderClick = (order) => {
    if (order.orderNumber) {
      setSelectedOrder(order);
      setCurrentOrder(order.items || []);

      // Redirect to the edit page with the selected order ID
      const orderNumber = order.orderNumber;
      console.log(orderNumber);
      router.push(`/edit/${orderNumber}`);
    } else {
      console.error("Order Number is undefined");
      // Handle the error or provide feedback to the user
    }
  };

  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === "Escape") {
        // Redirect to the dashboard or any desired location
        router.push("/bill");
      }
    },
    [router]
  );

  const handleSearchInputKeyDown = (event) => {
    if (event.key === "+") {
      event.preventDefault();
      // Set focus on the first menu item
      if (menuItemRefs.current.length > 0) {
        menuItemRefs.current[0].focus();
      }
    }
  };

  // Search filter
  const filterMenus = (menu) => {
    const searchTerm = searchInput.toLowerCase().trim();

    // If the search term is empty, show all menus
    if (searchTerm === "") {
      return true;
    }

    // Check if the search term is a number
    const searchTermIsNumber = !isNaN(searchTerm);

    // If the search term is a number, filter based on menu's uniqueId
    if (searchTermIsNumber) {
      return menu.uniqueId === searchTerm;
    }

    // If the search term is not a number, filter based on menu's name
    return menu.name.toLowerCase().includes(searchTerm);
    // return menu.name.toLowerCase().startsWith(searchTerm);
  };

  const saveBill = async () => {
    try {
      const acPercentageAmount = isACEnabled
        ? calculateTotal().acPercentageAmount
        : 0;

      const orderData = {
        tableId,
        waiterName,
        items: modifiedCurrentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
          taste: orderItem.selectedTaste ? orderItem.selectedTaste.taste : "", // Ensure to include taste even if it's manually added
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
      };

      console.log(orderData);

      if (orderData.items.length === 0) {
        console.warn("No items in the order. Not saving or printing KOT.");
        return;
      }

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `https://testingback.vercel.app/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        // If an existing bill is found, get the orderId
        const orderIdToUpdate = existingBill[0]._id;

        // Get existing menu items
        existingItems = existingBill[0].items;

        // Update the existing order by orderId
        const updateResponse = await axios.patch(
          `https://testingback.vercel.app/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
        console.log("Update Response:", updateResponse.data);
      } else {
        // If no existing bill is found, create a new one
        const createResponse = await axios.post(
          `https://testingback.vercel.app/api/order/order/${tableId}`,
          orderData
        );
        console.log("Create Response:", createResponse.data);
      }
      // Identify newly added items
      const newItems = orderData.items.filter(
        (newItem) =>
          !existingItems.some(
            (existingItem) => existingItem.name === newItem.name
          )
      );

      // Identify items with updating quantities for existing items
      const updatingItems = orderData.items
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0); // Filter out items with quantity 0

      // Combine newItems and updatingItems into a set of unique items
      const uniqueItems = [...newItems, ...updatingItems];
      const uniqueItemsSet = new Set(uniqueItems.map((item) => item.name));

      const kotData = {
        tableId,
        waiterName,
        items: [...uniqueItemsSet].map((itemName, index) => {
          const orderItem = uniqueItems.find((item) => item.name === itemName);
          const tasteInfo = modifiedCurrentOrder.find(
            (item) => item.name === itemName
          );
          return {
            name: orderItem.name,
            quantity: orderItem.quantity,
            taste:
              tasteInfo && tasteInfo.selectedTaste
                ? tasteInfo.selectedTaste.taste
                : "",
          };
        }),
        orderNumber,
      };

      if (kotData.items.length === 0) {
        console.warn("No items in the KOT. Not saving or printing KOT.");
        return;
      }
      const KOTResponse = await axios.post(
        `https://testingback.vercel.app/api/kot/kotOrder/${tableId}`,
        kotData
      );

      console.log("Create Response:", KOTResponse.data);

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Please allow pop-ups to print the KOT.");
        return;
      }

      const kotContent = `
      <!DOCTYPE html>
      <html>
        <head>
        <div>
          <title>Kitchen Order Ticket (KOT)</title>
          <style>
            @page {
              margin: 2mm; /* Adjust the margin as needed */
            }
            /* Add your custom styles for KOT print here */
            body {
              font-family: Arial, sans-serif;
              margin:0;
              padding:0;
              margin-top:-2px;
         
            }
            .kot-header {
              text-align: center;
            }
         
            .kot-table {
              width: 100%;
              border-collapse: collapse;
            }
            .kot-table th, .kot-table td {
              border-top: 1px dotted black;
              border-bottom: 1px dotted black;
              border-left: 1px dotted black;
              border-right: 1px dotted black;
               text-align: left;
              padding: 3px;
            }
       
            .table-name{
              display:flex
           
             
            }
       
            .table-name {
              text-align: center;
           
            }
         
            .sections {
              display: flex;
              align-items: center;
            }
           
            .space {
              margin: 0 50px; /* Adjust the margin as needed */
            }
            .datetime-container{
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
             .datetime-container p{
            font-size:10px
            }
            .label{
              margin-top:-1rem
              font-size:60px
            }
            .table-name{
              margin: 0 2px;
            }
          </style>
        </head>
        <body>
          <div class="kot-header">
            KOT </div>
   
            <div class="sections">
              <span class="table-name">
                TABLE- ${tableInfo ? tableInfo.tableName : "Table Not Found"}
              </span>
              <span class="space"></span>
            </div>
                       
            <div class="datetime-container">
             
            <span class="label">Date:<span id="date" class="datetime"></span>  </span>
           
            <span class="datetime-space"> </span>
            <span class="label">Time:<span id="time" class="datetime"></span></span>
          </div>
          <div>
           <span>Waiter: ${waiterName}</span>
          </div>


           <div class="kot-date-time" id="date-time"></div>
          <div class="kot-items">
            <table class="kot-table">
              <thead>
                <tr>
                  <th> Sr</th>
                  <th>Items</th>
                  <th>Qty</th>
                </tr>
              </thead>
              <tbody>
              ${[...uniqueItemsSet]
          .map((itemName, index) => {
            const orderItem = uniqueItems.find((item) => item.name === itemName);
            const tasteInfo = modifiedCurrentOrder.find(
              (item) => item.name === itemName
            );
            return `
                    <tr>
                      <td>${index + 1}</td>
                      <td class="kot-item-name">${orderItem.name}${tasteInfo && tasteInfo.selectedTaste && tasteInfo.selectedTaste.taste
                ? `<br>Taste - ${tasteInfo.selectedTaste.taste}`
                : ""
              }</td>
                      <td>${orderItem.quantity}</td>
                    </tr>
                  `;
          })
          .join("")}

</tbody>

            </table>
          </div>
          <script>
  // JavaScript to dynamically update date and time
  function updateDateTime() {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    const now = new Date();
   
    // Format date as dd/mm/yyyy
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const formattedDate = day + '/' + month + '/' + year;

    // Format time as hh:mm:ss
    const options = { hour: 'numeric', minute: 'numeric' };
    const formattedTime = now.toLocaleTimeString('en-US', options);

    // Update the content of the elements
    dateElement.textContent = formattedDate;
    timeElement.textContent = formattedTime;
  }

  // Call the function to update date and time
  updateDateTime();

  // Optionally, you can update the date and time every second
  setInterval(updateDateTime, 1000);
</script>
       
       
        </body>
      </html>
    `;

      // Write the content to the new window or iframe
      printWindow.document.write(kotContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      // Print or further process the KOT content as needed
      console.log(kotContent);

      // Save order to the local storage
      const savedBills =
        JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
      savedBills.push(orderData);
      localStorage.setItem(`savedBills_${tableId}`, JSON.stringify(savedBills));

      // Optionally, you can reset the current order or perform other actions
      setCurrentOrder([]);
      router.push("/bill");
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const saveKot = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingKOTResponse = await axios.get(
        `https://testingback.vercel.app/api/kot/kot/${tableId}`
      );
      const existingKOT = existingKOTResponse.data;
      console.log(existingKOT);

      if (!existingKOT) {
        console.error("No existing bill found.");
        return;
      }

      const existingItems = existingKOT.items || [];
      const printWindow = window.open("", "_blank");
      console.log(existingItems);
      if (!printWindow) {
        alert("Please allow pop-ups to print the KOT.");
        return;
      }

      const kotContent = `
        <!DOCTYPE html>
        <html>
          <head>
            <title>Re-Kitchen Order Ticket (RE-KOT)</title>
            <style>
            @page {
              margin: 2mm; /* Adjust the margin as needed */
            }
            /* Add your custom styles for KOT print here */
            body {
              font-family: Arial, sans-serif;
              margin:0;
              padding:0;
              margin-top:-2px;
         
            }
            .kot-header {
              text-align: center;
            }
         
            .kot-table {
              width: 100%;
              border-collapse: collapse;
            }
            .kot-table th, .kot-table td {
              border-top: 1px dotted black;
              border-bottom: 1px dotted black;
              border-left: 1px dotted black;
              border-right: 1px dotted black;
               text-align: left;
              padding: 3px;
            }
       
            .table-name{
              display:flex
           
             
            }
       
            .table-name {
              text-align: center;
           
            }
         
            .sections {
              display: flex;
              align-items: center;
            }
           
            .space {
              margin: 0 50px; /* Adjust the margin as needed */
            }
            .datetime-container{
              display: flex;
              align-items: center;
              justify-content: space-between;
            }
             .datetime-container p{
            font-size:10px
            }
            .label{
              margin-top:-1rem
              font-size:60px
            }
            .table-name{
              margin: 0 2px;
            }
          </style>
          </head>
          <body>
            <div class="kot-header">
              Re-KOT
            </div>
            <div class="sections">
              <span class="table-name">
                TABLE- ${tableInfo ? tableInfo.tableName : "Table Not Found"}
              </span>
              <span class="space"></span>
            </div>
            <div class="datetime-container">
              <span class="label">Date:<span id="date" class="datetime"></span></span>
              <span class="datetime-space"></span>
              <span class="label">Time:<span id="time" class="datetime"></span></span>
            </div>
            <div>
           <span>Waiter: ${existingKOT.waiterName}</span>
          </div>
            <div class="kot-items">
              <table class="kot-table">
                <thead>
                  <tr>
                    <th>Sr</th>
                    <th>Items</th>
                    <th>Qty</th>
                  </tr>
                </thead>

                <tbody>
            ${existingItems
          .map(
            (orderItem, index) => `
                <tr>
                  <td>${index + 1}</td>
                  <td class="kot-item-name">${orderItem.name}${orderItem.taste ? `<br>Taste - ${orderItem.taste}` : ""
              }</td>
                  <td>${orderItem.quantity}</td>
                </tr>
              `
          )
          .join("")}
</tbody>
               
              </table>
            </div>
            <script>
              function updateDateTime() {
                const dateElement = document.getElementById('date');
                const timeElement = document.getElementById('time');
                const now = new Date();
                const day = String(now.getDate()).padStart(2, '0');
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const year = now.getFullYear();
                const formattedDate = day + '/' + month + '/' + year;
                const options = { hour: 'numeric', minute: 'numeric' };
                const formattedTime = now.toLocaleTimeString('en-US', options);
                dateElement.textContent = formattedDate;
                timeElement.textContent = formattedTime;
              }
              updateDateTime();
              setInterval(updateDateTime, 1000);
            </script>
          </body>
        </html>
      `;

      // Write the content to the new window or iframe
      printWindow.document.write(kotContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      router.push("/bill");
    } catch (error) {
      console.error("Error saving KOT:", error);
    }
  };

  const WaitingBill = async () => {
    try {
      const acPercentageAmount = isACEnabled
        ? calculateTotal().acPercentageAmount
        : 0;

      const orderData = {
        tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
      };

      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `https://testingback.vercel.app/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      let existingItems = [];

      if (existingBill && existingBill.length > 0) {
        // If an existing bill is found, get the orderId
        const orderIdToUpdate = existingBill[0]._id;

        // Get existing menu items
        existingItems = existingBill[0].items;

        // Update the existing order by orderId
        const updateResponse = await axios.patch(
          `https://testingback.vercel.app/api/order/update-order-by-id/${orderIdToUpdate}`,
          orderData
        );
        console.log("Update Response:", updateResponse.data);
      } else {
        // If no existing bill is found, create a new one
        const createResponse = await axios.post(
          `https://testingback.vercel.app/api/order/order/${tableId}`,
          orderData
        );
        console.log("Create Response:", createResponse.data);
      }

      // Identify newly added items
      const newItems = orderData.items.filter(
        (newItem) =>
          !existingItems.some(
            (existingItem) => existingItem.name === newItem.name
          )
      );

      // Identify items with updating quantities for existing items
      const updatingItems = orderData.items
        .map((newItem) => {
          const existingItem = existingItems.find(
            (item) => item.name === newItem.name
          );
          return {
            name: newItem.name,
            quantity: existingItem
              ? newItem.quantity - existingItem.quantity
              : newItem.quantity,
          };
        })
        .filter((orderItem) => orderItem.quantity !== 0); // Filter out items with quantity 0

      // Combine newItems and updatingItems into a set of unique items
      const uniqueItems = [...newItems, ...updatingItems];
      const uniqueItemsSet = new Set(uniqueItems.map((item) => item.name));

      const savedBills =
        JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
      savedBills.push(orderData);
      localStorage.setItem(`savedBills_${tableId}`, JSON.stringify(savedBills));

      // Optionally, you can reset the current order or perform other actions
      setCurrentOrder([]);
      router.push("/bill");
    } catch (error) {
      console.error("Error saving bill:", error);
    }
  };

  const handlePrintBill = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `https://testingback.vercel.app/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;
      const orderNo = orderNumber

      // Find the index of the first temporary order (if any)
      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );

      // Use the tableId from the order data
      const orderData = {
        tableId: existingBill.tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
        isTemporary: true, // Set isTemporary to false explicitly
        isPrint: 1,
      };

      if (temporaryOrderIndex !== -1) {
        // If an existing temporary order is found, update it
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        await axios.patch(
          `https://testingback.vercel.app/api/order/update-order-by-id/${orderIdToUpdate}`,
          {
            ...orderData,
            isTemporary: true, // Ensure isTemporary is set to false in the update request
            isPrint: 1,
          }
        );
      } else {
        // If no existing temporary order is found, create a new one
        await axios.post(
          `https://testingback.vercel.app/api/order/order/${tableId}`,
          orderData
        );
      }

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);

      // await new Promise((resolve) => setTimeout(resolve, 500));
      console.log("document ready for printing");

      const printWindow = window.open("", "_blank");

      if (!printWindow) {
        alert("Please allow pop-ups to print the bill.");
        return;
      }

      const printContent = `
      <html>
  <head>
    <title>Bill</title>
    <style>
      @page {
        margin: 2mm; /* Adjust the margin as needed */
      }
      body {
        font-family: 'sans-serif' ; /* Specify a more common Courier font */
        margin: 0;
        padding: 0;
        background-color: #f4f4f4;
        box-sizing: border-box;
     
      }
      * {
       
      box-sizing: border-box;
    }
      .container {
        max-width: 600px;
        padding: 10px 10px;
        justify-content: center;
        align-items: center;
        text-align: center;
        background-color: #fff;
        box-shadow: 0 0 10px black;
      }
     
      .hotel-details p {
        text-align: center;
        margin-top: -10px;
        font-size: 12px;
      }
     
      .order_details_border {
        margin-left: 10px;
        position: relative;
        top: 2rem;
      }
     
      .container .total-section {
        justify-content: space-between;
        display: flex;
      }
     
      .margin_left_container {
        margin-left: -2rem;
      }
     
      .container {
        margin: 1rem;
        align-items: center;
        height: fit-content; /* Changed 'fit' to 'fit-content' */
      }
     
      .contact-details p {
        display: inline-block;
      }
     
      .hotel-details {
        text-align: center;
        margin-bottom: -10px;
      }
     
      .hotel-details h4 {
        font-size: 20px;
        margin-bottom: 10px;
      }
     
      .hotel-details .address {
        font-size: 12px;
        margin-bottom: 10px;
      }
     
      .hotel-details p {
        font-size: 12px;
      }
     
      .contact-details {
        align-items: center;
        text-align: center;
        width: 100%;
        display: flex;
        font-size: 12.8px;
        justify-content: space-between;
      }
     
      .bill-no {
        font-size: 12.8px;
        border-top: 1px dotted gray;
      }
     
      .tableno p {
        font-size: 12.8px;
      }
     
      .waiterno p {
        font-size: 12.8px;
      }
     
      .tableAndWaiter {
        display: flex;
        align-items: center;
        font-size: 12.8px;
        justify-content: space-between;
        border-top: 1px dotted gray;
      }
     
      .waiterno {
        /* Missing 'display: flex;' */
        display: flex;
        font-size: 12.8px;
      }
     
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        font-size: 12.8px;
        border-top: 1px dotted gray;
      }
     
     
    .order-details{
     margin-top:-14px
     font-size: 12.8px;

    }

         

      .order-details th {
        padding: 8px;
        text-align: left;
        font-size: 12.8px;
        border-top: 1px dotted gray;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 4px;
        font-size: 12.8px;
      }
     
   
     
      .margin_left_container {
        margin-left: 20px;
        font-size: 12.8px;
      }
     
      .thdots {
        border-top: 1px dotted gray;
        padding-top: 2px;
      }
     
      .itemsQty {
        border-top: 1px dotted gray;
        margin-top: 5px;
        margin-bottom: 5px;
        font-size: 12.8px;
      }
     
      .itemsQty p {
        margin-top: 2px;
        font-size: 12.8px;
      }
     
      .subtotal,
      .datas {
        margin-top: 18px;
        font-size: 12.8px;
      }
     
      .datas {
        text-align: right;
      }
     
      .subtotal p {
        margin-top: -11px;
       
      }
     
      .datas p {
        margin-top: -11px;
   
      }
     
      .subtotalDatas {
        display: flex;
        border-top: 1px dotted gray;
        justify-content: space-between;
        margin-top: -9px;
      }
     
      .grandTotal {
        font-size: 19px;
     
      }
     
      .totalprice {
        text-align: right;
      }
     
      .table-class th {
        font-weight: 400;
      }
     
      .table-class th {
        align-items: center;
        text-align: left;
      }
     
      .tableAndWaiter p {
        margin-top: -10px;
      }
     
      .billNo {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
      .billNo p {
        display: flex;
        align-items: center;
        text-align: center;
        justify-content: space-between;
      }
     
      .footer {
        border-top: 1px dotted gray;
        flex-direction: column;
        align-items: center;
        text-align: center;
        margin-top: -2.6rem;
      }
     
      .footer p {
        margin-top: 2px;
      }
     
      .datetime-containers {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 12.8px;
        margin-bottom: 10px; /* Adjust the margin as needed */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .datetime-containers p {
        font-size: 10px;
        margin: 0; /* Remove default margin for paragraphs inside .datetime-containers */
      }
     
      .label {
        margin-top: -25px;
      }
     
      .footerss {
        margin-top: 25px;
      }
     
   
      .tableAndWaiter {
        margin-top: -7px;
      }
     
      .tableno {
        border-top: 1px dotted gray;
        display: flex;
        justify-content: space-between;
        margin-bottom: 10px;
      }
      .tableno p{
        margin-top:4px
      }
      /* Align the Price column to the right */
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        text-align: right;
      }
     
      /* Center the SR column */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1) {
        text-align: center;
      }
     
      /* Set a fixed width for the SR and Price columns if needed */
      .table-class th:nth-child(1),
      .table-class td:nth-child(1),
      .table-class th:nth-child(4),
      .table-class td:nth-child(4) {
        width: 31px; /* Adjust the width as needed */
      }
     
        .reduce-space {
        margin-bottom: 4px;
      }
          .reduce-margin-top {
        margin-top: -25px;
      }
      .order-details table {
        border-collapse: collapse;
        width: 100%;
        border-top: 1px dotted gray;
      }
     
     
    .order-details{
     margin-top:-24px
     position:absolute

    }

         

      .order-details th {
        padding: 8px;
        text-align: left;
        border-top: 1px dotted gray;
      }
     
      .order-details td,
      .order-details th {
        border-bottom: none;
        text-align: left;
        padding: 2px;
      }
     
      .big-text {
        display: flex;
        flex-direction: column;
      }
      .big-text span{
        font-size:12.5px
      }
        .small-text {
          font-size: 10px; /* Adjust the font size as needed */
        }
        .order-details tbody {
          margin-top: 0px; /* Set margin-top to 0 to remove extra margin */
        }

        .order-details td,
        .order-details th {
          vertical-align: middle;
        }
        .table-class td:nth-child(1) {
          text-align: left;
        }
        .table-class th:nth-child(1) {
          text-align: left;
      }
      .table-class th:nth-child(3) {
        text-align: left;
    }
    .brab{
      margin-top:-20px
    }
    .waiterName{
      margin-top:-20px
   
    }
    .waiterName p{
     
      font-size:12.5px
    }
  </style>
        </head>
        <body>
        <!-- Hotel Details Section -->
        <div class="hotel-details">
          <h4>${hotelInfo ? hotelInfo.hotelName : "Hotel Not Found"}</h4>
          <p class="address">${hotelInfo ? hotelInfo.address : "Address Not Found"
        }</p>
          <p>Phone No: ${hotelInfo ? hotelInfo.contactNo : "Mobile Not Found"
        }</p>
         <p style="${!hotelInfo || !hotelInfo.gstNo ? "display: none;" : ""
        }">GSTIN: ${hotelInfo ? hotelInfo.gstNo : "GSTIN Not Found"}</p>
<p style="${!hotelInfo || !hotelInfo.sacNo ? "display: none;" : ""}">SAC No: ${hotelInfo ? hotelInfo.sacNo : "SAC No Not Found"
        }</p>
          <p style="${!hotelInfo || !hotelInfo.fssaiNo ? "display: none;" : ""
        }">FSSAI No: ${hotelInfo ? hotelInfo.fssaiNo : "FSSAI Not Found"}</p>
 </div>
     
        <!-- Content Section -->
       
     
        <!-- Table and Contact Details Section -->
        <div class="tableno reduce-space">
          <div class="billNo">
            <p>Bill No: ${existingBill.length > 0 ? (existingBill[0].orderNumber ? existingBill[0].orderNumber : orderNo) : orderNo}</p>
          </div>
          <p class="numberstable">Table No: ${tableInfo ? tableInfo.tableName : "Table Not Found"
        }</p>
        </div>
             
     
        <!-- Date and Time Containers Section -->
        <div class="datetime-containers">
          <span class="label">Date: <span id="date" class="datetime"></span></span>
          <span class="datetime-space"></span>
          <span class="label">Time: <span id="time" class="datetime"></span></span>
          </div>
         
          <div class="waiterName">
          <p>Waiter Name: ${waiterName}</p>
          </div>
       
        <!-- Order Details Section -->
        <div class="order-details reduce-margin-top">
        <table class="table-class">
          <thead>
            <tr>
              <th>SR</th>
              <th>Items</th>
              <th>Qty</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            ${currentOrder.map(
          (orderItem, index) => `<tr key=${orderItem._id}>
                <td>${index + 1}</td>
                <td>${orderItem.name}</td>
                <td>${orderItem.quantity}</td>
                <td class="totalprice">${(
              orderItem.price * orderItem.quantity
            ).toFixed(2)}</td>
              </tr>`
        )}
          </tbody>
        </table>
      </div>
        <!-- Items Quantity Section -->
        <div class="itemsQty">
          <p>Total Items: ${calculateTotal().totalQuantity}</p>
        </div>
     
        <!-- Subtotal Data Section -->
        <div class="subtotalDatas">
  <div class="subtotal">
    <p>Subtotal: </p>
    ${hotelInfo && hotelInfo.gstPercentage > 0
          ? `<p>CGST (${hotelInfo.gstPercentage / 2}%)</p> <p>SGST (${hotelInfo.gstPercentage / 2
          }%)</p>`
          : ""
        }
    <p class="grandTotal">Grand Total: </p>
  </div>

  <div class="datas">
    <p>${calculateTotal().subtotal}</p>
    ${hotelInfo && hotelInfo.gstPercentage > 0
          ? `<p>${calculateTotal().CGST}</p><p>${calculateTotal().SGST}</p>`
          : ""
        }
 
    <p class="grandTotal">${Math.round(calculateTotal().total)}</p>
  </div>
</div>

     
        <!-- Footer Section -->
        <div class="footerss">
  <div class="footer">
    <p>
      <span class="big-text">
        ${greetings.map((index) => {
          return `<span class="">
            ${index.greet}
          </span>
          <span style="${index.message ? "" : "display: none;"}">
            ${index.message}
          </span>`;
        })}
        <span class="small-text">AB Software Solution: 8888732973</span>
      </span>
   
    </p>
  </div>
</div>
</div>
     
        <script>
  // JavaScript to dynamically update date and time
  function updateDateTime() {
    const dateElement = document.getElementById('date');
    const timeElement = document.getElementById('time');
    const now = new Date();
   
    // Format date as dd/mm/yyyy
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = now.getFullYear();
    const formattedDate = day + '/' + month + '/' + year;

    // Format time as hh:mm:ss
    const options = { hour: 'numeric', minute: 'numeric' };
    const formattedTime = now.toLocaleTimeString('en-US', options);

    // Update the content of the elements
    dateElement.textContent = formattedDate;
    timeElement.textContent = formattedTime;
  }

  // Call the function to update date and time
  updateDateTime();

  // Optionally, you can update the date and time every second
  setInterval(updateDateTime, 1000);
</script>
       
      </body>
</html>

    `;

      // Write the content to the new window or iframe
      printWindow.document.write(printContent);

      // Trigger the print action
      printWindow.document.close();
      printWindow.print();

      // Close the print window or iframe after printing
      printWindow.close();
      router.push("/bill");
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      console.error("Error preparing order:", error);
    }
  };

  const handleSave = async () => {
    try {
      // Check if there's an existing bill for the current table
      const existingBillResponse = await axios.get(
        `https://testingback.vercel.app/api/order/order/${tableId}`
      );
      const existingBill = existingBillResponse.data;

      // Find the index of the first temporary order (if any)
      const temporaryOrderIndex = existingBill.findIndex(
        (order) => order.isTemporary
      );

      // Use the tableId from the order data
      const orderData = {
        tableId: existingBill.tableId,
        items: currentOrder.map((orderItem) => ({
          name: orderItem.name,
          quantity: orderItem.quantity,
          price: orderItem.price,
        })),
        subtotal: calculateTotal().subtotal,
        CGST: calculateTotal().CGST,
        SGST: calculateTotal().SGST,
        acPercentageAmount: calculateTotal().acPercentageAmount, // Include acPercentageAmount
        total: calculateTotal().total,
        isTemporary: true, // Set isTemporary to false explicitly
        isPrint: 1,
      };

      if (temporaryOrderIndex !== -1) {
        // If an existing temporary order is found, update it
        const orderIdToUpdate = existingBill[temporaryOrderIndex]._id;
        await axios.patch(
          `https://testingback.vercel.app/api/order/update-order-by-id/${orderIdToUpdate}`,
          {
            ...orderData,
            isTemporary: true, // Ensure isTemporary is set to false in the update request
            isPrint: 1,
          }
        );
      } else {
        // If no existing temporary order is found, create a new one
        await axios.post(
          `https://testingback.vercel.app/api/order/order/${tableId}`,
          orderData
        );
      }

      // Remove the local storage item for the specific table
      localStorage.removeItem(`savedBills_${tableId}`);

      router.push("/bill");
      // Open the payment modal after printing
      // openPaymentModal();
    } catch (error) {
      console.error("Error preparing order:", error);
    }
  };

  const handleAfterPrint = () => {
    window.removeEventListener("afterprint", handleAfterPrint);
    window.close();
  };

  const addToOrder = useCallback(
    (product) => {
      console.log("Adding to order:", product);
      // Update the current order
      setCurrentOrder((prevOrder) => {
        const existingItem = prevOrder.find(
          (item) => item.name === product.name
        );

        if (existingItem) {
          console.log("Adding to existing item:", existingItem);
          const updatedOrder = prevOrder.map((item) =>
            item.name === existingItem.name
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
          console.log("Updated Order:", updatedOrder);
          return updatedOrder;
        } else {
          console.log("Adding new item:", product);
          return [...prevOrder, { ...product, quantity: 1 }];
        }
      });

      // Optionally, you can trigger the KOT print here or use the `kotData` as needed.
    },
    [setCurrentOrder]
  );

  const removeFromOrder = (product) => {
    setCurrentOrder((prevOrder) => {
      const existingItem = prevOrder.find((item) => item.name === product.name);

      if (existingItem) {
        const updatedOrder = prevOrder.map((item) =>
          item.name === existingItem.name
            ? { ...item, quantity: item.quantity > 1 ? item.quantity - 1 : 0 }
            : item
        );

        // Filter out items with quantity greater than 0
        const filteredOrder = updatedOrder.filter((item) => item.quantity > 0);

        return filteredOrder;
      } else {
        console.log("Item not found in order:", product);
        return prevOrder;
      }
    });
  };

  useEffect(() => {
    // Recalculate total when isACEnabled changes
    setCurrentOrder((prevOrder) => [...prevOrder]); // Trigger a re-render
  }, [isACEnabled]);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
    // Fetch categories
    axios
      .get("https://testingback.vercel.app/api/main")
      .then((response) => {
        setCategories(response.data);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });

    // Fetch products
    axios
      .get("https://testingback.vercel.app/api/menu/menus/list")
      .then((response) => {
        console.log(response.data);
        const menusArray = response.data; // Ensure menus is an array
        setMenus(menusArray);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });

    if (tableId) {
      axios
        .get(`https://testingback.vercel.app/api/table/tables/${tableId}`)
        .then((response) => {
          setTableInfo(response.data);
        })
        .catch((error) => {
          console.error("Error fetching table information:", error);
        });
    }

    const savedBills =
      JSON.parse(localStorage.getItem(`savedBills_${tableId}`)) || [];
    if (savedBills.length > 0) {
      // Assuming you want to load the latest saved bill
      const latestOrder = savedBills[savedBills.length - 1];
      setCurrentOrder(latestOrder.items || []); // Initialize currentOrder with the saved items
    }

    document.addEventListener("keydown", handleKeyDown);
    // document.addEventListener('keydown', handleSlashKey);

    // Remove the event listener when the component unmounts
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      // document.removeEventListener('keydown', handleSlashKey);
    };
  }, [tableId, handleKeyDown]);

  useEffect(() => {
    const handleStarKey = (event) => {
      if (event.key === "*") {
        event.preventDefault();
        handlePrintBill();
      }
    };
    document.addEventListener("keydown", handleStarKey);
    return () => {
      document.removeEventListener("keydown", handleStarKey);
    };
  }, [handlePrintBill]);

  useEffect(() => {
    const handleSlashKey = (event) => {
      if (event.key === "/") {
        event.preventDefault();
        saveBill();
      }
    };
    document.addEventListener("keydown", handleSlashKey);
    return () => {
      document.removeEventListener("keydown", handleSlashKey);
    };
  }, [saveBill]);

  useEffect(() => {
    // Fetch menus based on the selected category
    if (selectedCategory) {
      axios
        .get(`https://testingback.vercel.app/api/menu/${selectedCategory._id}`)
        .then((response) => {
          console.log(response.data);
          const menusArray = response.data || []; // Ensure menus is an array
          setMenus(menusArray);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  }, [selectedCategory]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);

    // If the category is null (All items), fetch all menus
    if (category === null) {
      axios
        .get("https://testingback.vercel.app/api/menu/menus/list")
        .then((response) => {
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    } else {
      // Fetch menus based on the selected category
      axios
        .get(`https://testingback.vercel.app/api/menu/menulist/${category._id}`)
        .then((response) => {
          setMenus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching menus:", error);
        });
    }
  };

  const calculateTotal = () => {
    const subtotal = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.price * orderItem.quantity,
      0
    );
    // const GSTRate = gstPercentage / 100; // GST rate of 2.5%
    const GSTRate = isGSTEnabled ? gstPercentage / 100 : 0; // Use GST percentage if enabled

    const CGST = (GSTRate / 2) * subtotal; // Half of the GST for CGST
    const SGST = (GSTRate / 2) * subtotal; // Half of the GST for SGST

    // Include acPercentage in the total calculation
    const acPercentageAmount = isACEnabled
      ? subtotal * (acPercentage / 100)
      : 0;

    const total = subtotal + CGST + SGST + acPercentageAmount;
    const totalQuantity = currentOrder.reduce(
      (acc, orderItem) => acc + orderItem.quantity,
      0
    );

    return {
      subtotal: subtotal.toFixed(2),
      SGST: SGST.toFixed(2),
      CGST: CGST.toFixed(2),
      acPercentageAmount: acPercentageAmount.toFixed(2), // AC percentage amount based on subtotal
      total: total.toFixed(2),
      totalQuantity: totalQuantity,
    };
  };

  const handleMenuItemKeyDown = (event, product) => {
    if (event.key === "Enter") {
      addToOrder(product);
    } else if (event.key === "+") {
      event.preventDefault();
      setSearchInput("");

      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    } else if (event.key === "-") {
      event.preventDefault();
      removeFromOrder(product);
    }
  };

  const updateOrder = (updatedOrderItem) => {
    setCurrentOrder((prevOrder) => {
      const updatedOrder = prevOrder.map((item) =>
        item.name === updatedOrderItem.name ? updatedOrderItem : item
      );
      return updatedOrder;
    });
  };

  const handleQuantityChange = (e, orderItem) => {
    let newQuantity = e.target.value;

    // Handle backspace
    if (e.nativeEvent.inputType === "deleteContentBackward") {
      newQuantity = newQuantity.slice(0, -1);
    }

    if (!isNaN(newQuantity) && newQuantity >= 0) {
      newQuantity = parseInt(newQuantity, 10);
      const updatedOrderItem = { ...orderItem, quantity: newQuantity };
      updateOrder(updatedOrderItem);
    }
  };

  const [gstPercentage, setGSTPercentage] = useState(0); // Add this line for the GST percentage

  useEffect(() => {
    const fetchHotelInfo = async () => {
      try {
        // Fetch all hotels
        const allHotelsResponse = await axios.get(
          "https://testingback.vercel.app/api/hotel/get-all"
        );
        const allHotels = allHotelsResponse.data;

        // Assuming you want to use the first hotel's ID (you can modify this logic)
        const defaultHotelId = allHotels.length > 0 ? allHotels[0]._id : null;

        if (defaultHotelId) {
          // Fetch information for the first hotel
          const response = await axios.get(
            `https://testingback.vercel.app/api/hotel/get/${defaultHotelId}`
          );
          const hotelInfo = response.data;

          setHotelInfo(hotelInfo);
          setGSTPercentage(hotelInfo.gstPercentage || 0);
        } else {
          console.error("No hotels found.");
        }
      } catch (error) {
        console.error("Error fetching hotel information:", error);
      }
    };

    fetchHotelInfo();
  }, []); // Empty dependency array ensures the effect runs only once on mount

  return (
    <div className=" font-sans  ">
      {/* <!-- component --> */}
      <div className="container mx-auto bg-white">
        <div className="flex lg:flex-row shadow-lg ">
          {/* <!-- left section --> */}
          <div className=" w-60 lg:w-3/5  shadow-lg md:w-96 sm:w-8">
            {/* <!-- header --> */}
            <div className="flex flex-row justify-between items-center px-5 mt-1">
              {/* <div className="text-gray-800">
                <div className="font-bold text-xl">{hotelInfo?.hotelName}</div>
                <span className="text-xs">{hotelInfo?.address}</span>
              </div> */}
            </div>
            {/* <!-- end header --> */}

            {/* <!-- categories --> */}
            <div className=" flex flex-row px-4 ml-1 custom-scrollbars overflow-x-auto whitespace-nowrap">
              <span
                key="all-items"
                className={`cursor-pointer px-2  py-1 mb-1 rounded-2xl text-xs lg:text-sm font-semibold mr-4 ${selectedCategory === null ? "bg-yellow-500 text-white" : ""
                  }`}
                onClick={() => handleCategoryClick(null)}
              >
                All Menu
              </span>
              {categories.map((category) => (
                <span
                  key={category._id}
                  className={`whitespace-nowrap cursor-pointer px-2 ml-3 py-1 mb-1 rounded-2xl lg:text-sm md:text-sm text-xs sm:text-xs font-semibold ${selectedCategory === category
                    ? "bg-yellow-500 text-white "
                    : ""
                    }`}
                  onClick={() => handleCategoryClick(category)}
                >
                  {category.name}
                </span>
              ))}
            </div>

            <div className="mt-3 flex justify-start px-5">
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search Menu / Id..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={handleSearchInputKeyDown}
                className="px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:border-yellow-500 w-18 lg:w-48 md:w-44
                 text-xs -ml-4 lg:ml-0 md:ml-0 lg:text-sm md:text-sm"
              />
            </div>

            <div
              className="cursor-pointer grid grid-cols-2 bg-white  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4
             px-3 mt-3 custom-sidescrollbars overflow-scroll lg:max-h-[calc(82vh-1rem)] 
             md:max-h-[calc(80vh-1rem)]   max-h-[calc(169vh-1rem)]  sm:max-h-[calc(16vh-1rem)]"
            >
              {(menus.menus || menus)
                .filter(filterMenus) // Apply the filterMenus function
                .map((product, index) => (
                  <div
                    key={product._id}
                    className="lg:px-3 lg:py-3 md:px-2 md:py-2 sm:px-2 sm:py-2 px-1 py-1 flex flex-col hover:bg-indigo-100 shadow-md border border-gray-200 rounded-md
                    h-28 justify-between text-sm sm:h-24 lg:h-32 lg:w-40 "
                    onClick={() => addToOrder(product)}
                    tabIndex={0}
                    ref={(el) => (menuItemRefs.current[index] = el)} // Save the ref to the array
                    onKeyDown={(e) => handleMenuItemKeyDown(e, product)} // Handle keydown event
                  >
                    <div>
                      <div>
                        <div className=" justify-center flex">
                          <img
                            src={product.imageUrl ? `https://testingback.vercel.app/${product.imageUrl}` : `/tray.png`}

                            className="h-7 w-7  object-cover rounded-md lg:w-16 lg:h-16 md:w-7 md:h-7 sm:w-18 sm:h-18"
                            alt=""
                          />
                        </div>
                        <div className="font-bold text-gray-800  mt-2">

                          <span className="text-orange-400 md:text-xs  text-xs lg:text-sm  rounded-md">{`${product.uniqueId || "Yes"
                            }`}</span> <span className="text-xs lg:text-sm ">{product.name} </span>  <span className="self-end font-bold  text-yellow-500 lg:text-sm md:text-xs sm:text-xs  text-xs float-right" >{`₹${product.price}`}</span>
                        </div>

                      </div>
                    </div>
                    <div className="flex  items-center justify-center">


                    </div>
                  </div>
                ))}
            </div>
            {/* <!-- end products --> */}
          </div>
          {/*
          md - tab view
          lg - desktop
           normal w - mobile view
         */}

          <div className=" w-64 lg:w-2/5 bg-gray-200 md:w-96">
            {/* Header */}
            <div className="font-bold text-sm px-3 flex mt-1">
              Last Bills
              <div className="mt-1 mb-1 ml-2 float-right">
                <input
                  type="text"
                  placeholder="Search Bill No."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="p-1 rounded-full ml-1 px-1 w-20 -mt-1 sm:w-32 md:w-15 lg:w-28 pl-2 font-medium"
                />
              </div>
            </div>
            <div className="flex flex-row items-center justify-between lg:px-2 ">
              <div className="font-semibold text-sm custom-scrollbars overflow-x-auto  lg:w-full md:w-96 sm:w-80">
                <div className="flex flex-row mb-1 cursor-pointer">
                  {filteredOrders
                    .sort(
                      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                    )
                    .map((order) => (
                      <div
                        key={order._id}
                        className="flex-shrink-0 mr-3  p-1 bg-white rounded-lg shadow-md hover:shadow-lg"
                        onClick={() => handleOrderClick(order)}
                      >
                        <div className="flex flex-col items-center">
                          <div className="rounded-full bg-orange-100 px-4">
                            <span className="font-semibold text-sm text-orange-400">
                              {order.orderNumber.replace(/\D/g, "")}
                            </span>
                          </div>
                          <span className="font-semibold text-xs">
                            ₹{Math.round(order.total?.toFixed(2))}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="font-bold lg:text-xl text-sm md:text-xl px-5 flex  sm:text-lg">
              {tableInfo ? tableInfo.tableName : "Not Assigned"}

              <select
                name="waiterName"
                value={waiterName}
                onChange={handleInputChange}
                className="mt-1 p-1 border rounded-md text-xs text-gray-400 lg:ml-4 md:ml-4 ml-10 "
                required
              >
                <option value="" disabled>
                  Select Waiter
                </option>
                {waitersList.map((waiter) => (
                  <option key={waiter._id} value={waiter.waiterName}>
                    {waiter.waiterName}
                  </option>
                ))}
              </select>
            </div>

            {/* <!-- end header --> */}
            {/* <!-- order list --> */}
            <div className="p-2 custom-scrollbars overflow-y-auto lg:h-72 md:h-36  h-64 lg:text-sm md:text-sm text-xs">
              {currentOrder.map((orderItem) => (
                <div key={orderItem._id} className="flex items-center mb-3">
                  <div className="flex flex-row items-center ">
                    <div className="flex items-center h-full">

                      <span className=" font-semibold  lg:w-52 md:w-32 w-20 sm:text-xs md:text-xs   lg:text-base lg:ml-1 text-xs">
                        {orderItem.name}
                      </span>
                    </div>
                  </div>
                  {/*
                    md - tab view
                    lg - desktop
                    normal w - mobile view
                  */}

                  <div className="flex flex-col  md:flex-row items-center lg:text-sm md:text-sm text-xs sm:flex">
                    {/* Use input element with datalist */}
                    <input
                      id={`tasteSelect_${orderItem._id}`}
                      name={`tasteSelect_${orderItem._id}`}
                      placeholder="Add Taste"
                      list={`tasteDatalist_${orderItem._id}`}
                      value={selectedTastes[orderItem._id] || ""}
                      onChange={(e) =>
                        handleSelectChange(orderItem._id, e.target.value)
                      }
                      className="mt-1 p-1 lg:-ml-3  lg:w-32 w-28 ml-1 md:ml-0 sm:ml-0 align-middle  text-center border rounded-md text-xs  text-gray-500 lg:text-sm md:text-xs "
                      required
                    />

                    {/* Datalist containing the options for tastes */}
                    <datalist id={`tasteDatalist_${orderItem._id}`}>
                      {/* Add a default option */}
                      <option value="" disabled>
                        Select taste
                      </option>
                      {tastes.map((taste) => (
                        <option key={taste._id} value={taste.taste}>
                          {taste.taste}
                        </option>
                      ))}
                      {/* Add an option for "Other" */}
                      {/* <option value="other">Other</option> */}
                    </datalist>

                    {/* Display input field when "Other" is selected */}
                    {selectedTastes[orderItem._id] === "other" && (
                      <input
                        type="text"
                        value={newTastes[orderItem._id] || ""}
                        onChange={(e) =>
                          handleNewTasteChange(orderItem._id, e.target.value)
                        }
                        placeholder="Enter new taste"
                        className="mt-1 p-1 border rounded-md text-sm lg:w-22   text-gray-500"
                        required
                      />
                    )}

                    <div className="float-right flex justify-between  ml-2 md:ml-1">
                      <span
                        className="rounded-md cursor-pointer bg-orange-100 align-middle text-center  text-orange-500
                         font-bold p-1 lg:w-4 lg:text-md md:w-4 sm:w-4"
                        onClick={() => removeFromOrder(orderItem)}
                      >
                        -
                      </span>
                      <input
                        type="number"
                        value={orderItem.quantity}
                        onChange={(e) => handleQuantityChange(e, orderItem)}
                        className="font-semibold lg:w-7  w-7 justify-center flex text-center rounded-md align-center  ml-1 md:text-xs pl-0"
                      />
                      <span
                        className="rounded-md cursor-pointer  sm:w-4 bg-orange-100 lg:w-4 justify-center flex align-middle text-center text-orange-500  md:w-4  ml-1 font-bold lg:ml-1 p-1 sm:p-0 lg:text-md"
                        onClick={() => addToOrder(orderItem)}
                      >
                        +
                      </span>
                    </div>
                  </div>
                  <div className="font-semibold  lg:text-lg md:text-md text-xs   text-right lg:ml-1 -mt-2 ml-1 lg:mt-0 md:-ml-3 md:mt-0 sm:mt-0  sm:text-xs sm:w-20 ">
                    {`₹${(orderItem.price * orderItem.quantity).toFixed(2)}`}
                  </div>
                </div>
              ))}
            </div>

            {/* <!-- end order list --> */}
            {/* <!-- totalItems --> */}
            <div className="px-5   lg:mt-1 mt-4 lg:ml-0 md:-ml-1 ml-0 lg:text-sm md:text-sm text-xs sm:ml-2">
              <div className="py-1 rounded-md shadow-md bg-white  ">
                <div className="px-4 flex justify-between ">
                  <span className="font-semibold text-sm">Subtotal</span>
                  <span className="font-semibold">
                    ₹{calculateTotal().subtotal}
                  </span>
                </div>

                {isGSTEnabled && gstPercentage > 0 && (
                  <div>
                    <div className="px-4 flex justify-between ">
                      <span className="font-semibold text-sm">CGST</span>
                      <span className="font-semibold">
                        ({gstPercentage / 2}%) ₹{calculateTotal().CGST}
                      </span>
                    </div>
                    <div className="px-4 flex justify-between ">
                      <span className="font-semibold text-sm">SGST</span>

                      <span className="font-semibold">
                        ({gstPercentage / 2}%) ₹{calculateTotal().SGST}
                      </span>
                    </div>
                  </div>
                )}

                <div className="border-t-2 lg:py-1 lg:px-4 py-1 px-1 flex items-center justify-between ">
                  <span className=" font-semibold text-xl lg:text-2xl lg:-mt-1 md:ml-2 lg:ml-0">
                    Total
                  </span>
                  <span className="font-semibold text-xl lg:text-2xl lg:mr-0 md:mr-2 lg:-mt-1">
                    {/* ₹{(calculateTotal().total)} */}₹
                    {Math.round(calculateTotal().total)}
                  </span>
                  {/* <span className="font-bold text-2xl">₹{Math.ceil(Number(calculateTotal().total)).toFixed(2)}</span> */}
                </div>
                <div className="px-5 text-left text-sm  text-gray-500 font-sans font-semibold -ml-4 ">
                  Total Items: {calculateTotal().totalQuantity}
                </div>
              </div>
            </div>
            {/* <!-- end total --> */}

            {/* <!-- button pay--> */}
            <div className="flex flex-wrap px-1 mt-2 justify-center md:gap-3    lg:gap-1  sm:gap-2">
              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2">
                <div
                  className="px-3 py-2 rounded-md shadow-md  text-center bg-yellow-100 text-yellow-500 font-bold cursor-pointer text-xs "
                  onClick={saveBill}
                >
                  KOT ( / )
                </div>
              </div>

              <div className=" sm:w-auto mb-2 sm:mb-0  sm:mr-2">
                <div
                  className="px-3 py-2 rounded-md shadow-md text-center bg-red-100 text-red-500 font-bold cursor-pointer text-xs"
                  onClick={saveKot}
                >
                  Re-KOT
                </div>
              </div>

              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2 ">
                <div
                  className="px-3 py-2 rounded-md shadow-md text-center bg-orange-100 text-orange-500 font-bold cursor-pointer text-xs"
                  onClick={WaitingBill}
                >
                  Waiting
                </div>
              </div>

              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2 ">
                <div
                  className="px-3 py-2 rounded-md shadow-md text-center bg-blue-100 text-blue-500 font-bold cursor-pointer text-xs"
                  onClick={handleSave}
                >
                  Save
                </div>
              </div>

              <div className=" sm:w-auto mb-2 sm:mb-0 sm:mr-2 ">
                <div
                  className="px-3 py-2 rounded-md shadow-md text-center bg-green-200 text-green-600 font-bold cursor-pointer text-xs"
                  onClick={handlePrintBill}
                >
                  Bill ( * )
                </div>
              </div>

              <div className=" sm:w-auto ">
                <div
                  className="px-3 py-2 rounded-md shadow-md text-center bg-gray-200 text-gray-600 font-bold cursor-pointer text-xs"
                  onClick={() => openCloseTablesModal()}
                >
                  Close
                </div>
              </div>
            </div>

            {isCloseTablesModalOpen && (
              <div
                className="fixed inset-0 flex items-center justify-center z-50 "
                style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
              >
                <div className="bg-white border rounded p-5 shadow-md z-50 absolute">
                  <p className="text-gray-700 font-semibold text-center text-xl">
                    <p>Are you sure you want to close the table?</p>
                  </p>
                  <div className="flex justify-end mt-4">
                    <button
                      className=" bg-red-200  hover:bg-red-300 text-red-700 font-bold py-2 px-4 rounded-full mr-2"
                      onClick={() => handleConfirmCloseTables()}
                    >
                      Yes
                    </button>
                    <button
                      className=" bg-slate-300  hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-full "
                      onClick={() => handleCloseTablesModal()}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isPaymentModalOpen && (
              <PaymentModal
                onClose={() => setIsPaymentModalOpen(false)}
                tableName={tableInfo ? tableInfo.tableName : "Table Not Found"}
                totalAmount={calculateTotal().total}
                tableId={tableId}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Billing;
