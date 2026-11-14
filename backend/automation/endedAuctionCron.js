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
    // const endedAuctions = await Auction.find({
    //   endTime: { $lt: now },
    //   commissionCalculated: false,
    // });
    const pendingAuctions = await Auction.find({
  commissionCalculated: false,
});

const endedAuctions = pendingAuctions.filter((auction) => {
  const endTime = new Date(auction.endTime);

  return (
    !isNaN(endTime.getTime()) &&
    endTime < now
  );
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
            { new: true }
          );
          await User.findByIdAndUpdate(
            auctioneer._id,
            {
              $inc: {
                unpaidCommission: commissionAmount,
              },
            },
            { new: true }
          );
          const subject = `Congratulations! You won the auction for ${auction.title}`;
          const message = `Dear ${bidder.userName}, \n\nCongratulations! You have won the auction for ${auction.title}. \n\nBefore proceeding for payment contact your auctioneer via your auctioneer email:${auctioneer.email} \n\nPlease complete your payment using one of the following methods:\n\n1. **Bank Transfer**: \n- Account Name: ${auctioneer.paymentMethods.bankTransfer.bankAccountName} \n- Account Number: ${auctioneer.paymentMethods.bankTransfer.bankAccountNumber} \n- Bank: ${auctioneer.paymentMethods.bankTransfer.bankName}\n\n2. **Easypaise**:\n- You can send payment via Easypaise: ${auctioneer.paymentMethods.easypaisa.easypaisaAccountNumber}\n\n3. **PayPal**:\n- Send payment to: ${auctioneer.paymentMethods.paypal.paypalEmail}\n\n4. **Cash on Delivery (COD)**:\n- If you prefer COD, you must pay 20% of the total amount upfront before delivery.\n- To pay the 20% upfront, use any of the above methods.\n- The remaining 80% will be paid upon delivery.\n- If you want to see the condition of your auction item then send your email on this: ${auctioneer.email}\n\nPlease ensure your payment is completed by [Payment Due Date]. Once we confirm the payment, the item will be shipped to you.\n\nThank you for participating!\n\nBest regards,\nWeBid Auction Team`;
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



// import cron from "node-cron";
// import { Auction } from "../models/auctionSchema.js";
// import { User } from "../models/userSchema.js";
// import { Bid } from "../models/bidSchema.js";
// import { sendEmail } from "../utils/sendEmail.js";
// import { calculateCommission } from "../controllers/commissionController.js";

// export const endedAuctionCron = () => {
//   cron.schedule("*/1 * * * *", async () => {
//     try {
//       const now = new Date();

//       console.log("\n========== ENDED AUCTION CRON START ==========");
//       console.log("[1] Current time:", now.toISOString());
//       console.log("[2] MongoDB readyState:", Auction.db.readyState);

//       // Lấy toàn bộ phiên đấu giá để kiểm tra dữ liệu
//       const allAuctions = await Auction.find({});

//       console.log("[3] Total auctions:", allAuctions.length);

//       allAuctions.forEach((auction, index) => {
//         console.log(`--- Auction ${index + 1} ---`);
//         console.log("ID:", auction._id);
//         console.log("Title:", auction.title);
//         console.log("Start time:", auction.startTime);
//         console.log("End time:", auction.endTime);
//         console.log("End time type:", typeof auction.endTime);
//         console.log(
//           "End time parsed:",
//           new Date(auction.endTime).toString()
//         );
//         console.log(
//           "Is ended:",
//           new Date(auction.endTime) < now
//         );
//         console.log(
//           "Commission calculated:",
//           auction.commissionCalculated
//         );
//       });

//       // Tìm các phiên đã kết thúc
//       console.log("[4] Finding ended auctions...");

//       const endedAuctions = await Auction.find({
//         endTime: { $lt: now },
//         commissionCalculated: false,
//       });

//       console.log(
//         "[5] Found ended auctions:",
//         endedAuctions.length
//       );

//       if (endedAuctions.length === 0) {
//         console.log("[INFO] No auction needs processing");
//       }

//       for (const auction of endedAuctions) {
//         try {
//           console.log("\n========================================");
//           console.log("[AUCTION] Processing:", auction._id);
//           console.log("[AUCTION] Title:", auction.title);
//           console.log("[AUCTION] Current bid:", auction.currentBid);

//           // Tính hoa hồng
//           console.log("[6] Calculating commission...");

//           const commissionAmount = await calculateCommission(
//             auction._id
//           );

//           console.log(
//             "[7] Commission amount:",
//             commissionAmount
//           );

//           // Tìm người đặt giá cao nhất
//           console.log("[8] Finding highest bidder...");

//           const highestBidder = await Bid.findOne({
//             auctionItem: auction._id,
//             amount: auction.currentBid,
//           });

//           console.log(
//             "[9] Highest bidder result:",
//             highestBidder
//           );

//           // Tìm người bán
//           console.log("[10] Finding auctioneer...");

//           const auctioneer = await User.findById(auction.createdBy);

//           console.log(
//             "[11] Auctioneer:",
//             auctioneer
//               ? {
//                   id: auctioneer._id,
//                   email: auctioneer.email,
//                   unpaidCommission: auctioneer.unpaidCommission,
//                 }
//               : null
//           );

//           if (!auctioneer) {
//             throw new Error("Auctioneer not found");
//           }

//           auctioneer.unpaidCommission = commissionAmount;

//           if (highestBidder) {
//             console.log("[12] Winner found");

//             console.log(
//               "[13] Bidder reference:",
//               highestBidder.bidder
//             );

//             const bidderId =
//               highestBidder.bidder?._id || highestBidder.bidder;

//             const bidder = await User.findById(bidderId);

//             console.log(
//               "[14] Bidder:",
//               bidder
//                 ? {
//                     id: bidder._id,
//                     userName: bidder.userName,
//                     email: bidder.email,
//                   }
//                 : null
//             );

//             if (!bidder) {
//               throw new Error("Bidder not found");
//             }

//             // Cập nhật người thắng
//             auction.highestBidder = bidder._id;
//             auction.commissionCalculated = true;

//             await auction.save();

//             console.log("[15] Auction winner saved successfully");

//             // Cập nhật thống kê người thắng
//             const updatedBidder = await User.findByIdAndUpdate(
//               bidder._id,
//               {
//                 $inc: {
//                   moneySpent: highestBidder.amount,
//                   auctionsWon: 1,
//                 },
//               },
//               { new: true }
//             );

//             console.log("[16] Winner statistics updated:", {
//               moneySpent: updatedBidder?.moneySpent,
//               auctionsWon: updatedBidder?.auctionsWon,
//             });

//             // Cập nhật hoa hồng người bán
//             const updatedAuctioneer = await User.findByIdAndUpdate(
//               auctioneer._id,
//               {
//                 $inc: {
//                   unpaidCommission: commissionAmount,
//                 },
//               },
//               { new: true }
//             );

//             console.log(
//               "[17] Auctioneer commission updated:",
//               updatedAuctioneer?.unpaidCommission
//             );

//             // Gửi email
//             const subject = `Congratulations! You won the auction for ${auction.title}`;

//             const message = `Dear ${bidder.userName},

// Congratulations! You have won the auction for ${auction.title}.

// Before proceeding for payment contact your auctioneer via your auctioneer email: ${auctioneer.email}

// Please complete your payment using one of the following methods:

// 1. Bank Transfer:
// - Account Name: ${auctioneer.paymentMethods.bankTransfer.bankAccountName}
// - Account Number: ${auctioneer.paymentMethods.bankTransfer.bankAccountNumber}
// - Bank: ${auctioneer.paymentMethods.bankTransfer.bankName}

// 2. Easypaisa:
// - Account Number: ${auctioneer.paymentMethods.easypaisa.easypaisaAccountNumber}

// 3. PayPal:
// - Send payment to: ${auctioneer.paymentMethods.paypal.paypalEmail}

// 4. Cash on Delivery (COD):
// - Pay 20% upfront before delivery.
// - The remaining 80% will be paid upon delivery.

// Thank you for participating!

// Best regards,
// WeBid Auction Team`;

//             console.log("[18] Sending email to:", bidder.email);

//             try {
//               await sendEmail({
//                 email: bidder.email,
//                 subject,
//                 message,
//               });

//               console.log("[19] Email sent successfully");
//             } catch (emailError) {
//               console.error("[EMAIL ERROR]", emailError);
//             }
//           } else {
//             console.log("[12] No highest bidder found");

//             auction.commissionCalculated = true;
//             await auction.save();

//             console.log("[13] Auction saved without winner");
//           }

//           console.log(
//             "[SUCCESS] Auction processed:",
//             auction._id
//           );

//         } catch (error) {
//           console.error(
//             "[AUCTION PROCESSING ERROR]",
//             auction._id,
//             error
//           );
//         }
//       }

//       console.log(
//         "\n========== ENDED AUCTION CRON FINISHED ==========\n"
//       );

//     } catch (error) {
//       console.error(
//         "[CRON GLOBAL ERROR]",
//         error
//       );
//     }
//   });
// };
