export function closeAllConnections(arrayOfXhrs) {
	for (let i = 0; i < arrayOfXhrs.length; i++) {
		try {
			arrayOfXhrs[i].onprogress = null;
			arrayOfXhrs[i].onload = null;
			arrayOfXhrs[i].onerror = null;
		} catch (e) {console.log(e);}
		try {
			arrayOfXhrs[i].upload.onprogress = null;
			arrayOfXhrs[i].upload.onload = null;
			arrayOfXhrs[i].upload.onerror = null;
		} catch (e) {console.log(e);}
		try {
			arrayOfXhrs[i].abort();
		} catch (e) {console.log(e);}
		try {
			delete(arrayOfXhrs[i]);
		} catch (e) {console.log(e);}
	}
}

export function handleDownloadAndUploadErrors(firstInterval, secondInterval, arrayOfXhrs) {
	closeAllConnections(arrayOfXhrs);
	if (firstInterval) {
		clearInterval(firstInterval);
	}
	if (secondInterval) {
		clearInterval(secondInterval);
	}
}

export function generateTestData(numberOfMB) {
	let array = [];
	let buffer = new ArrayBuffer(1048576);
	let bufferView = new Uint32Array(buffer);
	let upperBound = Math.pow(2, 33) - 1;
	for (let i = 0; i < bufferView.length; i++) {
		bufferView[i] = Math.floor(Math.random() * upperBound);
	}
	for (let i = 0; i < numberOfMB; i++) {
		array.push(bufferView);
	}
	let testDataBlob = new Blob(array);
	return testDataBlob;
}
