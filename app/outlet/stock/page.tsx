"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import OutletSideBar from "@/components/OutletSidebar";

interface Product {
  productID: string;
  name: string;
  category: string;
  size: string;
  quantity: number;
  price: number;
  status: string;
}

function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://localhost:7060/api/products");
        console.log(res.data);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <OutletSideBar />
      <div className="overflow-x-auto ml-64">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
          <thead className=" text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="pr-4 pl-8 py-2">
                Product Name
              </th>
              <th scope="col" className="px-4 py-2">
                Category
              </th>
              <th scope="col" className="px-4 py-2">
                Size
              </th>
              <th scope="col" className="px-4 py-2">
                Stock Quantity
              </th>
              <th scope="col" className="px-4 py-2">
                Unit Price (LKR)
              </th>
              <th scope="col" className="px-2 py-2">
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              let statusContent;
              if (product.status === "available") {
                statusContent = "Available";
              } else if (product.status === "low") {
                statusContent = "Low Stock";
              } else if (product.status === "out") {
                statusContent = "Out of Stock";
              } else if (product.status === "locked") {
                statusContent = "Locked";
              } else {
                statusContent = "Available";
              }

              return (
                <tr
                  key={product.productID}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-80 dark:hover:bg-gray-700"
                  onClick={() => {
                    router.push(`/admin/stock/item?id=${product.productID}`);
                  }}
                >
                  <td className="pr-4 pl-8 py-3">{product.name}</td>
                  <td className="px-4 py-3 w-60">{product.category}</td>
                  <td className="px-4 py-3 w-36">{product.size}</td>
                  <td className="px-4 py-3 w-48">{product.quantity}</td>
                  <td className="px-4 py-3 w-48">{product.price}</td>
                  <td className="px-2 py-3 w-48">{statusContent}</td>
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
