import {
  FETCH_CATEGORIES_REQUEST,
  FETCH_CATEGORIES_SUCCESS,
  FETCH_CATEGORIES_FAILURE,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  UPDATE_CATEGORY_SUCCESS,
  UPDATE_CATEGORY_FAILURE,
} from "./types";

// Fetch categories action
export const fetchCategories = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_CATEGORIES_REQUEST });

    try {
      const response = await fetch("http://localhost:4000/api/categories");
      const data = await response.json();

      dispatch({ type: FETCH_CATEGORIES_SUCCESS, payload: data });
    } catch (error) {
      dispatch({ type: FETCH_CATEGORIES_FAILURE, payload: error.message });
    }
  };
};

// Update category action
export const updateCategory = (categoryId, updatedData) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/category/${categoryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(updatedData),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update category");
      }

      const data = await response.json();

      dispatch({
        type: UPDATE_CATEGORY_SUCCESS,
        payload: data, // Cập nhật danh mục mới trả về từ server
      });
    } catch (error) {
      dispatch({
        type: UPDATE_CATEGORY_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};

// Delete category action
export const deleteCategory = (categoryId) => {
  return async (dispatch) => {
    try {
      const response = await fetch(
        `http://localhost:4000/api/category/${categoryId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete category");
      }

      dispatch({
        type: DELETE_CATEGORY_SUCCESS,
        payload: categoryId, // Xóa danh mục theo _id
      });
    } catch (error) {
      dispatch({
        type: DELETE_CATEGORY_FAILURE,
        payload: error.message,
      });
      throw error;
    }
  };
};
