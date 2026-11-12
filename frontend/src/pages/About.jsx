import React from "react";
import {
  FaShieldAlt,
  FaLightbulb,
  FaUsers,
  FaHeart,
  FaBullseye,
  FaHandshake,
  FaGavel,
  FaArrowRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const About = () => {
  const values = [
    {
      id: 1,
      title: "Uy tín và minh bạch",
      description:
        "Đề cao sự trung thực, công khai thông tin và xây dựng môi trường đấu giá công bằng, đáng tin cậy.",
      icon: <FaShieldAlt />,
    },
    {
      id: 2,
      title: "Không ngừng đổi mới",
      description:
        "Ứng dụng công nghệ để cải thiện nền tảng, tối ưu quy trình và mang đến trải nghiệm thuận tiện.",
      icon: <FaLightbulb />,
    },
    {
      id: 3,
      title: "Kết nối cộng đồng",
      description:
        "Tạo cầu nối giữa người mua và người bán, giúp mọi người dễ dàng khám phá và trao đổi sản phẩm.",
      icon: <FaUsers />,
    },
    {
      id: 4,
      title: "Lấy người dùng làm trung tâm",
      description:
        "Chú trọng trải nghiệm, sự thuận tiện và khả năng tiếp cận các chức năng của hệ thống.",
      icon: <FaHeart />,
    },
  ];

  return (
    <section className="min-h-screen w-full px-5 pt-20 pb-12 lg:pl-[320px] bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">

        <div className="relative overflow-hidden bg-[#D6482B] px-7 py-12 md:px-12 md:py-16 text-white">
          <div className="relative z-10 max-w-3xl">
            <span className="inline-block border border-white/50 px-4 py-2 text-sm font-semibold mb-5">
              CHÀO MỪNG ĐẾN VỚI WEBID
            </span>

            <h1 className="text-4xl md:text-6xl font-bold mb-5">
              Kết nối giá trị,
              <br />
              Khởi đầu cuộc đấu giá
            </h1>

            <p className="text-base md:text-xl text-white/90 leading-relaxed">
              Nền tảng đấu giá trực tuyến giúp kết nối người mua và người bán,
              mang đến trải nghiệm tìm kiếm, theo dõi và tham gia đấu giá thuận
              tiện.
            </p>

            <Link
              to="/auctions"
              className="inline-flex items-center gap-3 mt-8 bg-white text-[#D6482B] font-bold px-6 py-3 hover:bg-stone-100 transition"
            >
              Khám phá phiên đấu giá
              <FaArrowRight />
            </Link>
          </div>

          <FaGavel className="absolute -right-5 -bottom-10 text-white/10 text-[240px] md:text-[320px]" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div>
            <span className="text-[#D6482B] font-bold uppercase tracking-wider text-sm">
              Về chúng tôi
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-3 mb-5">
              WeBid – Nền tảng đấu giá trực tuyến
            </h2>

            <p className="text-stone-600 text-lg leading-8">
              WeBid được xây dựng nhằm ứng dụng công nghệ vào hoạt động đấu
              giá, tạo ra một không gian trực tuyến giúp người dùng dễ dàng
              tiếp cận các phiên đấu giá và tham gia đặt giá.
            </p>

            <p className="text-stone-600 text-lg leading-8 mt-4">
              Hệ thống hỗ trợ người bán tạo và quản lý phiên đấu giá, đồng
              thời giúp người mua theo dõi thông tin sản phẩm, lịch sử đặt
              giá và tham gia đấu giá một cách thuận tiện.
            </p>
          </div>

          <div className="bg-white p-8 border border-stone-200 shadow-sm">
            <div className="w-16 h-16 bg-orange-50 text-[#D6482B] flex items-center justify-center text-3xl mb-5">
              <FaGavel />
            </div>

            <h3 className="text-2xl font-bold text-stone-800 mb-3">
              Trải nghiệm đấu giá hiện đại
            </h3>

            <p className="text-stone-600 leading-7">
              Theo dõi các phiên đấu giá, cập nhật thông tin và tham gia đặt
              giá trên cùng một nền tảng. WeBid hướng đến sự đơn giản, rõ ràng
              và thuận tiện trong từng thao tác.
            </p>
          </div>
        </div>

        <div className="bg-white p-7 md:p-10 border border-stone-200 shadow-sm">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="shrink-0 w-16 h-16 bg-orange-50 text-[#D6482B] flex items-center justify-center text-3xl">
              <FaBullseye />
            </div>

            <div>
              <span className="text-[#D6482B] font-bold text-sm uppercase tracking-wider">
                Định hướng phát triển
              </span>

              <h2 className="text-3xl font-bold text-stone-800 mt-2 mb-4">
                Sứ mệnh của chúng tôi
              </h2>

              <p className="text-stone-600 text-lg leading-8">
                WeBid hướng đến việc xây dựng một nền tảng đấu giá trực tuyến
                thuận tiện, minh bạch và dễ sử dụng. Chúng tôi mong muốn kết
                nối hiệu quả giữa người mua và người bán, hỗ trợ quá trình tổ
                chức, quản lý và tham gia các phiên đấu giá thông qua những
                chức năng thiết thực.
              </p>
            </div>
          </div>
        </div>

        <div>
          <div className="mb-8">
            <span className="text-[#D6482B] font-bold text-sm uppercase tracking-wider">
              Điều chúng tôi hướng đến
            </span>

            <h2 className="text-3xl md:text-4xl font-bold text-stone-800 mt-3">
              Giá trị cốt lõi
            </h2>

            <p className="text-stone-500 mt-3 max-w-2xl">
              Những giá trị định hướng quá trình xây dựng và phát triển nền
              tảng WeBid.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {values.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 border border-stone-200 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-14 h-14 flex items-center justify-center bg-orange-50 text-[#D6482B] text-2xl mb-5">
                  {item.icon}
                </div>

                <h3 className="text-xl font-bold text-stone-800 mb-3">
                  {item.title}
                </h3>

                <p className="text-stone-500 leading-7">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white p-7 border border-stone-200 shadow-sm">
            <div className="text-[#D6482B] text-3xl mb-4">
              <FaHandshake />
            </div>

            <h3 className="text-2xl font-bold text-stone-800 mb-4">
              Câu chuyện của WeBid
            </h3>

            <p className="text-stone-600 leading-8">
              WeBid ra đời từ mong muốn xây dựng một ứng dụng đấu giá trực
              tuyến, nơi người dùng có thể kết nối, khám phá sản phẩm và tham
              gia các phiên đấu giá. Nền tảng tập trung vào việc hỗ trợ người
              bán quản lý phiên đấu giá và giúp người mua dễ dàng theo dõi,
              lựa chọn sản phẩm phù hợp.
            </p>
          </div>

          <div className="bg-white p-7 border border-stone-200 shadow-sm">
            <div className="text-[#D6482B] text-3xl mb-4">
              <FaUsers />
            </div>

            <h3 className="text-2xl font-bold text-stone-800 mb-4">
              Đồng hành cùng cộng đồng
            </h3>

            <p className="text-stone-600 leading-8">
              Dù bạn là người mua, người bán hay người yêu thích hoạt động
              đấu giá, WeBid luôn hướng đến việc mang lại một môi trường thuận
              tiện để khám phá sản phẩm, theo dõi phiên đấu giá và kết nối với
              cộng đồng người dùng.
            </p>
          </div>
        </div>

        <div className="bg-stone-900 text-white text-center px-6 py-12 md:py-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Bắt đầu hành trình đấu giá của bạn!
          </h2>

          <p className="text-stone-300 text-lg max-w-2xl mx-auto leading-8">
            Khám phá những phiên đấu giá hấp dẫn và trải nghiệm các tiện ích
            mà WeBid mang lại.
          </p>

          <Link
            to="/auctions"
            className="inline-flex items-center gap-3 mt-7 bg-[#D6482B] hover:bg-[#b8381e] px-7 py-3 font-bold transition"
          >
            Khám phá ngay
            <FaArrowRight />
          </Link>
        </div>

        <p className="text-center text-stone-500 text-sm">
          © WeBid. Nền tảng đấu giá trực tuyến.
        </p>
      </div>
    </section>
  );
};

export default About;
