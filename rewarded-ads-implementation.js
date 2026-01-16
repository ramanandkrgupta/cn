(function () {
  var downloadButton = document.querySelector('div.min-h-screen.bg-base-100 > main > section > div > div.flex-1.max-sm\\:w-full.max-w-\\[1280px\\].mx-auto.sm\\:pr-2 > div.container > div.items-center > div.grid.grid-cols-2.lg\\:grid-cols-5.gap-3.sm\\:gap-4 > div:nth-child(1) > div > div.p-3.border-t.border-base-300.bg-base-100 > div.flex.md\\:flex-row.items-center.justify-between.gap-2 > div.flex.gap-2 > button.btn.btn-primary.btn-sm');

  if (!downloadButton) {
    console.warn('Rewarded Ads: Download button not found');
    return;
  }

  var adShownFlag = false;
  var originalOnClickHandlers = [];

  function executeDownloadAction() {
    try {
      if (downloadButton.onclick) {
        downloadButton.onclick.call(downloadButton);
      }

      var clickEvent = new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
        view: window
      });
      downloadButton.dispatchEvent(clickEvent);
    } catch (error) {
      console.error('Rewarded Ads: Error executing download action:', error);
    }
  }

  function showRewardedAd(event) {
    if (adShownFlag) {
      return;
    }

    event.preventDefault();
    event.stopPropagation();

    if (!window.ezRewardedAds || !window.ezRewardedAds.ready) {
      console.warn('Rewarded Ads: API not ready, allowing download');
      executeDownloadAction();
      return;
    }

    try {
      window.ezRewardedAds.requestWithOverlay(
        function (result) {
          if (result.status) {
            if (result.reward) {
              console.log('Rewarded Ads: User completed ad, granting download access');
              adShownFlag = true;
              executeDownloadAction();
            } else {
              console.log('Rewarded Ads: User closed ad early, keeping content locked');
            }
          } else {
            console.warn('Rewarded Ads: Ad system error, granting download access:', result.msg);
            executeDownloadAction();
          }
        },
        {
          body: ['Watch a short ad to unlock your download']
        },
        {
          rewardOnNoFill: false,
          alwaysCallback: true
        }
      );
    } catch (error) {
      console.error('Rewarded Ads: Error showing ad:', error);
      executeDownloadAction();
    }
  }

  downloadButton.addEventListener('click', showRewardedAd, true);

  console.log('Rewarded Ads: Download button integration complete');
})();