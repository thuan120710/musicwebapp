import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";
import { Formik } from "formik";
import * as yup from "yup";
import useMediaQuery from "@mui/material/useMediaQuery";
import Header from "../../components/Header";
import { createCategory } from "../../../actions/AuthAdminAction";
import { connect } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import CSS của react-toastify

const Team = (props) => {
  const [category, setCategory] = useState(""); // State lưu giá trị của category
  const isNonMobile = useMediaQuery("(min-width:600px)"); // Check màn hình có lớn hơn 600px không

  // Hàm xử lý khi submit
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn reload mặc định

    const User = { name: category }; // Payload gửi đến server
    console.log("Form submitted with values:", User);

    try {
      await props.createCategory(User); // Gọi action thêm danh mục
      toast.success("Category added successfully!"); // Hiển thị thông báo thành công
      setCategory(""); // Reset giá trị input
    } catch (error) {
      toast.error("Failed to add category!"); // Hiển thị thông báo lỗi
      console.error("Error adding category:", error);
    }
  };

  return (
    <Box m="20px">
      <Header title="Tạo danh mục" subtitle="Tạo danh mục mới" />
      <ToastContainer position="top-right" autoClose={3000} /> {/* Container hiển thị toast */}
      <Formik
        initialValues={{ name: "" }} // Giá trị khởi tạo ban đầu
        validationSchema={checkoutSchema} // Ràng buộc validation
      >
        {({
          values,
          errors,
          touched,
          handleBlur,
          handleChange,
        }) => (
          <form onSubmit={handleSubmit}>
            <Box
              display="grid"
              gap="30px"
              gridTemplateColumns="repeat(4, minmax(0, 1fr))"
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" },
              }}
            >
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Category"
                onBlur={handleBlur}
                onChange={(e) => setCategory(e.target.value)} // Lưu giá trị input vào state
                value={category} // Giá trị hiện tại của input
                name="name"
                error={!!touched.name && !!errors.name} // Kiểm tra lỗi và touched
                helperText={touched.name && errors.name} // Hiển thị lỗi nếu có
                sx={{ gridColumn: "span 2" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px">
              <Button type="submit" color="secondary" variant="contained">
                Tạo Danh mục mới
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Ràng buộc validation bằng Yup
const checkoutSchema = yup.object().shape({
  name: yup.string().required("Category is required"), // Yêu cầu category không được để trống
});

// Kết nối Redux
const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps, { createCategory })(Team);
