import { User } from "../models/userSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";

export const trackCommissionStatus = catchAsyncErrors(
  async (req, res, next) => {
    const user = await User.findById(req.user._id);
    if (user.unpaidCommission > 0) {
      return next(
        new ErrorHandler(
          "Bạn vẫn còn khoản hoa hồng chưa thanh toán. Vui lòng thanh toán trước khi đăng phiên đấu giá mới.",
          403
        )
      );
    }
    next();
  }
);
