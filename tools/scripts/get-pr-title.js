// Get branchname (provided as first arg)
// e.g. node tools/scripts/get-pr-title.js my-branch-name
const branchName = process.argv.slice(2)[0];

// Get index of "/" separator
const separatorIndex = Math.max(0, branchName.indexOf('/'));

// Append prefix (branch chars before separator)
// title += `${branchName.slice(separatorIndex, separatorIndex)}`;

const prefix = branchName.slice(0, separatorIndex) + ': ';

// Suffix string (branch chars after separator)
const suffix = branchName
  .slice(separatorIndex + 1, branchName.length)
  .replaceAll('-', ' ')
  .replaceAll('_', '-');

// Print label (used by repo-sync step)
// const title = suffix.charAt(0).toUpperCase() + suffix.slice(1);
const title = prefix + suffix;
console.log(title);
