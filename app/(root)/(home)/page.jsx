'use client'

import useUserStore from '@/store/useUserStore'
import Greeting from '@/components/Greeting'
import Banner from '@/components/Banner'
import Notification from '@/components/Notification'
import Feed from '@/components/Feed'
import Footer from './(routes)/about/components/Footer'
import FAQ from './(faq)/faq'
import Blog from './blog/page'
import InstallPrompt from '@/components/InstallPrompt'
import InstallButton from '@/components/InstallPrompt'
import EzoicAdUnit from '@/components/ezoic/EzoicAdUnit'

// import AdUnit from '../../../components/googleads/AdUnit'

export default function Home() {
  const { userData } = useUserStore()

  return (
    <>
      <section className="flex flex-col items-center sm:mb-5">
        {/* Greeting Section */}
        {userData?.name && (
          <div className="w-full">
            <Greeting name={userData.name} />
          </div>
        )}

        {/* Banner Section */}
        <div className="w-full">
          <Banner />
        </div>

        {/* Notification Section */}
        <div className="w-full">
          <Notification />
        </div>

        {/* Feed Section */}
        <div className="w-full md:px-8 sm:mb-16">
          <InstallButton />
          <Feed
            label="RGPV Courses"
            styleHead="mt-3"
            style="md:grid-cols-5 mt-4 gap-1.5 justify-between md:justify-start"
          />
        </div>
        {/* <Blog/> */}
      </section>
      {/* <AdUnit adSlot="4693914708" adFormat="auto" fullWidth={true} /> */}

      <div className="w-full flex justify-center my-5">
        <EzoicAdUnit placeholderId="102" />
      </div>

      {/* Or for in-article native ad */}
      {/* <AdUnit
        adSlot="4693914708"
        adFormat="fluid"
        // layout="in-article"
        fullWidth={true}
      /> */}
      <FAQ />
      <Footer />
    </>
  )
}
