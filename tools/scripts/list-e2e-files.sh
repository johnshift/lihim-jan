cd apps/web-e2e/src/e2e;

declare -a testfiles;

for i in `find -name "*.cy.ts" -type f`; 
do
	testfiles+=("$( echo $i | cut -c 3-)")
done;

json_array() {
  echo -n '['
  while [ $# -gt 0 ]; do
    x=${1//\\/\\\\}
    echo -n \"${x//\"/\\\"}\"
    [ $# -gt 1 ] && echo -n ', '
    shift
  done
  echo ']'
}

json_array ${testfiles[@]}