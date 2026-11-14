import mongoose from "mongoose";
import { catchAsyncErrors } from "./catchAsyncErrors.js";
import ErrorHandler from "./error.js";
import { Auction } from "../models/auctionSchema.js";

export const checkAuctionEndTime = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Định dạng ID không hợp lệ.", 400));
  }
  const auction = await Auction.findById(id);
  if (!auction) {
    return next(new ErrorHandler("Không tìm thấy phiên đấu giá.", 404));
  }
  const now = new Date();
  if (new Date(auction.startTime) > now) {
    return next(new ErrorHandler("Phiên đấu giá chưa bắt đầu.", 400));
  }
  if (new Date(auction.endTime) < now) {
    return next(new ErrorHandler("Phiên đấu giá đã kết thúc.", 400));
  }
  next();
});
