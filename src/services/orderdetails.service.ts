import requests from "@/lib/httpServices";

const OrderService = {
  getOrderList: async (body: any) => {
    try {
      // Debugging - Log the request body
      console.log("Fetching order list with body:", body);

      // Send the API request
      const response = await requests.post("/webApi/index.php", body);

      // Check the response and return it
      if (response && response.data) {
        console.log("API Response:", response.data);
        return response.data;  // Return response if successful
      } else {
        throw new Error("No response data received");
      }
    } catch (error: any) {
      // Handle any errors and log them
      console.error("Error in getOrderList:", error);
      throw new Error(`API call failed: ${error.message || "Unknown error"}`);
    }
  },

  getOrderDetail: async (body: any) => {
    try {
      // Debugging - Log the request body
      console.log("Fetching order detail with body:", body);

      // Send the API request for order details
      const response = await requests.post("/webApi/index.php", body);

      // Check the response and return it
      if (response && response.data) {
        return response.data; // Return response if successful
      } else {
        throw new Error("No response data received");
      }
    } catch (error: any) {
      // Handle any errors and log them
      console.error("Error in getOrderDetail:", error);
      throw new Error(`API call failed: ${error.message || "Unknown error"}`);
    }
  },
};

export default OrderService;
