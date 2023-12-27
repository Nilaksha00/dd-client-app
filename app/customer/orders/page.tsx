"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import SellerSideBar from "@/components/SellerSidebar";
import CustomerSidebar from "@/components/CustomerSidebar";

interface Product {
  orderID: string;
  productID: string;
  quantity: number;
  total: number;
  orderStatus: string;
  outletID: string;
}

function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

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

  const filterProducts = products.filter((product) => {
    const user = JSON.parse(localStorage.getItem("user")!);
    return product.outletID === user.userID;
  });

  return (
    <div>
      <CustomerSidebar />
      <div className="overflow-x-auto ml-64">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="pr-4 pl-8 py-2">
                Order ID
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
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {filterProducts.map((product) => {
              return (
                <tr
                  key={product.orderID}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-80 dark:hover:bg-gray-700"
                  //   onClick={() => {
                  //     router.push(`/admin/stock/item?id=${product.order}`);
                  //   }}
                >
                  <td className="pr-4 pl-8 py-3 truncate">{product.orderID}</td>

                  <td className="px-4 py-3 w-36 truncate">
                    {product.productID}
                  </td>
                  <td className="px-4 py-3 w-48">{product.quantity}</td>
                  <td className="px-4 py-3 w-48">{product.total}</td>
                  <td className="px-2 py-3 w-48">{product.orderStatus}</td>
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
