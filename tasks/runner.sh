set -e

[ -r '.env' ] && source '.env'
COVERAGE_FOLDER=$(node './tasks/get-coverage-folder.js')
DEFAULT_BRANCH=$(git remote show origin | grep 'HEAD branch' | cut -c 16-)
ENVIRONMENT=${ENVIRONMENT:-'development'}
LOG_FILE=${LOG_FILE:-$(mktemp -t 'foosball.XXXXXXXXXX')}
OUTPUT_FOLDER=$(node './tasks/get-output-folder.js')
ROOT_FOLDER=$(node './tasks/get-root-folder.js')
TASK=$(basename "$0")

has_main() {
    type -t main | grep 'function' &> /dev/null
}

is_raspberry_pi() {
    local model='/sys/firmware/devicetree/base/model'

    [ -r "$model" ] && grep 'Raspberry Pi' "$model" &> /dev/null
}

throw() {
    local error=$1
    local message=$2

    printf 'ERROR_%s\n%s\n\n' "$error" "$message" 1>&2
    return 1
}

has_main || throw 'NO_MAIN' "task \"$TASK\" has no main declaration"
main "$@"
