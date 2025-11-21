import React from "react";
import "./Pagination.css";

function Pagination({ page, setPage, totalPages }) {
  const createPageNumbers = () => {
    const pages = [];
    pages.push(1);

    if (page > 3) pages.push("...");

    for (let p = page - 1; p <= page + 1; p++) {
      if (p > 1 && p < totalPages) pages.push(p);
    }

    if (page < totalPages - 2) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);

    return pages;
  };

  const pageNumbers = createPageNumbers();

  return (<div className="pagination-container">
      {/* 1. 왼쪽 화살표 */}
      <span
        className="nav-btn-left"
        onClick={() => page > 1 && setPage(page - 1)}
      ></span>

      {/* 2. ✨ 페이지 번호 래퍼 추가: 이 영역의 너비를 고정할 것입니다. */}
      <div className="page-numbers-wrapper"> 
        {pageNumbers.map((num, idx) => (
          <span
            key={idx}
            className={`page-item ${num === page ? "active" : ""} ${
              num === "..." ? "dots" : ""
            }`}
            onClick={() => num !== "..." && setPage(num)}
          >
            {num}
          </span>
        ))}
      </div>

      {/* 3. 오른쪽 화살표 */}
      <span
        className="nav-btn-right"
        onClick={() => page < totalPages && setPage(page + 1)}
      ></span>
    </div>
  );
}

export default Pagination;
