"use client";

import { useState } from "react";
import { filterPosts } from "@/libs/hooks/usefilter";
import Search from "../Search";

const SearchFn = ({ posts, setIsPostOpen, setPost }) => {
  const [searchText, setSearchText] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);
  const [searchedResults, setSearchedResults] = useState([]);

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout);
    setSearchText(e.target.value);
    setSearchTimeout(
      setTimeout(() => {
        const searchResult = filterPosts(e.target.value, posts);
        setSearchedResults(searchResult);
      }, 500)
    );
  };

  const handleCloseSearch = () => {
    setSearchText("");
  };

  return (
    <div className="relative z-10 md:flex-1 max-w-[1024px]">
      <Search
        results={searchedResults}
        searchText={searchText}
        setSearchText={setSearchText}
        onChangeValue={handleSearchChange}
        setIsPostOpen={setIsPostOpen}
        setPost={setPost}
      />
    </div>
  );
};

export default SearchFn;
