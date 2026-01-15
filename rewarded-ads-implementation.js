(function() {
  function initRewardedAds() {
    try {
      const downloadButtonSelectors = [
        'button[type="button"]',
        'button.rounded-full',
        'button:not([aria-label])',
        'a[href*="download"]',
        'button'
      ];

      let downloadButton = null;

      for (const selector of downloadButtonSelectors) {
        const elements = document.querySelectorAll(selector);
        for (const element of elements) {
          const text = element.textContent.toLowerCase();
          if (text.includes('download') || 
              element.classList.contains('download') ||
              element.getAttribute('aria-label')?.toLowerCase().includes('download')) {
            downloadButton = element;
            break;
          }
        }
        if (downloadButton) break;
      }

      if (!downloadButton) {
        console.warn('[Ezoic Rewarded Ads] Download button not found, will retry in 2 seconds');
        setTimeout(initRewardedAds, 2000);
        return;
      }

      console.log('[Ezoic Rewarded Ads] Download button found:', downloadButton);

      downloadButton.setAttribute('data-google-interstitial', 'false');

      const originalOnClick = downloadButton.onclick;
      const originalHref = downloadButton.href;

      function handleDownloadClick(event) {
        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();

        if (!window.ezRewardedAds || !window.ezRewardedAds.ready) {
          console.warn('[Ezoic Rewarded Ads] Rewarded ads not ready');
          return;
        }

        try {
          window.ezRewardedAds.requestWithOverlay(
            function(result) {
              if (result.status) {
                if (result.reward) {
                  console.log('[Ezoic Rewarded Ads] Reward granted, allowing download');
                  grantDownloadAccess();
                } else {
                  console.log('[Ezoic Rewarded Ads] User closed ad early, keeping download locked');
                }
              } else {
                console.warn('[Ezoic Rewarded Ads] Ad system error:', result.msg);
              }
            },
            {
              header: "Watch ad to download ?",
              body: ["Support us to keep our website running .. "],
              accept: "Watch 30 sec ad ",
              cancel: "Cancel"
            },
            {
              rewardName: "Download ",
              rewardOnNoFill: false
            }
          );
        } catch (error) {
          console.error('[Ezoic Rewarded Ads] Error showing ad:', error);
        }
      }

      function grantDownloadAccess() {
        console.log('[Ezoic Rewarded Ads] Granting download access');
        
        try {
          if (originalOnClick) {
            originalOnClick.call(downloadButton);
          } else if (originalHref) {
            window.location.href = originalHref;
          } else {
            downloadButton.removeEventListener('click', handleDownloadClick, true);
            downloadButton.click();
            setTimeout(function() {
              downloadButton.addEventListener('click', handleDownloadClick, true);
            }, 100);
          }
        } catch (error) {
          console.error('[Ezoic Rewarded Ads] Error executing original action:', error);
        }
      }

      downloadButton.onclick = null;
      if (downloadButton.href) {
        downloadButton.removeAttribute('href');
      }
      
      downloadButton.addEventListener('click', handleDownloadClick, true);

      console.log('[Ezoic Rewarded Ads] Successfully initialized on download button');

    } catch (error) {
      console.error('[Ezoic Rewarded Ads] Initialization error:', error);
    }
  }

  function executeWhenReady() {
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      initRewardedAds();
    } else {
      document.addEventListener('DOMContentLoaded', initRewardedAds);
    }
  }

  executeWhenReady();
})();