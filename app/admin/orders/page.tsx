"use client";
import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminSideBar from "@/components/AdminSidebar";

interface Product {
  orderID: string;
  outletID: string;
  productID: string;
  quantity: number;
  total: number;
  orderStatus: string;
}

function Page() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://localhost:7060/api/orders");
        console.log(res.data);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const acceptOrder = async (product: any) => {
    try {
      product.orderStatus = "Accepted";

      const res2 = await axios.get(
        `https://localhost:7060/api/products/${product.productID}`
      );
      const productData = res2.data;

      let quantity =
        parseInt(productData.quantity) - parseInt(product.quantity);

      console.log("Quantity: " + quantity);

      if (quantity > 0) {
        await axios.put(
          `https://localhost:7060/api/orders/${product.orderID}`,
          {
            orderID: product.orderID,
            outletID: product.outletID,
            productID: product.productID,
            quantity: product.quantity,
            total: product.total,
            orderStatus: product.orderStatus,
            orderDate: product.orderDate,
          }
        );

        await axios.put(
          `https://localhost:7060/api/products/${product.productID}`,
          {
            productID: productData.productID,
            name: productData.name,
            category: productData.category,
            size: productData.size,
            quantity: quantity.toString(),
            price: productData.price,
            status: productData.status,
          }
        );

        await axios.post(
          `https://localhost:7060/api/stock/${product.outletID}`,
          {
            outletID: product.outletID,
            productID: product.productID,
            productName: productData.name,
            quantity: product.quantity,
            productCategory: productData.category,
            productSize: productData.size,
            productBuyingPrice: productData.price,
          }
        );
      } else {
        await axios.put(
          `https://localhost:7060/api/orders/${product.orderID}`,
          {
            orderID: product.orderID,
            outletID: product.outletID,
            productID: product.productID,
            quantity: product.quantity,
            total: product.total,
            orderStatus: "Pre Ordered",
            orderDate: product.orderDate,
          }
        );

        await axios.put(
          `https://localhost:7060/api/products/${product.productID}`,
          {
            productID: productData.productID,
            name: productData.name,
            category: productData.category,
            size: productData.size,
            quantity: productData.quantity,
            price: productData.price,
            status: "Locked",
          }
        );
      }
    } catch (error) {
      console.log(error);
    }
  };

  const rejectOrder = async (product: any) => {
    try {
      product.orderStatus = "Rejected";
      const res = await axios.put(
        `https://localhost:7060/api/orders/${product.orderID}`,
        {
          orderID: product.orderID,
          outletID: product.outletID,
          productID: product.productID,
          quantity: product.quantity,
          total: product.total,
          orderStatus: product.orderStatus,
          orderDate: product.orderDate,
        }
      );
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <AdminSideBar />
      <div className="overflow-x-auto ml-64">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="pr-4 pl-8 py-2">
                outlet ID
              </th>

              <th scope="col" className="px-4 py-2">
                PRODUCT ID
              </th>
              <th scope="col" className="px-4 py-2">
                Quantity
              </th>
              <th scope="col" className="px-4 py-2">
                Total Price (LKR)
              </th>
              <th scope="col" className="px-2 py-2">
                actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products
              ?.filter((product) => product.orderStatus == "Pending")
              .map((product) => {
                return (
                  <tr
                    key={product.outletID}
                    className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-80 dark:hover:bg-gray-700"
                  >
                    <td className="pr-4 pl-8 py-3 truncate">
                      {product.outletID}
                    </td>

                    <td className="px-4 py-3 w-36 truncate">
                      {product.productID}
                    </td>
                    <td className="px-4 py-3 w-48">{product.quantity}</td>
                    <td className="px-4 py-3 w-48">{product.total}</td>
                    <td className="px-2 py-3 w-48">
                      <button
                        onClick={() => acceptOrder(product)}
                        className="my-1 text-white bg-tertiary-400 hover:bg-tertiary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1 text-center  dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => rejectOrder(product)}
                        className="my-1 text-white bg-secondary-500 hover:bg-secondary-600 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1 mx-2 text-center dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600"
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Page;
