(function() {
    window.changeHashPlatform = () => {
        var lochash = location.hash.toString();
        if (lochash.indexOf('tgWebAppPlatform=weba') !== -1) {
            lochash = lochash.replaceAll("tgWebAppPlatform=weba", "tgWebAppPlatform=android");
            location.hash = lochash;
            location.reload();
        } else if (lochash.indexOf('tgWebAppPlatform=web') !== -1) {
            lochash = lochash.replaceAll("tgWebAppPlatform=web", "tgWebAppPlatform=android");
            location.hash = lochash;
            location.reload();
        }
    };
    window.changeHashPlatform();
    addEventListener("hashchange", (event) => {
        window.changeHashPlatform();
    });

    const imageUrl = 'https://berasig-teleapp-production.onrender.com/_next/static/media/bee.f27a67a3.svg';
    const claimButtonText = 'claim';
    const claimBeeText = 'Claim BEE';

    let imageClickCount = 0; 
    const maxImageClicks = 5; 
    let claimButtonClicked = false; 
    let claimBeeClicked = false;

    function clearConsoleLog() {
        console.clear();
    }

    function clickImageByUrl(url) {
        const containers = document.getElementsByClassName('take-bee-fly');
        for (let container of containers) {
            const images = container.getElementsByTagName('img');
            for (let img of images) {
                if (img.src === url && imageClickCount < maxImageClicks) {
                    img.click();
                    clearConsoleLog();
                    console.log(`Image clicked! Click count: ${imageClickCount}`);
                    imageClickCount++;
                    return; 
                }
            }
        }
    }

    function clickClaimButton() {
        const claimButton = document.querySelector('button.btn.p-5.w-full:not([disabled])');
        if (claimButton && claimButton.innerText.trim() === 'Claim') {
            claimButton.click();
            clearConsoleLog();
            console.log('Claim button clicked!');
            claimButtonClicked = true; 
        } else {
            claimButtonClicked = false; 
        }
    }

    function clickClaimBeeButton() {
        const containers = document.querySelectorAll('button.btn');
        for (let container of containers) {
            if (container.innerText.trim() === claimBeeText && !container.disabled && !claimBeeClicked) {
                container.click();
                clearConsoleLog();
                console.log('Claim BEE button clicked!');
                claimBeeClicked = true;
                setTimeout(() => {
                    clickPayWithBeeCard();
                }, 500); 
                return true;
            }
        }
        return false;
    }

    function clickCloseButton() {
        const closeButton = document.querySelector('button.btn.p-5.w-full');
        if (closeButton && closeButton.innerText.trim() === 'Close') {
            closeButton.click();
            clearConsoleLog();
            console.log('Close button clicked!');
        }
    }

    function clickConfirmButton() {
        const confirmButton = document.querySelector('button.btn.p-5.w-full.flex.flex-row.gap-1.items-center h5');
        if (confirmButton && confirmButton.innerText.trim() === 'Confirm') {
            confirmButton.click();
            clearConsoleLog();
            console.log('Confirm button clicked!');
            setTimeout(() => {
                console.log('Nghỉ 5 giây');
                clickCloseButton(); 
                claimBeeClicked = false;
                console.log('Ready to click Claim BEE again');
            }, 5000);
        } else {
            setTimeout(clickConfirmButton, 500);
        }
    }

    function clickPayWithBeeCard() {
        let found = false;
        const cards = document.querySelectorAll('.card.flex-row.gap-2.items-center.w-full.cursor-pointer');
        cards.forEach(card => {
            const cardTitle = card.querySelector('.flex.flex-1.flex-col > p.font-bold.text-base');
            if (cardTitle && cardTitle.textContent.trim() === 'Pay with BEE') {
                card.click();
                clearConsoleLog();
                console.log('Clicked on the "Pay with BEE" card!');
                found = true;
                setTimeout(clickConfirmButton, 1000); 
                return;
            }
        });

        if (!found) {
            setTimeout(clickPayWithBeeCard, 500);
        }
    }

    const observer = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                imageClickCount = 0;
                clickClaimButton(); 
                break;
            }
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    const closeButtonObserver = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                clickCloseButton(); 
            }
        }
    });

    closeButtonObserver.observe(document.body, { childList: true, subtree: true });

    const claimBeeButtonObserver = new MutationObserver((mutationsList) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'childList' || mutation.type === 'subtree') {
                clickClaimBeeButton(); 
            }
        }
    });

    claimBeeButtonObserver.observe(document.body, { childList: true, subtree: true });

    function handleImageClicking() {
        if (imageClickCount < maxImageClicks) {
            clickImageByUrl(imageUrl);
            setTimeout(handleImageClicking, 500); 
        } else if (!claimButtonClicked) {
            setTimeout(clickClaimButton, 100); 
            setTimeout(handleImageClicking, 1000);
        }
    }

    handleImageClicking();

    function openIframeLinkInNewTab() {
        const iframes = document.getElementsByTagName('iframe');
        for (let iframe of iframes) {
            if (iframe.src.startsWith('https://berasig-teleapp-production.onrender.com/')) {
                const iframeSrc = iframe.src;
                window.open(iframeSrc, '_blank');
                clearConsoleLog();
                console.log(`Opened iframe link in new tab: ${iframeSrc}`);
                return true; 
            }
        }
        return false; 
    }

    const iframeObserver = new MutationObserver((mutationsList) => {
        if (openIframeLinkInNewTab()) {
            iframeObserver.disconnect(); 
        }
    });

    iframeObserver.observe(document.body, { childList: true, subtree: true });

    if (document.readyState === 'complete') {
        if (openIframeLinkInNewTab()) {
            iframeObserver.disconnect(); 
        }
    } else {
        window.addEventListener('load', () => {
            if (openIframeLinkInNewTab()) {
                iframeObserver.disconnect(); 
            }
        });
    }
})();