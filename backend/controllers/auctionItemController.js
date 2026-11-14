import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { v2 as cloudinary } from "cloudinary";
import mongoose from "mongoose";

export const addNewAuctionItem = catchAsyncErrors(async (req, res, next) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Vui lòng cung cấp hình ảnh sản phẩm đấu giá.", 400));
  }

  const { image } = req.files;

  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("Định dạng tệp không được hỗ trợ.", 400));
  }

  const {
    title,
    description,
    category,
    condition,
    startingBid,
    startTime,
    endTime,
  } = req.body;
  if (
    !title ||
    !description ||
    !category ||
    !condition ||
    !startingBid ||
    !startTime ||
    !endTime
  ) {
    return next(new ErrorHandler("Vui lòng cung cấp đầy đủ thông tin.", 400));
  }
  if (new Date(startTime) < Date.now()) {
    return next(
      new ErrorHandler(
        "Thời gian bắt đầu phiên đấu giá phải lớn hơn thời gian hiện tại.",
        400,
      ),
    );
  }
  if (new Date(startTime) >= new Date(endTime)) {
    return next(
      new ErrorHandler(
        "Thời gian bắt đầu phiên đấu giá phải nhỏ hơn thời gian kết thúc.",
        400,
      ),
    );
  }

  const MAX_ACTIVE_AUCTIONS = 5;
  const activeCount = await Auction.countDocuments({
    createdBy: req.user._id,
    endTime: { $gt: Date.now() },
  });
  if (activeCount >= MAX_ACTIVE_AUCTIONS) {
    return next(
      new ErrorHandler(
        `Bạn chỉ được phép có tối đa ${MAX_ACTIVE_AUCTIONS} phiên đấu giá đang hoạt động.`,
        400,
      ),
    );
  }

  try {
    const cloudinaryResponse = await cloudinary.uploader.upload(
      image.tempFilePath,
      {
        folder: "MERN_AUCTION_PLATFORM_AUCTIONS",
      },
    );
    if (!cloudinaryResponse || cloudinaryResponse.error) {
      console.error(
        "Cloudinary error:",
        cloudinaryResponse.error || "Unknown cloudinary error.",
      );
      return next(
        new ErrorHandler("Không thể tải hình ảnh sản phẩm đấu giá lên Cloudinary.", 500),
      );
    }
    const auctionItem = await Auction.create({
      title,
      description,
      category,
      condition,
      startingBid,
      startTime,
      endTime,
      image: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
      createdBy: req.user._id,
    });
    return res.status(201).json({
      success: true,
      message: `Sản phẩm đấu giá đã được tạo và sẽ xuất hiện trên trang đấu giá vào lúc ${startTime}`,
      auctionItem,
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Không thể tạo phiên đấu giá.", 500),
    );
  }
});

export const getAllItems = catchAsyncErrors(async (req, res, next) => {
  const {
    keyword = "",
    category = "",
    page = 1,
    limit = 8,
  } = req.query;

  const query = {};

  if (keyword.trim()) {
    query.title = {
      $regex: keyword.trim(),
      $options: "i",
    };
  }

  if (category.trim()) {
    query.category = category.trim();
  }

  const currentPage = Math.max(1, parseInt(page, 10) || 1);
  const itemsPerPage = Math.min(
    50,
    Math.max(1, parseInt(limit, 10) || 8)
  );

  const totalItems = await Auction.countDocuments(query);

  const items = await Auction.find(query)
    .sort({ createdAt: -1 })
    .skip((currentPage - 1) * itemsPerPage)
    .limit(itemsPerPage);

  res.status(200).json({
    success: true,
    count: items.length,
    totalItems,
    currentPage,
    totalPages: Math.ceil(totalItems / itemsPerPage),
    items,
  });
});

export const getAuctionDetails = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Định dạng ID không hợp lệ.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Không tìm thấy phiên đấu giá.", 404));
  }
  const bidders = auctionItem.bids.sort((a, b) => b.amount - a.amount);
  res.status(200).json({
    success: true,
    auctionItem,
    bidders,
  });
});

export const getMyAuctionItems = catchAsyncErrors(async (req, res, next) => {
  const items = await Auction.find({ createdBy: req.user._id });
  res.status(200).json({
    success: true,
    items,
  });
});

export const removeFromAuction = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Định dạng ID không hợp lệ.", 400));
  }
  const auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Không tìm thấy phiên đấu giá.", 404));
  }
  await auctionItem.deleteOne();
  res.status(200).json({
    success: true,
    message: "Xóa sản phẩm đấu giá thành công.",
  });
});

export const republishItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new ErrorHandler("Định dạng ID không hợp lệ.", 400));
  }
  let auctionItem = await Auction.findById(id);
  if (!auctionItem) {
    return next(new ErrorHandler("Không tìm thấy phiên đấu giá.", 404));
  }
  if (!req.body.startTime || !req.body.endTime) {
    return next(
      new ErrorHandler("Vui lòng cung cấp thời gian bắt đầu và kết thúc khi đăng lại phiên đấu giá."),
    );
  }
  if (new Date(auctionItem.endTime) > Date.now()) {
    return next(
      new ErrorHandler("Phiên đấu giá vẫn đang hoạt động, không thể đăng lại.", 400),
    );
  }
  let data = {
    startTime: new Date(req.body.startTime),
    endTime: new Date(req.body.endTime),
  };
  if (data.startTime < Date.now()) {
    return next(
      new ErrorHandler(
        "Thời gian bắt đầu phiên đấu giá phải lớn hơn thời gian hiện tại.",
        400,
      ),
    );
  }
  if (data.startTime >= data.endTime) {
    return next(
      new ErrorHandler(
        "Thời gian bắt đầu phiên đấu giá phải nhỏ hơn thời gian kết thúc.",
        400,
      ),
    );
  }

  if (auctionItem.highestBidder) {
    const highestBidder = await User.findById(auctionItem.highestBidder);
    highestBidder.moneySpent -= auctionItem.currentBid;
    highestBidder.auctionsWon -= 1;
    highestBidder.save();
  }

  data.bids = [];
  data.commissionCalculated = false;
  data.currentBid = 0;
  data.highestBidder = null;
  auctionItem = await Auction.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });
  await Bid.deleteMany({ auctionItem: auctionItem._id });
  const createdBy = await User.findByIdAndUpdate(
    req.user._id,
    { unpaidCommission: 0 },
    {
      new: true,
      runValidators: false,
      useFindAndModify: false,
    },
  );
  res.status(200).json({
    success: true,
    auctionItem,
    message: `Phiên đấu giá đã được đăng lại và sẽ hoạt động vào lúc ${req.body.startTime}`,
    createdBy,
  });
});
