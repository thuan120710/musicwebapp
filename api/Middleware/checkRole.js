const checkRole = (requiredRoles) => {
  return (req, res, next) => {
    console.log("User Role from Token:", req.user?.role);
    console.log("Required Roles:", requiredRoles);

    // Kiểm tra vai trò của user
    if (!req.user || !requiredRoles.includes(req.user.role)) {
      console.log("Access Denied: Insufficient permissions");
      return res
        .status(403)
        .json({ message: "Access Denied: Insufficient permissions" });
    }

    console.log("Access Granted");
    next(); // Tiếp tục xử lý nếu vai trò hợp lệ
  };
};

module.exports = checkRole;
