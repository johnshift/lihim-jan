const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

// eslint-disable-next-line unicorn/prefer-top-level-await
(async function () {
  try {
    // Get branch name
    const { stdout } = await exec('git diff --cached --name-only');

    const array = stdout.replace(/\n/g, ' ').split(' ');

    const tsRegex = /.+(ts|tsx)$/;
    const tsFiles = array.filter(
      (filename) => filename.length > 1 && tsRegex.test(filename),
    );

    console.log(tsFiles.join(' '));
  } catch (error) {
    console.error('stagedFiles error =', error);
  }
})();
