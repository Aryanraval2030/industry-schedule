const API_BASE_URL = "https://industry-schedule-4.onrender.com/api";

const request = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || `Request failed with status ${response.status}`,
      );
    }

    return data;
  } catch (error) {
    console.error(`[API Request Error] ${endpoint}:`, error.message);
    throw error;
  }
};

// Product APIs
export const fetchProducts = (params = {}) => {
  const query = new URLSearchParams();

  if (params.search) query.append("search", params.search);

  if (params.category && params.category !== "All") {
    query.append("category", params.category);
  }

  if (params.minPrice) query.append("minPrice", params.minPrice);
  if (params.maxPrice) query.append("maxPrice", params.maxPrice);
  if (params.sort) query.append("sort", params.sort);
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);

  const queryString = query.toString() ? `?${query.toString()}` : "";

  return request(`/products${queryString}`);
};

export const fetchCategories = () => request("/products/categories");

export const fetchFeaturedProducts = () => request("/products/featured");

export const fetchProductDetails = (identifier) =>
  request(`/products/${identifier}`);

// Payment & Order APIs (Demo Simulation)
export const createDemoOrder = (orderData) =>
  request("/payment/demo/create-order", {
    method: "POST",
    body: JSON.stringify(orderData),
  });

export const confirmDemoPayment = (paymentData) =>
  request("/payment/demo/confirm", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });

// Payment & Order APIs (Razorpay)
export const createRazorpayOrder = (orderData) =>
  request("/payment/create-order", {
    method: "POST",
    body: JSON.stringify(orderData),
  });

export const verifyPaymentSignature = (paymentData) =>
  request("/payment/verify", {
    method: "POST",
    body: JSON.stringify(paymentData),
  });

export const notifyPaymentFailure = (failureData) =>
  request("/payment/failure", {
    method: "POST",
    body: JSON.stringify(failureData),
  });

export const fetchRazorpayConfig = () => request("/payment/config");

// Order APIs
export const fetchOrderDetails = (identifier) =>
  request(`/orders/${identifier}`);

export const fetchOrders = (email) => {
  const query = email ? `?email=${encodeURIComponent(email)}` : "";

  return request(`/orders${query}`);
};
