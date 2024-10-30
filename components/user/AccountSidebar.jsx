import Link from 'next/link';

const AccountSidebar = ({ userRole }) => {
  return (
    <div className="sidebar">
      <ul>
        <li>
          <Link href="/account">Account</Link>
        </li>
        {userRole === 'ADMIN' || userRole === 'MANAGER' ? (
          <>
            <li>
              <Link href="/dashboard">Admin Panel</Link>
            </li>
            {/* Add more admin-specific links here */}
          </>
        ) : (
          <>
            {/* Add more user-specific links here */}
          </>
        )}
      </ul>
    </div>
  );
};

export default AccountSidebar;