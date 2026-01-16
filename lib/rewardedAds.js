/**
 * Helper to show Ezoic Rewarded Video Ad
 *
 * @returns {Promise<boolean>} - Resolves true if content should be unlocked (ad watched or fallback), false if ad was closed by user
 */
export const showRewardedAd = () => {
    return new Promise((resolve) => {
        // Check if Ezoic Rewarded Ads API is available and ready
        if (
            typeof window === 'undefined' ||
            !window.ezRewardedAds ||
            !window.ezRewardedAds.ready
        ) {
            console.warn('Rewarded Ads: API not ready or not found, allowing access');
            resolve(true);
            return;
        }

        try {
            window.ezRewardedAds.requestWithOverlay(
                function (result) {
                    if (result.status) {
                        if (result.reward) {
                            console.log(
                                'Rewarded Ads: User completed ad, granting access'
                            );
                            resolve(true);
                        } else {
                            console.log(
                                'Rewarded Ads: User closed ad early, keeping content locked'
                            );
                            resolve(false);
                        }
                    } else {
                        console.warn(
                            'Rewarded Ads: Ad system error, granting access:',
                            result.msg
                        );
                        // On error (e.g. no ad fill), we usually allow access so we don't block the user
                        resolve(true);
                    }
                },
                {
                    // Text to show in the overlay
                    body: ['Watch a short ad to unlock your download'],
                },
                {
                    rewardOnNoFill: true, // Grant reward if no ad is available to show
                    alwaysCallback: true,
                }
            );
        } catch (error) {
            console.error('Rewarded Ads: Error showing ad:', error);
            // Fallback: allow access on error
            resolve(true);
        }
    });
};
