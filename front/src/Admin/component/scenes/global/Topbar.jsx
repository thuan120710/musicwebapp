import { Box} from "@mui/material";

const Topbar = () => {

  const handleLogout = async () => {
    await localStorage.removeItem("token");
    window.location.href = "/login";
  };
  return (
    <Box display="flex" justifyContent="end" p={2}>
      <div className="button__log-out cursor-pointer rounded-pill py-3 px-4 fs-4" onClick={handleLogout}>
        <i class="fa-solid fa-right-from-bracket me-2"></i>
        <span className="fw-bold">Đăng xuất</span>
      </div>
    </Box>
  );
};

export default Topbar;
