import { useState, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/Logo.png";
import { clearAuthSession, getStoredUser } from "../services/auth";

interface GlobalHeaderProps {
  userName?: string;
  onMockInterviewClick?: () => void;
  isStartingMockInterview?: boolean;
}

const navLinks = [
  { to: "/candidate/dashboard", label: "Bảng điều khiển", isMockInterview: false },
  { to: "#", label: "Phỏng vấn thử", isMockInterview: true },
  { to: "/candidate/jobs", label: "Việc làm", isMockInterview: false },
] as const;

export default function GlobalHeader({
  userName,
  onMockInterviewClick,
  isStartingMockInterview = false,
}: GlobalHeaderProps) {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const navigate = useNavigate();

  const [loadedName, setLoadedName] = useState<string | null>(() => (userName ? userName : null));

  useEffect(() => {
    if (userName) return;
    // small async tick to allow a loading skeleton render
    const stored = getStoredUser();
    const id = window.setTimeout(() => {
      setLoadedName(stored?.fullName ?? "Candidate");
    }, 50);

    return () => window.clearTimeout(id);
  }, [userName]);

  const effectiveUserName = userName ?? loadedName;

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <header className="candidate-jobs-header">
      <NavLink to="/" className="candidate-jobs-brand" aria-label="SEeds home">
        <img src={logo} alt="SEeds" className="candidate-jobs-brand__logo" />
        <span className="candidate-jobs-brand__name">SEeds</span>
      </NavLink>

      <nav className="candidate-jobs-nav" aria-label="Candidate navigation">
        {navLinks.map((link) =>
          link.isMockInterview ? (
            <button
              key={link.label}
              className={`candidate-jobs-nav__link candidate-jobs-nav__link--button${
                onMockInterviewClick ? "" : " candidate-jobs-nav__link--disabled"
              }`}
              type="button"
              onClick={onMockInterviewClick}
              disabled={!onMockInterviewClick || isStartingMockInterview}
            >
              {isStartingMockInterview ? "Đang tạo..." : link.label}
            </button>
          ) : (
            <NavLink
              key={link.label}
              to={link.to}
              className={({ isActive }) =>
                `candidate-jobs-nav__link${isActive ? " candidate-jobs-nav__link--active" : ""}`
              }
            >
              {link.label}
            </NavLink>
          ),
        )}
      </nav>

      <div className="candidate-jobs-user-menu">
        <button
          className="candidate-jobs-user"
          type="button"
          aria-label="User menu"
          aria-haspopup="menu"
          aria-expanded={isUserMenuOpen}
          onClick={() => setIsUserMenuOpen((current) => !current)}
        >
          <span className="candidate-jobs-user__icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M16 17v-1.5A3.5 3.5 0 0 0 12.5 12h-5A3.5 3.5 0 0 0 4 15.5V17" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M10 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>
            {effectiveUserName === null ? (
              <span className="candidate-jobs-user__skeleton" style={{display: 'inline-block', width: 120, height: 14, background: '#eef0ff', borderRadius: 6}} />
            ) : (
              effectiveUserName
            )}
          </span>
          <span className="candidate-jobs-user__chevron" aria-hidden="true">⌃</span>
        </button>

        {isUserMenuOpen ? (
          <div className="candidate-jobs-user-dropdown" role="menu">
            <NavLink className="candidate-jobs-user-dropdown__item" to="/candidate/profile/update" role="menuitem">
              Hồ sơ
            </NavLink>
            <NavLink className="candidate-jobs-user-dropdown__item" to="/candidate/profile/update" role="menuitem">
              Quản lý tài khoản
            </NavLink>
            <div className="candidate-jobs-user-dropdown__divider" />
            <button
              className="candidate-jobs-user-dropdown__item candidate-jobs-user-dropdown__logout"
              type="button"
              role="menuitem"
              onClick={handleLogout}
            >
              Đăng xuất
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
}
