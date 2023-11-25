function formatPrice(price) {
  // Kiểm tra xem price có tồn tại và không phải là undefined
  if (price !== undefined) {
    // Convert price to VND format with commas for thousands
    return price.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
    });
  } else {
    // Trả về một giá trị mặc định hoặc thông báo lỗi tùy ý
    return "Price not available";
  }
}

// Function to format date-time
const formatDateTime = (dateTimeString) => {
  if (dateTimeString == null) return "Đang cập nhật";
  const options = {
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateTimeString).toLocaleDateString(undefined, options);
};

const formatWeight = (weight) => {
  return `${weight} grams`;
};
const formatDimensions = (dimensions) => {
  return `${dimensions} (cm)`;
};

export { formatPrice, formatDateTime, formatWeight, formatDimensions };
