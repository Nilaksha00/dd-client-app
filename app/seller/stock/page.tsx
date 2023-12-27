"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import SellerSideBar from "@/components/SellerSidebar";

interface Product {
  stockID: string;
  outletID: string;
  productID: string;
  quantity: number;
  productBuyingPrice: number;
  productName: string;
  productCategory: string;
  productSize: string;
}

function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchKey, setSearchKey] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user")!);
        const res = await axios.get(
          `https://localhost:7060/api/stock/${user.userID}`
        );
        console.log(res.data);
        setProducts(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = products.filter((product) => {
    return (
      product.productName.toLowerCase().includes(searchKey.toLowerCase()) ||
      product.productCategory.toLowerCase().includes(searchKey.toLowerCase()) ||
      product.productID.toLowerCase().includes(searchKey.toLowerCase())
    );
  });

  return (
    <div>
      <SellerSideBar />
      <div className="overflow-x-auto ml-64">
        <div className="w-full flex flex-row align-middle justify-center">
          <input
            type="text"
            placeholder="Search"
            id="small-input"
            value={searchKey}
            onChange={(e) => setSearchKey(e.target.value)}
            className="block w-1/3 p-2 my-4 mr-6 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
          <button className="px-6 py-2 my-4 text-sm font-medium tracking-wide text-white capitalize bg-blue-500 rounded-lg dark:bg-gray-800 focus:outline-none focus:bg-blue-600 dark:focus:bg-gray-700">
            Search
          </button>
        </div>
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
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => {
              return (
                <tr
                  key={product.stockID}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-80 dark:hover:bg-gray-700"
                  onClick={() => {
                    router.push(`/admin/stock/item?id=${product.stockID}`);
                  }}
                >
                  <td className="pr-4 pl-8 py-3">{product.productName}</td>
                  <td className="px-4 py-3 w-60">{product.productCategory}</td>
                  <td className="px-4 py-3 w-36">{product.productSize}</td>
                  <td className="px-4 py-3 w-48">{product.quantity}</td>
                  <td className="px-4 py-3 w-48">
                    {product.productBuyingPrice}
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
