set -e

[ -r '.env' ] && source '.env'
COVERAGE_DIRECTORY=$(node './tasks/get-coverage-directory.js')
ENVIRONMENT=${ENVIRONMENT:-'development'}
OUTPUT_DIRECTORY=$(node --eval 'require("./tsconfig.json").compilerOptions.outDir' --print)
TASK=$(basename "$0")

is_raspberry_pi() {
    local model='/sys/firmware/devicetree/base/model'

    [ -r "$model" ] && grep 'Raspberry Pi' "$model" &> /dev/null
}

no_main() {
    [ "$(type -t main)" != 'function' ]
}

throw() {
    local error=$1
    local message=$2

    printf 'ERROR_%s\n' "$error" 1>&2
    printf '%s\n' "$message" 1>&2

    return 1
}

runner() {
    no_main && throw 'NO_MAIN' "task \"$TASK\" has no main declaration"
    main "$@"
}

runner "$@"
