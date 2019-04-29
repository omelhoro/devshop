import * as React from "react";
import * as _ from "lodash";

export default ({ pages, currentPage, onPageChange }) => (
  <ul className="pagination" hidden={!pages}>
    <li className="page-item">
      <div
        className="page-link"
        aria-label="Previous"
        onClick={() => (currentPage > 0 ? onPageChange(currentPage - 1) : 0)}
      >
        <span aria-hidden="true">&laquo;</span>
      </div>
    </li>
    {_.range(pages).map((_page, i) => (
      <li
        key={`page-${i}`}
        onKeyPress={() => onPageChange(i)}
        onClick={() => onPageChange(i)}
        className={`${i === currentPage ? "active" : ""} page-item`}
      >
        <div className="page-link">{i + 1}</div>
      </li>
    ))}
    <li className="page-item">
      <div
        aria-label="Next"
        className="page-link"
        onClick={() =>
          currentPage < pages - 1 ? onPageChange(currentPage + 1) : 0
        }
      >
        <span aria-hidden="true">&raquo;</span>
      </div>
    </li>
  </ul>
);
