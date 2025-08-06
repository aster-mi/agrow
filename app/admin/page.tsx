import Link from "next/link";
const AdminIndexPage = () => {
  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">管理ページ</h1>
        <div className="mt-8">
          <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
              <Link href="/admin/sl">
                <div className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900 truncate">
                        ショートリンク発行
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
            <li className="col-span-1 bg-white rounded-lg shadow divide-y divide-gray-200">
              <Link href="/admin/news">
                <div className="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-lg font-medium text-gray-900 truncate">
                        ニュース管理
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminIndexPage;
