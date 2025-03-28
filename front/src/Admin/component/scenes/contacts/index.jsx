import React, { useState, useEffect } from "react";
import { Box, IconButton, Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material";
import { connect } from "react-redux";
import { fetchCategories, updateCategory, deleteCategory } from "../../../actions/CategoryAction";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const Contacts = (props) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [updatedName, setUpdatedName] = useState("");
  const [categories, setCategories] = useState([]);
  useEffect(() => {
    props.fetchCategories();
  }, []);

  // const { categories } = props;
  useEffect(() => {
    setCategories(props.categories); // Update local state when Redux state changes
  }, [props.categories]);

  const handleEdit = (category) => {
    setSelectedCategory(category);
    setUpdatedName(category.name);
    setEditDialogOpen(true);
  };

  const handleDelete = async (id) => {
    await props.deleteCategory(id);
  };

  const handleUpdate = async () => {
    if (selectedCategory) {
      await props.updateCategory(selectedCategory.id, { name: updatedName });
      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === selectedCategory._id
            ? { ...category, name: updatedName }
            : category
        )
      );
      
      setEditDialogOpen(false);
    }
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 0.5 },
    { field: "name", headerName: "Name", flex: 1 },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleEdit(params.row)} color="primary">
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row.id)} color="error">
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const rows = categories.map((category, index) => ({
    id: category._id, // Use MongoDB ID
    name: category.name,
  }));

  return (
    <Box m="20px">
      <Header title="Quản lý danh mục" subtitle="Danh sách danh mục " />
      <Box m="40px 0 0 0" height="75vh">
        <DataGrid rows={rows} columns={columns} components={{ Toolbar: GridToolbar }} />
      </Box>

      {/* Dialog for editing category */}
      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Chỉnh sửa thể loại</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Category Name"
            value={updatedName}
            onChange={(e) => setUpdatedName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleUpdate} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

const mapStateToProps = (state) => ({
  categories: state.CategoryAdmin.categories || [],
});

export default connect(mapStateToProps, { fetchCategories, updateCategory, deleteCategory })(Contacts);
