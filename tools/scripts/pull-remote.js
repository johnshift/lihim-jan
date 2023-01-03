/**
 * This script is used to cleanup branch after successful merge.
 */

const util = require('node:util');
const exec = util.promisify(require('node:child_process').exec);

// eslint-disable-next-line unicorn/prefer-top-level-await
(async function () {
  try {
    // Get branch name
    const { stdout: branchName } = await exec(
      'git rev-parse --abbrev-ref HEAD',
    );

    // Checkout main
    await exec('git checkout main');

    // Delete branch
    await exec(`git branch -D ${branchName}`);

    // Delete remote branch
    await exec(`HUSKY=0 git push origin :${branchName}`);

    // Pull origin main
    await exec('git pull origin main --rebase');
  } catch (error) {
    console.error('remove-branch error =', error);
  }
})();
