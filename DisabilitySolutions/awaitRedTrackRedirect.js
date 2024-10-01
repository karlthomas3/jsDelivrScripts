/** @format */

(function () {
	// Configuration
	const MAX_ATTEMPTS = 20;
	const CHECK_INTERVAL = 100; // milliseconds
	const FALLBACK_URL = 'https://jobs.disabilitytalent.org'; // Fallback URL if 'url' is missing

	// Function to get a query parameter by name
	function getQueryParam(name) {
		const urlParams = new URLSearchParams(window.location.search);
		return urlParams.get(name);
	}

	// Function to check if RedTrack has set the ClickID cookie
	function isRedTrackComplete() {
		return !!getCookie('rtkclickid-store');
	}

	// Function to get a cookie value by name
	function getCookie(name) {
		const value = `; ${document.cookie}`;
		const parts = value.split(`; ${name}=`);
		if (parts.length === 2) return parts.pop().split(';').shift();
	}

	// Function to construct the final redirect URL
	function constructRedirectUrl() {
		let targetUrl = getQueryParam('url') || FALLBACK_URL;
		const clickId = getCookie('rtkclickid-store');

		if (!clickId) {
			console.warn('RedTrack ClickID is missing.');
		}

		// Ensure the targetUrl is a valid URL
		if (!/^https?:\/\//i.test(targetUrl)) {
			targetUrl = 'http://' + targetUrl;
		}

		try {
			const url = new URL(targetUrl);
			url.searchParams.append(
				'clickid',
				encodeURIComponent(clickId || '')
			);
			return url.toString();
		} catch (error) {
			console.error('Invalid target URL:', targetUrl);
			return null;
		}
	}

	// Function to check RedTrack completion and redirect
	function checkAndRedirect(attempts = 0) {
		if (isRedTrackComplete()) {
			console.log('RedTrack ClickID set. Redirecting...');
			const finalRedirectUrl = constructRedirectUrl();
			if (finalRedirectUrl) {
				console.log(`Redirecting to: ${finalRedirectUrl}`);
				window.location.href = finalRedirectUrl;
			} else {
				console.error('Unable to construct redirect URL.');
			}
		} else if (attempts < MAX_ATTEMPTS) {
			console.log(
				`Waiting for RedTrack ClickID. Attempt ${
					attempts + 1
				}/${MAX_ATTEMPTS}`
			);
			setTimeout(() => checkAndRedirect(attempts + 1), CHECK_INTERVAL);
		} else {
			console.warn(
				'RedTrack ClickID not set in time. Redirecting anyway...'
			);
			const finalRedirectUrl = constructRedirectUrl();
			if (finalRedirectUrl) {
				console.log(`Redirecting to: ${finalRedirectUrl}`);
				window.location.href = finalRedirectUrl;
			} else {
				console.error('Unable to construct redirect URL.');
			}
		}
	}

	// Start the check when the script loads
	checkAndRedirect();
})();
