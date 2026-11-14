import { User } from "../models/userSchema.js";
import { PaymentProof } from "../models/commissionProofSchema.js";
import { Commission } from "../models/commissionSchema.js";
import cron from "node-cron";
import { sendEmail } from "../utils/sendEmail.js";

export const verifyCommissionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("Running Verify Commission Cron...");
    const approvedProofs = await PaymentProof.find({ status: "Approved" });
    for (const proof of approvedProofs) {
      try {
        const user = await User.findById(proof.userId);
        let updatedUserData = {};
        if (user) {
          if (user.unpaidCommission >= proof.amount) {
            updatedUserData = await User.findByIdAndUpdate(
              user._id,
              {
                $inc: {
                  unpaidCommission: -proof.amount,
                },
              },
              { new: true }
            );
            await PaymentProof.findByIdAndUpdate(proof._id, {
              status: "Settled",
            });
          } else {
            updatedUserData = await User.findByIdAndUpdate(
              user._id,
              {
                unpaidCommission: 0,
              },
              { new: true }
            );
            await PaymentProof.findByIdAndUpdate(proof._id, {
              status: "Settled",
            });
          }
          await Commission.create({
            amount: proof.amount,
            user: user._id,
          });
          const settlementDate = new Date(Date.now())
            .toString()
            .substring(0, 15);

          const subject = `Thanh toán của bạn đã được xác nhận và hoàn tất thành công.`;
          const message = `Xin chào ${user.userName},\n\nChúng tôi vui mừng thông báo rằng khoản thanh toán gần đây của bạn đã được xác minh và hoàn tất thành công. Cảm ơn bạn đã nhanh chóng cung cấp minh chứng thanh toán cần thiết Tài khoản của bạn đã được cập nhật. Bạn có thể tiếp tục sử dụng các chức năng trên hệ thống mà không còn bị hạn chế.\n\nCHI TIẾT THANH TOÁN:\nSố tiền đã thanh toán: ${proof.amount}\nSố tiền hoa hồng còn phải thanh toán: ${updatedUserData.unpaidCommission}\nNgày hoàn tất thanh toán: ${settlementDate}\n\nTrân trọng,\nWeBid Auction Team`;
          sendEmail({ email: user.email, subject, message });
        }
        console.log(`User ${proof.userId} paid commission of ${proof.amount}`);
      } catch (error) {
        console.error(
          `Error processing commission proof for user ${proof.userId}: ${error.message}`
        );
      }
    }
  });
};
