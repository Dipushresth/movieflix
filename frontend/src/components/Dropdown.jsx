import { useEffect, useRef, useState } from "react";

function Dropdown({ trigger, children, className = "" }) {
  const [open, setOpen] = useState(false);

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div ref={dropdownRef} className={`dropdown-container ${className}`}>
      <div
        className="dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
      >
        {trigger}
      </div>

      {open && <div className="dropdown-menu">{children}</div>}
    </div>
  );
}

export default Dropdown;
