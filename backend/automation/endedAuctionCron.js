import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import { calculateCommission } from "../controllers/commissionController.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    const now = new Date();
    console.log("Cron for ended auction running...");
    const pendingAuctions = await Auction.find({
      commissionCalculated: false,
    });

    const endedAuctions = pendingAuctions.filter((auction) => {
      const endTime = new Date(auction.endTime);

      return !isNaN(endTime.getTime()) && endTime < now;
    });
    for (const auction of endedAuctions) {
      try {
        const commissionAmount = await calculateCommission(auction._id);
        auction.commissionCalculated = true;
        const highestBidder = await Bid.findOne({
          auctionItem: auction._id,
          amount: auction.currentBid,
        });
        const auctioneer = await User.findById(auction.createdBy);
        auctioneer.unpaidCommission = commissionAmount;
        if (highestBidder) {
          auction.highestBidder = highestBidder.bidder.id;
          await auction.save();
          const bidder = await User.findById(highestBidder.bidder.id);
          await User.findByIdAndUpdate(
            bidder._id,
            {
              $inc: {
                moneySpent: highestBidder.amount,
                auctionsWon: 1,
              },
            },
            { new: true },
          );
          await User.findByIdAndUpdate(
            auctioneer._id,
            {
              $inc: {
                unpaidCommission: commissionAmount,
              },
            },
            { new: true },
          );
          const subject = `Chúc mừng! Bạn đã chiến thắng phiên đấu giá: ${auction.title}`;
          const message = `Xin chào ${bidder.userName}, \n\nChúc mừng! Bạn đã chiến thắng phiên đấu giá sản phẩm ${auction.title}. \n\nTrước khi tiến hành thanh toán, vui lòng liên hệ người bán qua email:${auctioneer.email} \n\n	Vui lòng hoàn tất thanh toán bằng một trong các phương thức sau:\n\n1. **Chuyển khoản ngân hàng**: \n- 	Tên chủ tài khoản: ${auctioneer.paymentMethods.bankTransfer.bankAccountName} \n- Số tài khoản: ${auctioneer.paymentMethods.bankTransfer.bankAccountNumber} \n- 	Ngân hàng: ${auctioneer.paymentMethods.bankTransfer.bankName}\n\n2. **PayPal**:\n- 	Gửi thanh toán đến: ${auctioneer.paymentMethods.paypal.paypalEmail}\n\n4. **Thanh toán khi nhận hàng (COD)**:\n- 	Nếu chọn COD, bạn cần thanh toán trước 20% tổng giá trị đơn hàng trước khi giao hàng.\n- 80% còn lại sẽ được thanh toán khi nhận hàng.\n- Nếu bạn muốn kiểm tra tình trạng sản phẩm đấu giá, vui lòng liên hệ với người bán qua email sau: ${auctioneer.email}\n\nVui lòng hoàn tất thanh toán trước thời hạn quy định. Sau khi xác nhận thanh toán, sản phẩm sẽ được gửi đến bạn.\n\nCảm ơn bạn đã tham gia đấu giá!\n\nTrân trọng,\nWeBid Auction Team`;
          console.log("SENDING EMAIL TO HIGHEST BIDDER");
          sendEmail({ email: bidder.email, subject, message });
          console.log("SUCCESSFULLY EMAIL SEND TO HIGHEST BIDDER");
        } else {
          await auction.save();
        }
      } catch (error) {
        return next(console.error(error || "Some error in ended auction cron"));
      }
    }
  });
};
