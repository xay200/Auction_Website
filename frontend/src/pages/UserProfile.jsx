import Spinner from "@/custom-components/Spinner";
import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.user);
  const navigateTo = useNavigate();
  useEffect(() => {
    if (!isAuthenticated) {
      navigateTo("/");
    }
  }, [isAuthenticated]);
  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-start">
        {loading ? (
          <Spinner />
        ) : (
          <>
            <div className="bg-white mx-auto w-full h-auto px-2 flex flex-col gap-4 items-center py-4 justify-center rounded-md">
              <img
                src={user.profileImage?.url}
                alt="/imageHolder.jpg"
                className="w-36 h-36 rounded-full"
              />

              <div className="mb-6 w-full">
                <h3 className="text-xl font-semibold mb-4">Thông tin cá nhân</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Tên người dùng
                    </label>
                    <input
                      type="text"
                      defaultValue={user.userName}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Email
                    </label>
                    <input
                      type="text"
                      defaultValue={user.email}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Số điện thoại
                    </label>
                    <input
                      type="number"
                      defaultValue={user.phone}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Địa chỉ
                    </label>
                    <input
                      type="text"
                      defaultValue={user.address}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Vai trò
                    </label>
                    <input
                      type="text"
                      defaultValue={user.role}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Ngày tham gia
                    </label>
                    <input
                      type="text"
                      defaultValue={user.createdAt?.substring(0, 10)}
                      className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {user.role === "Auctioneer" && (
                <div className="mb-6 w-full">
                  <h3 className="text-xl font-semibold mb-4">
                    Thông tin thanh toán
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên ngân hàng
                      </label>
                      <input
                        type="text"
                        defaultValue={user.paymentMethods.bankTransfer.bankName}
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số tài khoản ngân hàng
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user.paymentMethods.bankTransfer.bankAccountNumber
                        }
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên chủ tài khoản
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user.paymentMethods.bankTransfer.bankAccountName
                        }
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Số thẻ
                      </label>
                      <input
                        type="text"
                        defaultValue={
                          user.paymentMethods.easypaisa.easypaisaAccountNumber
                        }
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Email Thanh Toán
                      </label>
                      <input
                        type="text"
                        defaultValue={user.paymentMethods.paypal.paypalEmail}
                        className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                        disabled
                      />
                    </div>
                  </div>
                </div>
              )}

              <div className="mb-6 w-full">
                <h3 className="text-xl font-semibold mb-4">
                  Thông tin khác
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.role === "Auctioneer" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Hoa hồng chưa thanh toán
                        </label>
                        <input
                          type="text"
                          defaultValue={user.unpaidCommission}
                          className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                          disabled
                        />
                      </div>
                    </>
                  )}
                  {user.role === "Bidder" && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Số phiên đấu giá đã thắng
                        </label>
                        <input
                          type="text"
                          defaultValue={user.auctionsWon}
                          className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                          disabled
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Tổng số tiền đã chi
                        </label>
                        <input
                          type="text"
                          defaultValue={user.moneySpent}
                          className="w-ful mt-1 p-2 border-gray-300 rounded-md focus:outline-none"
                          disabled
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </>
  );
};

export default UserProfile;
