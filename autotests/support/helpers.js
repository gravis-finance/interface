import axios from 'axios';
import fs from 'fs';
import zip from 'cross-zip';
import path from 'path';

module.exports = {
  sleep: async ms => {
    return new Promise(resolve => setTimeout(resolve, ms))
  },
  getMetamaskReleases: async version => {
    let filename;
    let downloadUrl;

    const response = await axios.get(
      'https://api.github.com/repos/metamask/metamask-extension/releases',
    );

    if (version === 'latest' || !version) {
      filename = response.data[0].assets[0].name;
      downloadUrl = response.data[0].assets[0].browser_download_url;
    } else if (version) {
      filename = `metamask-chrome-${version}.zip`;
      downloadUrl = `https://github.com/MetaMask/metamask-extension/releases/download/v${version}/metamask-chrome-${version}.zip`;
    }

    return {
      filename,
      downloadUrl,
    };
  },
  download: async (url, destination) => {
    const writer = fs.createWriteStream(destination);
    const result = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
    });
    await new Promise(resolve =>
      result.data.pipe(writer).on('finish', resolve),
    );
  },
  extract: async (file, destination) => {
    await zip.unzip(file, destination);
  },
  prepareMetamask: async version => {
    const release = await module.exports.getMetamaskReleases(version);
    const downloadsDirectory = path.resolve(__dirname, 'downloads');
    if (!fs.existsSync(downloadsDirectory)) {
      fs.mkdirSync(downloadsDirectory);
    }
    const downloadDestination = path.join(downloadsDirectory, release.filename);
    await module.exports.download(release.downloadUrl, downloadDestination);
    const metamaskDirectory = path.join(downloadsDirectory, 'metamask');
    await module.exports.extract(downloadDestination, metamaskDirectory);
    await module.exports.sleep(1000);
    return metamaskDirectory;
  },
};