const fs = require('fs');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question('Enter the new IP address (e.g., 192.168.10.10): ', (newIp) => {
  const envFileName = '.env';

  fs.readFile(envFileName, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading .env file:', err);
      return;
    }

    const lines = data.split('\n');
    const newLines = lines.map(line => {
      if (line.startsWith('MOBILE_CSHARP_API_URL=') || line.startsWith('MOBILE_PYTHON_API_URL=')) {
        const currentValue = line.split('=')[1];
        const newUrl = currentValue.replace(/http:\/\/([0-9]{1,3}\.){3}[0-9]{1,3}/, `http://${newIp}`); // Replace the IP
        return line.split('=')[0] + '=' + newUrl;
      }
      return line;
    });

    fs.writeFile(envFileName, newLines.join('\n'), 'utf8', err => {
      if (err) {
        console.error('Error writing to .env file:', err);
        return;
      }
      console.log('IP address updated in .env');
    });
  });

  readline.close();
});