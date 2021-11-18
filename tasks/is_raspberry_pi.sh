is_raspberry_pi() {
    local model='/sys/firmware/devicetree/base/model'

    [ -r "$model" ] && grep 'Raspberry Pi' "$model" &> /dev/null
}
