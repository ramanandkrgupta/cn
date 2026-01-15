'use client'
import { useEffect } from 'react'

const EzoicAdUnit = ({ placeholderId }) => {
    useEffect(() => {
        if (window.ezstandalone) {
            // Define the placeholder
            try {
                if (!window.ezstandalone.enabled) {
                    window.ezstandalone.cmd.push(function () {
                        window.ezstandalone.define(placeholderId);
                        window.ezstandalone.enable();
                        window.ezstandalone.display();
                    });
                } else {
                    window.ezstandalone.cmd.push(function () {
                        window.ezstandalone.define(placeholderId);
                        window.ezstandalone.display();
                    });
                }
            } catch (e) {
                console.error("Ezoic Ad Error", e);
            }
        }
    }, [placeholderId])

    // If no placeholderId is provided, don't render anything to avoid errors
    if (!placeholderId) return null;

    return (
        <div className="flex justify-center my-4 overflow-hidden">
            {/* The placeholder div must not have any styling that restricts size, but centering wrapper is okay */}
            <div id={`ezoic-pub-ad-placeholder-${placeholderId}`}></div>
        </div>
    )
}

export default EzoicAdUnit
