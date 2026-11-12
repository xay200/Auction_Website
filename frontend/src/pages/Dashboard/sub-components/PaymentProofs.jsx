import {
  deletePaymentProof,
  getSinglePaymentProofDetail,
  updatePaymentProof,
} from "@/store/slices/superAdminSlice";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";

const PaymentProofs = () => {
  const { paymentProofs, singlePaymentProof } = useSelector(
    (state) => state.superAdmin
  );
  const [openDrawer, setOpenDrawer] = useState(false);
  const dispatch = useDispatch();

  const handlePaymentProofDelete = (id) => {
    dispatch(deletePaymentProof(id));
  };

  const handleFetchPaymentDetail = (id) => {
    dispatch(getSinglePaymentProofDetail(id));
  };

  useEffect(() => {
    if (singlePaymentProof && Object.keys(singlePaymentProof).length > 0) {
      setOpenDrawer(true);
    }
  }, [singlePaymentProof]);

  return (
    <>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white mt-5">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="w-1/3 py-2">ID Người dùng</th>
              <th className="w-1/3 py-2">Trạng thái</th>
              <th className="w-1/3 py-2">Thao tác</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {paymentProofs.length > 0 ? (
              paymentProofs.map((element, index) => {
                return (
                  <tr key={index}>
                    <td className="py-2 px-4 text-center">{element.userId}</td>
                    <td className="py-2 px-4 text-center">{element.status}</td>
                    <td className="flex items-center py-4 justify-center gap-3">
                      <button
                        className="bg-blue-500 text-white py-1 px-3 rounded hover:bg-blue-700 transition-all duration-300"
                        onClick={() => handleFetchPaymentDetail(element._id)}
                      >
                        Cập nhật
                      </button>
                      <button
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-700 transition-all duration-300"
                        onClick={() => handlePaymentProofDelete(element._id)}
                      >
                        Xóa
                      </button>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr className="text-center text-xl text-sky-600 py-3">
                <td>	Không tìm thấy minh chứng thanh toán nào.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Drawer setOpenDrawer={setOpenDrawer} openDrawer={openDrawer} />
    </>
  );
};

export default PaymentProofs;

export const Drawer = ({ setOpenDrawer, openDrawer }) => {
  const { singlePaymentProof, loading } = useSelector(
    (state) => state.superAdmin
  );
  const [amount, setAmount] = useState(singlePaymentProof.amount || "");
  const [status, setStatus] = useState(singlePaymentProof.status || "");

  const dispatch = useDispatch();
  const handlePaymentProofUpdate = () => {
    dispatch(updatePaymentProof(singlePaymentProof._id, status, amount));
  };

  return (
    <>
      <section
        className={`fixed ${
          openDrawer && singlePaymentProof.userId ? "bottom-0" : "-bottom-full"
        }  left-0 w-full transition-all duration-300 h-full bg-[#00000087] flex items-end`}
      >
        <div className="bg-white h-fit transition-all duration-300 w-full">
          <div className="w-full px-5 py-8 sm:max-w-[640px] sm:m-auto">
            <h3 className="text-[#D6482B]  text-3xl font-semibold text-center mb-1">
              Cập nhật minh chứng thanh toán
            </h3>
            <p className="text-stone-600">
              Bạn có thể cập nhật trạng thái và số tiền thanh toán.
            </p>
            <form className="flex flex-col gap-5 my-5">
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600 ">ID</label>
                <input
                  type="text"
                  value={singlePaymentProof.userId || ""}
                  disabled
                  onChange={(e) => e.target.value}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none  text-stone-600"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Số tiền</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none"
                />
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Trạng thái</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none"
                >
                  <option value="Pending">Đang chờ duyệt</option>
                  <option value="Approved">Đã phê duyệt</option>
                  <option value="Rejected">Từ chối</option>
                  <option value="Settled">Đã thanh toán</option>
                </select>
              </div>
              <div className="flex flex-col gap-3">
                <label className="text-[16px] text-stone-600">Ghi chú</label>
                <textarea
                  rows={5}
                  value={singlePaymentProof.comment || ""}
                  onChange={(e) => e.target.value}
                  disabled
                  className="text-xl px-1 py-2 bg-transparent border-[1px] border-stone-600  rounded-md focus:outline-none text-stone-600"
                />
              </div>
              <div>
                <Link
                  to={singlePaymentProof.proof?.url || ""}
                  className="bg-[#D6482B] flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-[#b8381e]"
                  target="_blank"
                >
                  Ảnh minh chứng
                </Link>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-blue-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-blue-700"
                  onClick={handlePaymentProofUpdate}
                >
                  {loading ? "	Cập nhật minh chứng" : "	Cập nhật minh chứng"}
                </button>
              </div>
              <div>
                <button
                  type="button"
                  className="bg-yellow-500 flex justify-center w-full py-2 rounded-md text-white font-semibold text-xl transition-all duration-300 hover:bg-yellow-700"
                  onClick={() => setOpenDrawer(false)}
                >
                  Hủy
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};
