"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

function ViewBlog() {
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [size, setSize] = useState("");

  const searchParams = useSearchParams();

  const router = useRouter();
  const id = searchParams.get("id");

  useEffect(() => {
    async function fetchData() {
      axios.get(`https://localhost:7060/api/products/${id}`).then((res) => {
        setName(res.data.name);
        setCategory(res.data.category);
        setPrice(res.data.price);
        setQuantity(res.data.quantity);
        setSize(res.data.size);
        setStatus(res.data.status);
      });
    }
    fetchData();
  }, []);

  let statusContent;
  if (status === "available") {
    statusContent = "Available";
  } else if (status === "low") {
    statusContent = "Low Stock";
  } else if (status === "out") {
    statusContent = "Out of Stock";
  } else if (status === "Locked") {
    statusContent = "Locked";
  } else {
    statusContent = "Available";
  }

  const onEditProduct = async () => {
    try {
      await axios.get("https://localhost:7060/api/orders").then((res) => {
        console.log("PREEE", res.data);
        const filteredOrders = res.data
          .filter((order: any) => order.orderStatus === "Pre Ordered")
          .sort((a: any, b: any) => {
            const dateA: any = new Date(a.date);
            const dateB: any = new Date(b.date);

            return dateA - dateB;
          });

        filteredOrders.forEach(async (order: any) => {
          console.log(order);

          if (order.productID === id) {
            order.orderStatus = "Accepted";

            const res2 = await axios.get(
              `https://localhost:7060/api/products/${order.productID}`
            );
            const productData = res2.data;

            let quantity =
              parseInt(productData.quantity) - parseInt(order.quantity);

            console.log("Quantity: " + quantity);

            if (quantity > 0) {
              await axios.put(
                `https://localhost:7060/api/orders/${order.orderID}`,
                {
                  orderID: order.orderID,
                  outletID: order.outletID,
                  productID: order.productID,
                  quantity: order.quantity,
                  total: order.total,
                  orderStatus: order.orderStatus,
                  orderDate: order.orderDate,
                }
              );

              await axios.put(
                `https://localhost:7060/api/products/${order.productID}`,
                {
                  productID: productData.productID,
                  name: productData.name,
                  category: productData.category,
                  size: productData.size,
                  quantity: quantity.toString(),
                  price: productData.price,
                  status: "Available",
                }
              );
            } else {
              toast.error("Product update failed");
              console.log("Product update failed");
            }
          }
        });
      });
      await axios
        .put(`https://localhost:7060/api/products/${id}`, {
          name: name,
          category: category,
          size: size,
          quantity: quantity,
          price: price,
          status: status,
        })
        .then((res) => {
          if (res.data !== null) {
            toast.success("Product updated successfully");
            router.push("/admin/stock");
          } else {
            toast.error("Product update failed");
          }
        });
    } catch (error: any) {
      toast.error("Product update failed");
      console.log("Product update failed", error.message);
    }
  };

  const onDeleteProduct = async () => {
    try {
      await axios
        .delete(`https://localhost:7060/api/products/${id}`)
        .then((res) => {
          if (res.data !== null) {
            toast.success("Product deleted successfully");
            router.push("/admin/stock");
          } else {
            toast.error("Product delete failed");
          }
        });
    } catch (error: any) {
      toast.error("Product delete failed");
      console.log("Product delete failed", error.message);
    }
  };

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
          value={name}
          readOnly
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
            value={category}
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
            value={size}
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
            value={quantity}
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
            value={price}
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
        <input
          type="decimal"
          value={statusContent}
          readOnly
          id="small-input"
          className="block p-2  w-full  text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </div>

      <div className="w-full sm:w-4/5 md:w-3/5 lg:w-2/3 mt-4">
        <button
          onClick={() => onEditProduct()}
          className="my-6 mr-4 text-white bg-secondary-500 hover:bg-secondary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-6 py-2.5 text-center dark:bg-secondary-500 dark:hover:bg-secondary-700 dark:focus:ring-secondary-800 disabled:opacity-75 disabled:hover:bg-secondary-600 "
        >
          Edit Product
        </button>
        <button
          onClick={() => onDeleteProduct()}
          className="my-6 text-white bg-secondary-500 hover:bg-secondary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-6 py-2.5 text-center dark:bg-secondary-500 dark:hover:bg-secondary-700 dark:focus:ring-secondary-800 disabled:opacity-75 disabled:hover:bg-secondary-600 "
        >
          Delete Product
        </button>
        <button
          onClick={() => router.push("/admin/stock")}
          className="mx-4 my-6 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600 "
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default ViewBlog;
