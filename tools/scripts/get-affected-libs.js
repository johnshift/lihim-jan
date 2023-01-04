const { spawn } = require('child_process');

const processArguments = process.argv.slice(2);
const TASK_NAME = processArguments[0];
const BASE_SHA = processArguments[1];
const HEAD_SHA = processArguments[2];

const exec = spawn('npx', [
  'nx',
  'print-affected',
  '--target',
  TASK_NAME,
  '--base',
  BASE_SHA,
  '--head',
  HEAD_SHA,
  '--select',
  'tasks.target.project',
  TASK_NAME === 'e2e' && '--exclude=web-e2e',
  TASK_NAME === 'build-storybook' && '--exclude=web',
]);

exec.stdout.on('data', (data) => {
  console.log(
    JSON.stringify(
      data
        .toString()
        .trim()
        .split(',')
        .map((e) => e.trim())
        .filter((e) => !!e.length),
    ),
  );
});
