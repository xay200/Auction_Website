// import cron from "node-cron";
// import { Auction } from "../models/auctionSchema.js";
// import { User } from "../models/userSchema.js";
// import { Bid } from "../models/bidSchema.js";
// import { sendEmail } from "../utils/sendEmail.js";
// import { calculateCommission } from "../controllers/commissionController.js";

// export const endedAuctionCron = () => {
//   cron.schedule("*/1 * * * *", async () => {
//     const now = new Date();
//     console.log("Cron for ended auction running...");
//     const endedAuctions = await Auction.find({
//       endTime: { $lt: now },
//       commissionCalculated: false,
//     });
//     for (const auction of endedAuctions) {
//         console.log("--------------------------------");
//         console.log("Auction ID:", auction._id);
//         console.log("Title:", auction.title);
//         console.log("End time:", auction.endTime);
//         console.log("Current bid:", auction.currentBid);
//         console.log(
//           "Commission calculated:",
//           auction.commissionCalculated
//         );
//       try {
//         const commissionAmount = await calculateCommission(auction._id);
//         auction.commissionCalculated = true;
//         const highestBidder = await Bid.findOne({
//           auctionItem: auction._id,
//           amount: auction.currentBid,
//         });
//         const auctioneer = await User.findById(auction.createdBy);
//         auctioneer.unpaidCommission = commissionAmount;
//         if (highestBidder) {
//           auction.highestBidder = highestBidder.bidder.id;
//           await auction.save();
//           const bidder = await User.findById(highestBidder.bidder.id);
//           await User.findByIdAndUpdate(
//             bidder._id,
//             {
//               $inc: {
//                 moneySpent: highestBidder.amount,
//                 auctionsWon: 1,
//               },
//             },
//             { new: true }
//           );
//           await User.findByIdAndUpdate(
//             auctioneer._id,
//             {
//               $inc: {
//                 unpaidCommission: commissionAmount,
//               },
//             },
//             { new: true }
//           );
//           const subject = `Congratulations! You won the auction for ${auction.title}`;
//           const message = `Dear ${bidder.userName}, \n\nCongratulations! You have won the auction for ${auction.title}. \n\nBefore proceeding for payment contact your auctioneer via your auctioneer email:${auctioneer.email} \n\nPlease complete your payment using one of the following methods:\n\n1. **Bank Transfer**: \n- Account Name: ${auctioneer.paymentMethods.bankTransfer.bankAccountName} \n- Account Number: ${auctioneer.paymentMethods.bankTransfer.bankAccountNumber} \n- Bank: ${auctioneer.paymentMethods.bankTransfer.bankName}\n\n2. **Easypaise**:\n- You can send payment via Easypaise: ${auctioneer.paymentMethods.easypaisa.easypaisaAccountNumber}\n\n3. **PayPal**:\n- Send payment to: ${auctioneer.paymentMethods.paypal.paypalEmail}\n\n4. **Cash on Delivery (COD)**:\n- If you prefer COD, you must pay 20% of the total amount upfront before delivery.\n- To pay the 20% upfront, use any of the above methods.\n- The remaining 80% will be paid upon delivery.\n- If you want to see the condition of your auction item then send your email on this: ${auctioneer.email}\n\nPlease ensure your payment is completed by [Payment Due Date]. Once we confirm the payment, the item will be shipped to you.\n\nThank you for participating!\n\nBest regards,\nWeBid Auction Team`;
//           console.log("SENDING EMAIL TO HIGHEST BIDDER");
//           sendEmail({ email: bidder.email, subject, message });
//           console.log("SUCCESSFULLY EMAIL SEND TO HIGHEST BIDDER");
//         } else {
//           await auction.save();
//         }
//       } catch (error) {
//         console.error("CRON ERROR:", error);
//         return next(console.error(error || "Some error in ended auction cron"));
//       }
//     }
//   });
// };


import cron from "node-cron";
import { Auction } from "../models/auctionSchema.js";
import { User } from "../models/userSchema.js";
import { Bid } from "../models/bidSchema.js";
import { sendEmail } from "../utils/sendEmail.js";
import { calculateCommission } from "../controllers/commissionController.js";

export const endedAuctionCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    console.log("\n========== ENDED AUCTION CRON START ==========");

    try {
      const now = new Date();

      console.log("[1] Current time:", now.toISOString());

      // Kiểm tra kết nối MongoDB
      console.log("[2] MongoDB readyState:",
        Auction.db.readyState
      );

      // Tìm các phiên đã hết hạn
      const endedAuctions = await Auction.find({
        endTime: { $lt: now },
        commissionCalculated: false,
      });

      console.log("[3] Found ended auctions:", endedAuctions.length);

      if (endedAuctions.length === 0) {
        console.log("[INFO] No auction needs processing");
      }

      for (const auction of endedAuctions) {
        console.log("\n--------------------------------");
        console.log("Processing auction:", auction._id);
        console.log("Title:", auction.title);
        console.log("End time:", auction.endTime);
        console.log("End time type:", typeof auction.endTime);
        console.log("Current bid:", auction.currentBid);
        console.log(
          "Commission calculated:",
          auction.commissionCalculated
        );

        try {
          // BƯỚC 1: Tính hoa hồng
          console.log("[4] Calculating commission...");

          const commissionAmount = await calculateCommission(
            auction._id
          );

          console.log("[4 SUCCESS] Commission:", commissionAmount);

          // BƯỚC 2: Tìm người đặt giá cao nhất
          console.log("[5] Finding highest bidder...");

          const highestBidder = await Bid.findOne({
            auctionItem: auction._id,
            amount: auction.currentBid,
          });

          console.log("[5 RESULT] Highest bidder:", highestBidder);

          // BƯỚC 3: Tìm người bán
          console.log("[6] Finding auctioneer...");

          const auctioneer = await User.findById(auction.createdBy);

          console.log("[6 RESULT] Auctioneer:", auctioneer?._id);

          if (!auctioneer) {
            throw new Error("Auctioneer not found");
          }

          // BƯỚC 4: Xử lý người thắng
          if (highestBidder) {
            console.log("[7] Winner found");

            console.log(
              "[7] Bidder field:",
              highestBidder.bidder
            );

            const winnerId =
              highestBidder.bidder?._id ||
              highestBidder.bidder;

            const bidder = await User.findById(winnerId);

            console.log("[7 RESULT] Winner:", bidder?._id);

            if (!bidder) {
              throw new Error("Winner not found");
            }

            // Cập nhật người thắng
            auction.highestBidder = bidder._id;

            await auction.save();

            console.log("[8 SUCCESS] Auction winner saved");

            // Cập nhật thống kê người thắng
            const updatedBidder = await User.findByIdAndUpdate(
              bidder._id,
              {
                $inc: {
                  moneySpent: highestBidder.amount,
                  auctionsWon: 1,
                },
              },
              { new: true }
            );

            console.log("[9 SUCCESS] Winner statistics:", {
              id: updatedBidder?._id,
              moneySpent: updatedBidder?.moneySpent,
              auctionsWon: updatedBidder?.auctionsWon,
            });

            // Cập nhật hoa hồng người bán
            const updatedAuctioneer = await User.findByIdAndUpdate(
              auctioneer._id,
              {
                $inc: {
                  unpaidCommission: commissionAmount,
                },
              },
              { new: true }
            );

            console.log("[10 SUCCESS] Auctioneer commission:", {
              id: updatedAuctioneer?._id,
              unpaidCommission: updatedAuctioneer?.unpaidCommission,
            });

            // Đánh dấu đã tính hoa hồng
            auction.commissionCalculated = true;
            await auction.save();

            console.log("[11 SUCCESS] Commission marked as calculated");

            // BƯỚC 5: Gửi email
            const subject = `Congratulations! You won the auction for ${auction.title}`;

            const message = `Dear ${bidder.userName},

Congratulations! You have won the auction for ${auction.title}.

Before proceeding for payment contact your auctioneer via your auctioneer email: ${auctioneer.email}

Please complete your payment using one of the following methods:

1. Bank Transfer:
- Account Name: ${auctioneer.paymentMethods?.bankTransfer?.bankAccountName || "Not provided"}
- Account Number: ${auctioneer.paymentMethods?.bankTransfer?.bankAccountNumber || "Not provided"}
- Bank: ${auctioneer.paymentMethods?.bankTransfer?.bankName || "Not provided"}

2. Easypaisa:
- Account Number: ${auctioneer.paymentMethods?.easypaisa?.easypaisaAccountNumber || "Not provided"}

3. PayPal:
- Email: ${auctioneer.paymentMethods?.paypal?.paypalEmail || "Not provided"}

4. Cash on Delivery (COD):
- Please contact the auctioneer for payment instructions.

Thank you for participating!

Best regards,
WeBid Auction Team`;

            try {
              console.log("[12] Sending email to:", bidder.email);

              await sendEmail({
                email: bidder.email,
                subject,
                message,
              });

              console.log("[12 SUCCESS] Email sent");
            } catch (emailError) {
              console.error("[12 EMAIL ERROR]", emailError);
            }
          } else {
            console.log("[7] No bidder found");

            auction.commissionCalculated = true;
            await auction.save();

            console.log("[8 SUCCESS] Auction without bidder processed");
          }

          console.log("[SUCCESS] Auction completed:", auction._id);

        } catch (error) {
          console.error(
            "[AUCTION PROCESSING ERROR]",
            auction._id,
            error.stack || error
          );
        }
      }

      console.log("\n========== ENDED AUCTION CRON FINISHED ==========\n");

    } catch (error) {
      console.error(
        "[CRON GLOBAL ERROR]",
        error.stack || error
      );
    }
  });
};
