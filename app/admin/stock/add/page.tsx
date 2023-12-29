"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddProduct() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [price, setPrice] = useState("");
  const [size, setSize] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(true);
  const router = useRouter();

  // add Product
  const onAddProduct = async () => {
    try {
      await axios
        .post("https://localhost:7060/api/products/add", {
          name: name,
          quantity: quantity,
          price: price,
          size: size,
          category: category,
          status: status,
        })
        .then((res) => {
          toast.success("Product Added Successfully");
          router.push("/admin/stock");
        });
    } catch (error: any) {
      toast.error("Cannot Add the Product");
      console.log("Add Product Failed", error.message);
    }
  };

  // disable button if fields are empty
  useEffect(() => {
    if (
      name.length > 0 &&
      size.length > 0 &&
      category.length > 0 &&
      quantity.length > 0 &&
      price.length > 0
    ) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [name, size, category, status, quantity, price]);

  return (
    <div className="flex flex-col items-center mt-12 px-6 py-8 mx-auto w-full lg:w-4/5 lg:py-0">
      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3">
        <label
          htmlFor="small-input"
          className="block w-full mb-2 text-sm font-medium text-gray-900 dark:text-white"
        >
          Name
        </label>
        <input
          type="text"
          onChange={(e) => setName(e.target.value)}
          id="small-input"
          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 mt-4 flex flex-row items-center ">
        <div className="mt-4 w-full mr-8">
          <label
            htmlFor="small-input"
            className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
          >
            Category
          </label>
          <input
            type="text"
            onChange={(e) => setCategory(e.target.value)}
            id="small-input"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="w-2/3 mt-4">
          <label
            htmlFor="small-input"
            className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
          >
            Size
          </label>
          <input
            type="number"
            onChange={(e) => setSize(e.target.value)}
            id="small-input"
            className="block p-2  w-full  text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>

      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 mt-4 flex flex-row items-center ">
        <div className="mt-4 w-full mr-8">
          <label
            htmlFor="small-input"
            className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
          >
            Stock Quantity
          </label>
          <input
            type="number"
            onChange={(e) => setQuantity(e.target.value)}
            id="small-input"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="w-full mt-4">
          <label
            htmlFor="small-input"
            className="block mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
          >
            Unit Price (LKR)
          </label>
          <input
            type="decimal"
            onChange={(e) => setPrice(e.target.value)}
            id="small-input"
            className="block p-2  w-full  text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
      </div>

      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 mt-4">
        <label
          htmlFor="small-input"
          className="block w-full mb-2 mt-4 text-sm font-medium text-gray-900 dark:text-white"
        >
          Status
        </label>
        <select
          onChange={(e) => setStatus(e.target.value)}
          id="small-input"
          className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        >
          <option value="">Select</option>
          <option value="low">Low Stock</option>
          <option value="out">Out of Stock</option>
          <option value="available">Available</option>
        </select>
      </div>

      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 mt-4">
        <button
          onClick={() => onAddProduct()}
          disabled={buttonDisabled}
          className="my-6 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-6 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600 "
        >
          Add Product
        </button>
        <button
          onClick={() => router.push("/admin/stock")}
          className="mx-4 my-6 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600 "
        >
          Cancel
        </button>
      </div>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={true}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable={false}
        pauseOnHover={false}
        theme="dark"
      />
    </div>
  );
}

export default AddProduct;
