import React from "react";

export default function Loader() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <svg
        width="40"
        height="40"
        viewBox="0 0 50 50"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <circle
          cx="25"
          cy="25"
          r="20"
          fill="none"
          stroke="#ccc"
          strokeWidth="5"
        />
        <path
          d="M45 25a20 20 0 0 0-20-20"
          stroke="#4B5563"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from="0 25 25"
            to="360 25 25"
            dur="1s"
            repeatCount="indefinite"
          />
        </path>
      </svg>
    </div>
  );
}
