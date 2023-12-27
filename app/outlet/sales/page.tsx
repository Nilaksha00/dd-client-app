"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import OutletSideBar from "@/components/OutletSidebar";

interface Product {
  stockID: string;
  productName: string;
  productCategory: string;
  productSize: string;
  productBuyingPrice: number;
}

interface OrderProductModalProps {
  onClose: () => void;
  productName: string;
  price: number;
  productId: string;
}

function Page() {
  const [products, setProducts] = useState<Product[]>([]);
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState(0);
  const [productId, setProductId] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

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
                Unit Price (LKR)
              </th>
              <th scope="col" className="px-2 py-2">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              return (
                <tr
                  key={product.stockID}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <td className="pr-4 pl-8 py-3">{product.productName}</td>
                  <td className="px-4 py-3 w-60">{product.productCategory}</td>
                  <td className="px-4 py-3 w-36">{product.productSize}</td>
                  <td className="px-4 py-3 w-48">
                    {product.productBuyingPrice}
                  </td>
                  <td className="px-2 py-3 w-48">
                    <button
                      onClick={() => {
                        openModal();
                        setProductName(product.productName);
                        setPrice(product.productBuyingPrice);
                        setProductId(product.stockID);
                      }}
                      className="my-1 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1  text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600"
                    >
                      Purchase
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <OrderProductModal
          onClose={closeModal}
          productName={productName}
          price={price}
          productId={productId}
        />
      )}
    </div>
  );
}

const OrderProductModal: React.FC<OrderProductModalProps> = ({
  onClose,
  productName,
  price,
  productId,
}) => {
  const [quantity, setQuantity] = useState(0);
  const [total, setTotal] = useState(0);

  const confirmOrder = async (
    productName: string,
    quantity: number,
    total: number
  ) => {
    const user = JSON.parse(localStorage.getItem("user")!);

    try {
      const allOrdersResponse = await axios.get(
        "https://localhost:7060/api/orders/"
      );
      const allOrders = allOrdersResponse.data;

      // Filter orders based on product and outlet
      const existingOrder = allOrders.find(
        (order: any) =>
          order.productID === productId &&
          order.outletID === user.userID &&
          order.orderStatus === "Pending"
      );

      if (existingOrder) {
        let newQuantity = parseInt(existingOrder.quantity) + quantity;
        let newTotal = parseInt(existingOrder.total) + price * quantity;

        const updateResponse = await axios.put(
          `https://localhost:7060/api/orders/${existingOrder.orderID}`,
          {
            productID: productId,
            quantity: newQuantity.toString(),
            total: newTotal.toString(),
            outletID: existingOrder.outletID,
            orderStatus: existingOrder.orderStatus,
            orderDate: existingOrder.orderDate,
          }
        );

        console.log("Order updated:", updateResponse.data);
      } else {
        const addResponse = await axios.post(
          "https://localhost:7060/api/orders/add",
          {
            productID: productId,
            productName: productName,
            quantity: quantity.toString(),
            total: (price * quantity).toString(),
            orderStatus: "Pending",
            orderDate: new Date(),
            outletID: user.userID,
          }
        );

        console.log("New order added:", addResponse.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className=" bg-opacity-20 bg-white p-8 w-1/2 rounded-lg">
        <div className="w-full mb-8">
          <label
            htmlFor="small-input"
            className="block w-full mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Name
          </label>
          <input
            type="text"
            readOnly
            value={productName}
            id="small-input"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="w-full my-4">
          <label
            htmlFor="small-input"
            className="block w-full mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Quantity
          </label>
          <input
            type="number"
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            id="small-input"
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>

        <div className="w-full my-4">
          <label
            htmlFor="small-input"
            className="block w-full mb-2 text-sm font-medium text-gray-900 dark:text-white"
          >
            Total (LKR)
          </label>
          <input
            type="number"
            value={quantity * price}
            id="small-input"
            readOnly
            className="block w-full p-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          />
        </div>
        <button
          onClick={() => confirmOrder(productName, quantity, total)}
          className="my-2 mr-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600"
        >
          Confirm Order
        </button>
        <button
          onClick={onClose}
          className="my-2 text-white bg-primary-600 hover:bg-primary-700 focus:ring-1 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-xs px-3 py-1 text-center dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 disabled:opacity-75 disabled:hover:bg-primary-600"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default Page;
