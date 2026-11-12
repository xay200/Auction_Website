import React from "react";
import {
  FaUser,
  FaGavel,
  FaEnvelope,
  FaDollarSign,
  FaFileInvoice,
  FaRedo,
} from "react-icons/fa";

const HowItWorks = () => {
  const steps = [
    {
      icon: <FaUser />,
      title: "Đăng ký tài khoản",
      description:
        "Người dùng cần đăng ký hoặc đăng nhập để thực hiện các chức năng như đăng phiên đấu giá, đặt giá, truy cập trang quản lý cá nhân và gửi minh chứng thanh toán.",
    },
    {
      icon: <FaGavel />,
      title: "Lựa chọn vai trò",
      description:
        'Người dùng có thể đăng ký với vai trò "Người mua" hoặc "Người bán". Người mua có thể tham gia đặt giá cho các sản phẩm, trong khi người bán có thể đăng sản phẩm và tạo phiên đấu giá.',
    },
    {
      icon: <FaEnvelope />,
      title: "Thông báo trúng đấu giá",
      description:
        "Sau khi một phiên đấu giá kết thúc, người mua có mức giá cao nhất sẽ nhận được email thông báo trúng đấu giá kèm theo thông tin phương thức thanh toán của người bán.",
    },
    {
      icon: <FaDollarSign />,
      title: "Thanh toán hoa hồng",
      description:
        "Sau khi người mua hoàn tất thanh toán, người bán có trách nhiệm trích 5% giá trị giao dịch để thanh toán hoa hồng cho nền tảng. Nếu không hoàn thành nghĩa vụ thanh toán, người bán sẽ không thể đăng sản phẩm mới và có thể nhận được thông báo nhắc nhở.",
    },
    {
      icon: <FaFileInvoice />,
      title: "Minh chứng thanh toán",
      description:
        "Nền tảng tiếp nhận minh chứng thanh toán dưới dạng ảnh chụp màn hình cùng với tổng số tiền đã chuyển. Sau khi quản trị viên xác nhận, khoản hoa hồng chưa thanh toán của người bán sẽ được cập nhật tương ứng.",
    },
    {
      icon: <FaRedo />,
      title: "Đăng lại sản phẩm",
      description:
        "Nếu người mua không hoàn tất thanh toán, người bán có thể đăng lại sản phẩm để mở một phiên đấu giá mới mà không phải chịu thêm chi phí.",
    },
  ];

  return (
    <>
      <section className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col min-h-screen py-4 justify-center">
        <h1
          className={`text-[#d6482b] text-2xl font-bold mb-2 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl`}
        >
          	Tìm hiểu cách thức hoạt động của WeBid
        </h1>
        <div className="flex flex-col gap-4 my-5">
          {steps.map((element, index) => {
            return (
              <div
                key={index}
                className="bg-white rounded-md p-2 lg:p-5 flex flex-col gap-2 group hover:bg-black transition-all duration-300"
              >
                <div className="bg-black text-white p-3 text-xl rounded-full w-fit group-hover:bg-[#d6482b] transition-all duration-300">
                  {element.icon}
                </div>
                <h3
                  className={`text-[#D6482B] text-xl font-semibold mb-2 min-[480px]:text-xl md:text-2xl lg:text-3xl`}
                >
                  {element.title}
                </h3>
                <p className="text-xl text-stone-700 group-hover:text-[#fff] transition-all duration-300">
                  {element.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
};

export default HowItWorks;
