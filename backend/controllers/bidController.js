import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Auction } from "../models/auctionSchema.js";
import { Bid } from "../models/bidSchema.js";
import { User } from "../models/userSchema.js";
import { getIO } from "../socket.js";

export const placeBid = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const auctionItem = await Auction.findById(id);

  if (!auctionItem) {
    return next(new ErrorHandler("Không tìm thấy sản phẩm đấu giá.", 404));
  }

  const { amount } = req.body;

  if (!amount) {
    return next(new ErrorHandler("Vui lòng nhập mức giá.", 404));
  }

  if (amount <= auctionItem.currentBid) {
    return next(
      new ErrorHandler(
        "Giá đặt phải lớn hơn mức giá hiện tại.",
        404
      )
    );
  }

  if (amount < auctionItem.startingBid) {
    return next(
      new ErrorHandler(
        "Giá đặt phải lớn hơn giá khởi điểm.",
        404
      )
    );
  }

  try {
    let bidRecord;

    const existingBid = await Bid.findOne({
      "bidder.id": req.user._id,
      auctionItem: auctionItem._id,
    });

    const existingBidInAuction = auctionItem.bids.find(
      (bid) =>
        bid.userId.toString() === req.user._id.toString()
    );

    if (existingBid && existingBidInAuction) {
      existingBidInAuction.amount = amount;
      existingBid.amount = amount;

      await existingBidInAuction.save();
      await existingBid.save();

      bidRecord = existingBid;

      auctionItem.currentBid = amount;
    } else {
      const bidderDetail = await User.findById(req.user._id);

      if (!bidderDetail) {
        return next(new ErrorHandler("Không tìm thấy người dùng.", 404));
      }

      const bid = await Bid.create({
        amount,
        bidder: {
          id: bidderDetail._id,
          userName: bidderDetail.userName,
          profileImage: bidderDetail.profileImage?.url,
        },
        auctionItem: auctionItem._id,
      });

      auctionItem.bids.push({
        userId: req.user._id,
        userName: bidderDetail.userName,
        profileImage: bidderDetail.profileImage?.url,
        amount,
      });

      bidRecord = bid;

      auctionItem.currentBid = amount;
    }

    await auctionItem.save();

    const leaderboard = [...auctionItem.bids]
      .sort((a, b) => b.amount - a.amount)
      .map((bid, index) => ({
        rank: index + 1,
        userId: bid.userId,
        userName: bid.userName,
        profileImage: bid.profileImage,
        amount: bid.amount,
      }));

    getIO()
      .to(`auction-${id}`)
      .emit("newBid", {
        auctionId: id,
        bid: bidRecord,
        currentBid: auctionItem.currentBid,
        leaderboard,
      });

    res.status(201).json({
      success: true,
      message: "Đặt giá thành công.",
      currentBid: auctionItem.currentBid,
    });
  } catch (error) {
    return next(
      new ErrorHandler(
        error.message || "Không thể thực hiện đặt giá.",
        500
      )
    );
  }
});
