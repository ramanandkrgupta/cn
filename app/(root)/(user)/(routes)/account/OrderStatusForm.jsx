import { useState } from 'react';
   import axios from 'axios';
   import { toast } from 'sonner';

   const OrderStatusForm = () => {
     const [orderId, setOrderId] = useState('');
     const [customer_mobile, setcustomer_mobile] = useState('');
     const [amount, setamount,] = useState('1');
     const [remark1, setRemark1] = useState('TEST1234');
const [remark2, setRemark2] = useState('TEST1234');

     const [status, setStatus] = useState('SUCCESS');

     const handleSubmit = async (e) => {
       e.preventDefault();
       try {
         const response = await axios.post('/api/user/check-order-status', { order_id: orderId });
         setStatus(response.data);
         toast.success("Order status retrieved successfully!");
       } catch (error) {
         toast.error("Failed to retrieve order status.");
         console.error(error);
       }
     };

     return (
       <div className="bg-gray-50 p-6 rounded-lg shadow-sm mt-8">
         <h2 className="text-2xl font-bold mb-4">Check Order Status</h2>
         <form onSubmit={handleSubmit} className="space-y-4">
           <div>
             <label className="block text-gray-700">Order ID</label>
             <input
               type="text"
               value={orderId}
               onChange={(e) => setOrderId(e.target.value)}
               className="w-full p-2 border border-gray-300 rounded mt-1"
               required
             />
           </div>
           <button type="submit" className="bg-green-500 text-white py-2 px-4 rounded-lg">Check Status</button>
         </form>
         {status && (
           <div className="mt-4">
             <h3 className="text-xl font-bold">Order Status</h3>
             <p>Status: {status.status}</p>
             <p>Amount: {status.amount}</p>
             <p>Remark1: {status.remark1}</p>
             <p>Remark2: {status.remark2}</p>
           </div>
         )}
       </div>
     );
   };
export default OrderStatusForm;