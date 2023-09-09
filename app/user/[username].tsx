import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

function UserProfile() {
  const router = useRouter();
  const { username } = router.query;
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // ユーザー情報を取得するAPIリクエストを実行
    // この部分は実際のデータ取得と適切に統合する必要があります
    // 以下は仮の例です
    async function fetchUserData() {
      try {
        const response = await fetch(`/api/user/${username}`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    }

    if (username) {
      fetchUserData();
    }
  }, [username]);

  if (!username) {
    return <p>Loading...</p>;
  }

  if (!userData) {
    return <p>User not found</p>;
  }

  return (
    <div>
      <h1>{userData.username}'s Profile</h1>
      <p>Name: {userData.name}</p>
      <p>Email: {userData.email}</p>
      {/* 他のプロフィール情報を表示 */}
    </div>
  );
}

export default UserProfile;
