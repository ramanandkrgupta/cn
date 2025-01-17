"use client";
import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { search } from "@/public/assets";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useDebounce } from "@/libs/hooks/useDebounce";
import { useTypewriter } from '@/libs/hooks/useTypewriter';
import { UserCircleIcon } from "@heroicons/react/24/solid";
import { useRouter } from 'next/navigation';

const Search = ({ setIsPostOpen, setPost }) => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState({ posts: [], users: [] });
  const [loading, setLoading] = useState(false);

  const placeholders = [
    "Search for Notes, PYQ's",
    "Search bt-101 pyq",
    "Search cn-201 notes",
    "Search study materials"
  ];

  const placeholderText = useTypewriter(placeholders, 100, 50, 2000);

  // Debounce search query
  const debouncedSearch = useDebounce(async (query) => {
    if (!query || query.length < 2) {
      setResults({ posts: [], users: [] });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/public/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Search error:", error);
      setResults({ posts: [], users: [] });
    } finally {
      setLoading(false);
    }
  }, 300);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchText(value);
    debouncedSearch(value);
  };

  const handleClose = () => {
    setSearchText("");
    setResults({ posts: [], users: [] });
  };

  return (
    <div className="md:flex-1 max-w-[658px] py-1.5 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-xl">
      <div className="flex flex-row">
        <div className="flex w-full">
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder={placeholderText}
            className="font-epilogue font-normal text-[16px] placeholder:text-[var(--primarySun)]
            text-white bg-transparent outline-none w-full relative
            placeholder:after:content-['|'] placeholder:after:ml-0.5 placeholder:after:animate-pulse"
          />
        </div>
        <div className="w-[100px] h-[40px] rounded-[20px] search-colour flex justify-center items-center cursor-pointer">
          {loading ? (
            <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Image
              src={search}
              alt="search icon"
              className="h-[18px] object-contain"
              width="auto"
            />
          )}
        </div>
      </div>

      {searchText && (
        <SearchDropDown
          loading={loading}
          results={results}
          searchText={searchText}
          closeSearch={handleClose}
          setIsPostOpen={setIsPostOpen}
          setPost={setPost}
        />
      )}
    </div>
  );
};

export default Search;

const SearchDropDown = ({
  loading,
  results,
  searchText,
  closeSearch,
  setIsPostOpen,
  setPost,
}) => {
  const router = useRouter();

  const handleModel = (post) => {
    setPost(post);
    setIsPostOpen(true);
  };

  const handleUserClick = (userId) => {
    console.log("Clicking user with ID:", userId); // Debug log
    closeSearch(); // Close search dropdown
    router.push(`/profile/${userId}`);
  };

  return (
    <div className="relative top-4 md:top-6 z-30 max-h-[500px] w-full rounded-3xl bg-base-300 p-4 shadow-2xl shadow-gray-800">
      <div className="sticky top-0 bg-base-300 z-10 pb-2">
        <XMarkIcon
          className="text-primary hover:text-gray-300 absolute right-4 text-lg cursor-pointer w-6 h-6"
          onClick={closeSearch}
        />
        <div className="text-black font-semibold text-xs">
          {loading ? (
            "Searching..."
          ) : (
            <>
              {(results.posts?.length || 0) + (results.users?.length || 0)} <span>results for</span> "{searchText}"
            </>
          )}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px] space-y-2 pr-2 scrollbar-thin scrollbar-track-[#1c1c24] scrollbar-thumb-primary scrollbar-thumb-rounded-full">
        {/* Users Section */}
        {results.users?.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-2">People</h3>
            {results.users.map((user) => (
              <div
                key={user.id}
                className="flex items-center space-x-3 p-2 hover:bg-[#2c2f32] rounded-lg cursor-pointer"
                onClick={() => handleUserClick(user.id)}
              >
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8 text-gray-400" />
                )}
                <div>
                  <p className="text-secondary font-medium">{user.name}</p>
                  <p className="text-xs text-gray-400">{user.university || user.email}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Posts Section */}
        {results.posts?.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-400 mb-2">Posts</h3>
            {results.posts.map((post) => (
              <div
                key={post.id}
                title={`file Details : \n subject name : ${post.subject_name} \n semester : ${post.semester_code} \n course name : ${post.course_name}`}
                className="flex rounded-lg py-2 px-3 w-full hover:bg-[#2c2f32] justify-between items-center cursor-pointer"
                onClick={() => handleModel(post)}
              >
                <p className="text-secondary font-medium">{post.title}</p>
                <p className="text-gray-400 text-sm">{post.category}</p>
              </div>
            ))}
          </div>
        )}

        {/* No Results Message */}
        {!loading && !results.posts?.length && !results.users?.length && (
          <div className="text-center text-gray-400 py-4">
            No results found for "{searchText}"
          </div>
        )}
      </div>
    </div>
  );
};