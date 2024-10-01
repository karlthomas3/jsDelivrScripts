/** @format */

(function () {
	// Configuration
	const MAX_ATTEMPTS = 20;
	const CHECK_INTERVAL = 100; // milliseconds

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
		const targetUrl = getQueryParam('url');
		const clickId = getCookie('rtkclickid-store');
		if (targetUrl) {
			const url = new URL(targetUrl);
			url.searchParams.append('clickid', clickId);
			return url.toString();
		}
		return null;
	}

	// Function to check RedTrack completion and redirect
	function checkAndRedirect(attempts = 0) {
		if (isRedTrackComplete()) {
			console.log('RedTrack ClickID set. Redirecting...');
			const finalRedirectUrl = constructRedirectUrl();
			if (finalRedirectUrl) {
				alert(`Redirecting to: ${finalRedirectUrl}`);
				console.log(`Redirecting to: ${finalRedirectUrl}`);
				window.location.href = finalRedirectUrl;
			} else {
				console.error('Target URL is missing.');
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
				alert(`Redirecting to: ${finalRedirectUrl}`);
				console.log(`Redirecting to: ${finalRedirectUrl}`);
				window.location.href = finalRedirectUrl;
			} else {
				console.error('Target URL is missing.');
			}
		}
	}

	// Start the check when the script loads
	checkAndRedirect();
})();
