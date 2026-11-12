import Card from "@/custom-components/Card";
import Spinner from "@/custom-components/Spinner";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAuctionItems } from "@/store/slices/auctionSlice";

const Auctions = () => {
  const dispatch = useDispatch();

  const {
    allAuctions,
    loading,
    currentPage,
    totalPages,
    totalItems,
  } = useSelector((state) => state.auction);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");

  const categories = [
    { value: "Thiết bị điện tử", label: "Thiết bị điện tử" },
    { value: "Nghệ thuật và đồ cổ", label: "Nghệ thuật và đồ cổ" },
    { value: "Trang sức và đồng hồ", label: "Trang sức và đồng hồ" },
    { value: "Phương tiện", label: "Phương tiện" },
    { value: "Thời trang và phụ kiện", label: "Thời trang và phụ kiện" },
    { value: "Vật phẩm lưu niệm thể thao", label: "Vật phẩm lưu niệm thể thao" },
    { value: "Sách và bản thảo", label: "Sách và bản thảo" },
    { value: "Khác", label: "Khác" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(getAllAuctionItems(keyword.trim(), category, 1));
  };

  const handleReset = () => {
    setKeyword("");
    setCategory("");
    dispatch(getAllAuctionItems("", "", 1));
  };

  // Chuyển trang
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages || loading) return;

    dispatch(getAllAuctionItems(keyword.trim(), category, page));
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <article className="w-full ml-0 m-0 h-fit px-5 pt-20 lg:pl-[320px] flex flex-col">
          <section className="my-8">
            <h1 className="text-[#d6482b] text-2xl font-bold mb-6 min-[480px]:text-4xl md:text-6xl xl:text-7xl 2xl:text-8xl">
              Danh sách phiên đấu giá
            </h1>

            {/* Tìm kiếm và lọc danh mục */}
            <form
              onSubmit={handleSearch}
              className="flex flex-wrap gap-3 mb-8"
            >
              <input
                type="text"
                placeholder="Nhập tên sản phẩm cần tìm..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                className="w-full md:w-80 border border-gray-400 px-4 py-3 outline-none"
              />

              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="border border-gray-400 px-4 py-3 outline-none"
              >
                <option value="">Tất cả danh mục</option>

                {categories.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>

              <button
                type="submit"
                className="bg-[#d6482b] text-white px-6 py-3 hover:bg-[#b83b23]"
              >
                Tìm kiếm
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="border border-gray-400 px-6 py-3 hover:bg-gray-100"
              >
                Đặt lại
              </button>
            </form>

            {/* Danh sách phiên đấu giá */}
            <div className="flex flex-wrap gap-6">
              {allAuctions && allAuctions.length > 0 ? (
                allAuctions.map((element) => (
                  <Card
                    title={element.title}
                    startTime={element.startTime}
                    endTime={element.endTime}
                    imgSrc={element.image?.url}
                    startingBid={element.startingBid}
                    id={element._id}
                    key={element._id}
                  />
                ))
              ) : (
                <p className="text-gray-500 text-lg">
                  Không tìm thấy phiên đấu giá phù hợp.
                </p>
              )}
            </div>

            {/* Phân trang */}
            {totalItems > 0 && totalPages > 1 && (
              <div className="flex flex-col items-center gap-4 mt-10 mb-6">
                <p className="text-gray-600">
                  Trang {currentPage} / {totalPages} 
                  {" - "}Tổng cộng {totalItems} phiên đấu giá
                </p>

                <div className="flex flex-wrap justify-center items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Trước
                  </button>

                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      className={`min-w-10 px-3 py-2 border ${
                        currentPage === page
                          ? "bg-[#d6482b] text-white border-[#d6482b]"
                          : "border-gray-400 hover:bg-gray-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-400 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
                  >
                    Sau
                  </button>
                </div>
              </div>
            )}
          </section>
        </article>
      )}
    </>
  );
};

export default Auctions;
