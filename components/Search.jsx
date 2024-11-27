/* eslint-disable react/no-unescaped-entities */
import Image from 'next/image'
import { search } from '@/public/assets'
import { XMarkIcon } from '@heroicons/react/20/solid'

const Search = ({
  results,
  searchText,
  onChangeValue,
  setSearchText,
  setIsPostOpen,
  setPost,
}) => {
  return (
    <div className="md:flex-1 max-w-[658px] py-1.5 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
      <div className="flex flex-row ">
        <div className="flex w-full">
          <input
            type="text"
            value={searchText}
            onChange={onChangeValue}
            placeholder="Search for Notes, PYQ`s"
            className="font-epilogue font-normal text-[16px] placeholder:text-[var(--primarySun)] text-white bg-transparent outline-none"
          />
        </div>
        <div className="w-[100px] h-[40px] rounded-[20px] search-colour flex justify-center items-center cursor-pointer">
          <Image
            src={search}
            alt="search icon"
            className="w-[18px] h-[18px] object-contain"
            width="auto"
          />
        </div>
      </div>
      {searchText && (
        <SearchDropDown
          result={results}
          searchText={searchText}
          closeSearch={setSearchText}
          setIsPostOpen={setIsPostOpen}
          setPost={setPost}
        />
      )}
    </div>
  )
}

export default Search

const SearchDropDown = ({
  result,
  searchText,
  closeSearch,
  setIsPostOpen,
  setPost,
}) => {
  const handleClose = () => {
    closeSearch('')
  }

  const handleModel = (post) => {
    setPost(post)
    setIsPostOpen(true)
  }

  return (
    <div className="relative top-4 md:top-6 z-50 max-h-[500px] w-full rounded-3xl bg-[#1c1c24] p-4 shadow-2xl shadow-gray-800">
      <div className="sticky top-0 bg-[#1c1c24] z-10 pb-2">
        <XMarkIcon
          className="text-[#32CD32] hover:text-gray-300 absolute right-4 text-lg  cursor-pointer w-6 h-6"
          onClick={handleClose}
        />
        <div className="">
          {result.length} <span> results for</span> "{searchText}"
        </div>
      </div>
      <div className="overflow-y-auto max-h-[400px] space-y-2 pr-2 scrollbar-thin scrollbar-track-[#1c1c24] scrollbar-thumb-[#32CD32] scrollbar-thumb-rounded-full">
        {result?.map((post, index) => {
          let title = post.title.slice(0, 22)
          let shouldShowDots = post.title.length > 100
          console.log(shouldShowDots)
          return (
            <div
              key={index}
              title={`file Details : \n subject name : ${post.subject_name} \n semester : ${post.semester_code} \n course name : ${post.course_name}`}
              className="flex rounded-full py-2 px-3 w-full hover:bg-[#2c2f32] justify-between items-center"
              onClick={() => handleModel(post)}
            >
              {/* <p className="text-white font-medium sm:hidden">
              {shouldShowDots ? `${title}...` : title}
            </p> */}
              <p className="text-white font-medium">{post.title}</p>
              <p className="text-gray-400 text-sm">{post.category}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
