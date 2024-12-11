"use client";
import { useState, useCallback } from "react";
import Image from "next/image";
import { search } from "@/public/assets";
import { XMarkIcon } from "@heroicons/react/20/solid";
import { useDebounce } from "@/libs/hooks/useDebounce";

const Search = ({ setIsPostOpen, setPost }) => {
  const [searchText, setSearchText] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  // Debounce search query
  const debouncedSearch = useDebounce(async (query) => {
    if (!query || query.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `/api/v1/public/search?q=${encodeURIComponent(query)}`
      );
      if (!response.ok) throw new Error("Search failed");
      const data = await response.json();
      setResults(data.posts);
    } catch (error) {
      console.error("Search error:", error);
      setResults([]);
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
    setResults([]);
  };

  return (
    <div className="md:flex-1 max-w-[658px] py-1.5 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-xl">
      <div className="flex flex-row ">
        <div className="flex w-full">
          <input
            type="text"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search for Notes, PYQ's"
            className="font-epilogue font-normal text-[16px] placeholder:text-[var(--primarySun)] text-white bg-transparent outline-none w-full"
          />
        </div>
        <div className="w-[100px] h-[40px] rounded-[20px] search-colour flex justify-center items-center cursor-pointer">
          {loading ? (
            <div className="w-[18px] h-[18px] border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <Image
              src={search}
              alt="search icon"
              className="w-[18px] h-[18px] object-contain"
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
  const handleModel = (post) => {
    setPost(post);
    setIsPostOpen(true);
    closeSearch();
  };

  return (
    <div className="relative top-4 md:top-6 z-50 max-h-[500px] w-full rounded-3xl bg-[#1c1c24] p-4 shadow-2xl shadow-gray-800">
      <div className="sticky top-0 bg-[#1c1c24] z-10 pb-2">
        <XMarkIcon
          className="text-[#32CD32] hover:text-gray-300 absolute right-4 text-lg cursor-pointer w-6 h-6"
          onClick={closeSearch}
        />
        <div className="text-white font-semibold text-xs">
          {loading ? (
            "Searching..."
          ) : (
            <>
              {results.length} <span>results for</span> "{searchText}"
            </>
          )}
        </div>
      </div>

      <div className="overflow-y-auto max-h-[400px] space-y-2 pr-2 scrollbar-thin scrollbar-track-[#1c1c24] scrollbar-thumb-[#32CD32] scrollbar-thumb-rounded-full">
        {results.map((post) => (
          <div
            key={post.id}
            title={`file Details : \n subject name : ${post.subject_name} \n semester : ${post.semester_code} \n course name : ${post.course_name}`}
            className="flex rounded-full py-2 px-3 w-full hover:bg-[#2c2f32] justify-between items-center cursor-pointer"
            onClick={() => handleModel(post)}
          >
            <p className="text-white font-medium">{post.title}</p>
            <p className="text-gray-400 text-sm">{post.category}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
