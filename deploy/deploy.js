const express = require('express');
const { exec } = require('child_process');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Deployment Service');
});

app.post('/deploy', (req, res) => {
  console.log("proses deploy . . . ");

  exec('deploy.bat', { cwd: '../' }, (err, stdout, stderr) => {
    if (err) {
      console.error(`Exec error: ${err}`);
      return res.status(500).send('Deploy Failed');
    }

    console.log(stdout);
    return res.send('Deploy OK');
  });
});

app.listen(4000, () => {
  console.log('Webhook listener on port 4000');
});
