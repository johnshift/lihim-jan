const { spawn } = require('child_process');

const exec = spawn('npx', [
  'nx',
  'print-affected',
  '--target=build-storybook',
  '--select',
  'tasks.target.project',
]);

exec.stdout.on('data', (data) => {
  const dataStr = data.toString().trim();
  console.log(dataStr === 'web' ? 'true' : 'false');
});
